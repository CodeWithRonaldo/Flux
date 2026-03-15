import { useIotaClientQuery } from "@iota/dapp-kit";
import { useNetworkVariable } from "../config/networkConfig";
import { useIota } from "./useIota";

export const useFetchSubscription = () => {
  const vibeTraxPackageId = useNetworkVariable("vibeTraxPackageId");
  const { address } = useIota();

  const {
    data: subscription,
    isPending,
    refetch,
  } = useIotaClientQuery(
    "getOwnedObjects",
    {
      owner: address ?? "",
      filter: {
        StructType: `${vibeTraxPackageId}::vibetrax::Subscription`,
      },
      options: { showContent: true },
    },
    {
      enabled: !!address,
      select: (data) => {
        const obj = data.data?.[0];
        if (!obj?.data?.content?.fields) return null;
        const f = obj.data.content.fields;
        return {
          id: obj.data.objectId,
          expiry_ms: Number(f.expiry_ms),
          subscriber: f.subscriber?.fields ?? f.subscriber,
          price: f.price,
          daily_vibe_earned: f.daily_vibe_earned,
          pending_vibe: Number(f.pending_vibe ?? 0),
        };
      },
    },
  );

  const now = Date.now();
  const isSubscribed = !!subscription && subscription.expiry_ms > now;
  const isExpired = !!subscription && subscription.expiry_ms <= now;

  return { subscription, isSubscribed, isExpired, isPending, refetch };
};
