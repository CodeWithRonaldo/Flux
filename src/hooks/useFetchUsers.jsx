import { useIotaClientQuery } from "@iota/dapp-kit";
import { useNetworkVariables } from "../config/networkConfig";
import { useIota } from "./useIota";

const useFetchUsers = () => {
  const { vibeTraxPackageId } = useNetworkVariables("vibeTraxPackageId");
  const { address } = useIota();

  const { data: registeredArtists, isLoading } = useIotaClientQuery(
    "queryEvents",
    {
      query: {
        MoveEventType: `${vibeTraxPackageId}::vibetrax::UserRegistered`,
      },
    },
    {
      select: (data) =>
        data.data
          .flatMap((x) => x.parsedJson)
          .filter((y) => y.role === "artist"),
      refetchInterval: 3000,
    },
  );

  const { data: currentUser } = useIotaClientQuery(
    "queryEvents",
    {
      query: {
        MoveEventType: `${vibeTraxPackageId}::vibetrax::UserRegistered`,
      },
    },
    {
      select: (data) =>
        data.data
          .flatMap((x) => x.parsedJson)
          .filter((y) => y.owner === address),
      refetchInterval: 3000,
    },
  );

  return {
    registeredArtists,
    currentUser: currentUser?.[0],
    isLoading,
  };
};

export default useFetchUsers;
