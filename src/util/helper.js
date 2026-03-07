import { log } from "@web3auth/modal";
import { pinata } from "../config/pinataConfig";

export const formatAddress = (address) => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};



export const uploadToPinata = async (file) => {
try{

  const upload = await pinata.upload.public.file(file);
  return upload.cid
} catch (error){
  console.log(error);
  
}

}