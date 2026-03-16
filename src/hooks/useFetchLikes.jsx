import { useIotaClientQuery } from "@iota/dapp-kit";
import { useNetworkVariable } from "../config/networkConfig";
import { useIota } from "./useIota";

export const useFetchLikes = () => {
  const vibeTraxPackageId = useNetworkVariable("vibeTraxPackageId");
  const { address } = useIota();

  const { data: liked, isLoading } = useIotaClientQuery(
    "queryEvents",
    {
      query: {
        MoveEventType: `${vibeTraxPackageId}::vibetrax::MusicLiked`,
      },
    },
    {
      select: (data) =>
        data.data
          .flatMap((x) => x.parsedJson)
          .filter((y) => y.liker.user_address === address),
      refetchInterval: 3000,
    }
  );

  return { liked, isLikeLoading: isLoading };
};
