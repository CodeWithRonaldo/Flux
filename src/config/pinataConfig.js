import { PinataSDK } from "pinata";

export const pinata = new PinataSDK({
  pinataJwt: import.meta.env.VITE_PINATA_JWT,
  pinataGateway: "example-gateway.mypinata.cloud",
});