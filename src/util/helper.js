import { PinataSDK } from "pinata";

const pinata = new PinataSDK({
  pinataJwt: import.meta.env.VITE_PINATA_JWT,
  pinataGateway: import.meta.env.VITE_PINATA_GATEWAY,
});

export const formatAddress = (address) => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
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

export const getPinataUrl = (cid) => {
  return `https://${import.meta.env.VITE_PINATA_GATEWAY}/ipfs/${cid}`;
};
