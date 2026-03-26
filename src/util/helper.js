import { PinataSDK } from "pinata";

const pinata = new PinataSDK({
  pinataJwt: import.meta.env.VITE_PINATA_JWT,
  pinataGateway: import.meta.env.VITE_PINATA_GATEWAY,
});

export const formatAddress = (address) => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const formatPrice = (price) => {
  return (price / 1000_000_000).toFixed(2);
};

export const uploadToPinata = async (file) => {
  try {
    const upload = await pinata.upload.public.file(file);
    console.log("uploadcid", upload.cid);
    return upload.cid;
  } catch (error) {
    console.log(error);
  }
};


export const getContractError = (err) => {
  const errorStr = err?.message || String(err);
  const abortCode = parseInt(errorStr.split("Abort Code: ")[1]);

  const errors = {
    1:  "This track is not available for purchase",
    2:  "Invalid price set for this track",
    3:  "Invalid royalty configuration",
    4:  "Only the artist can perform this action",
    5:  "Only the current owner can perform this action",
    6:  "This transfer is not allowed",
    7:  "Insufficient balance",
    8:  "Invalid track metadata",
    9:  "Invalid streaming request",
    10: "Duplicate collaborator detected",
    11: "Address mismatch",
    12: "You've already liked this track",
    13: "You've already streamed this track",
    14: "Your subscription has expired",
    15: "Subscription does not belong to this account",
    16: "Invalid boost plan selected",
    17: "You are not authorized to perform this action",
    18: "No rewards available to claim",
  };

  return errors[abortCode] ?? "Transaction failed. Please try again.";
};
