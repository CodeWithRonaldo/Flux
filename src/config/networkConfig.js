import { createNetworkConfig } from "@iota/dapp-kit";
import { getFullnodeUrl } from "@iota/iota-sdk/client";

import {
  VIBETRAX_COIN_MANAGER_ID,
  VIBETRAX_PACKAGE_ID,
  VIBETRAX_TREASURY_ID,
} from "./constant.js";

const { networkConfig, useNetworkVariable, useNetworkVariables } =
  createNetworkConfig({
    testnet: {
      url: getFullnodeUrl("testnet"),
      variables: {
        vibeTraxPackageId: VIBETRAX_PACKAGE_ID,
        vibeTraxTreasuryId: VIBETRAX_TREASURY_ID,
        vibeTraxCoinManagerId: VIBETRAX_COIN_MANAGER_ID,
      },
    },
  });

export { useNetworkVariable, useNetworkVariables, networkConfig };
