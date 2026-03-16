import { useIotaClientQuery } from "@iota/dapp-kit";
import { useNetworkVariable } from "../config/networkConfig";
import { useIota } from "./useIota";

export const useFetchLikes = () => {
  const vibeTraxPackageId = useNetworkVariable("vibeTraxPackageId");
  const { address } = useIota();

  const { data: likedIds, isLoading } = useIotaClientQuery(
    "queryEvents",
    {
      query: {
        And: [
          {
            MoveEventType: `${vibeTraxPackageId}::vibetrax::MusicLiked`,
          },
          {
            Sender: address ?? "",
          },
        ],
      },
      limit: 1000,
    },
    {
      enabled: !!address,
      select: (data) =>
        new Set(data.data.map((e) => e.parsedJson?.music_id).filter(Boolean)),
      refetchInterval: 3000,
    },
  );

  return { likedIds: likedIds ?? new Set(), isLoading };
};
