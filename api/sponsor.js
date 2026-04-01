import { Transaction } from "@iota/iota-sdk/transactions";
import { Ed25519Keypair } from "@iota/iota-sdk/keypairs/ed25519";
import { getFullnodeUrl, IotaClient } from "@iota/iota-sdk/client";

// Keep your private key extremely safe!
// When you deploy to Vercel, you will paste the secret key into the Vercel Dashboard Settings -> Environment Variables.
// For local testing in `vercel dev`, you will put it in a `.env` file at the root.

export default async function handler(req, res) {
  // Read inside the handler so it catches dynamic environment variables
  const SPONSOR_SECRET_KEY = process.env.SPONSOR_SECRET_KEY;

  // Only accept POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    if (
      !SPONSOR_SECRET_KEY ||
      SPONSOR_SECRET_KEY.includes("YOUR_TREASURY_SECRET_KEY")
    ) {
      throw new Error(
        "Sponsor secret key is not set in the environment variables.",
      );
    }

    const { txJSON } = req.body;
    if (!txJSON) {
      return res.status(400).json({ error: "Missing txJSON in request body" });
    }

    // Connect to the testnet (or mainnet later)
    const client = new IotaClient({ url: getFullnodeUrl("testnet") });

    // Initialize the Gas Station keypair
    const sponsorKeypair = Ed25519Keypair.fromSecretKey(SPONSOR_SECRET_KEY);
    const sponsorAddress = sponsorKeypair.toIotaAddress();

    // Reconstruct the transaction block from the frontend JSON
    const tx = Transaction.from(txJSON);

    // Tell the network that your Treasury/Sponsor wallet will pay the gas
    tx.setGasOwner(sponsorAddress);

    // Build the final transaction block bytes
    const transactionBlockBytes = await tx.build({ client });

    // Sponsor signs the final bytes covering the gas
    const sponsorSignature = await sponsorKeypair.signTransaction(
      transactionBlockBytes,
    );

    // Send back the modified transaction bytes and the sponsor's signature
    return res.status(200).json({
      txBytes: Buffer.from(transactionBlockBytes).toString("base64"),
      sponsorSignature: sponsorSignature.signature,
    });
  } catch (error) {
    console.error("Error sponsoring transaction:", error);
    return res
      .status(500)
      .json({ error: error.message || "Internal Server Error" });
  }
}
