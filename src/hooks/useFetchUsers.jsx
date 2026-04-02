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

  const { data: userEvents } = useIotaClientQuery(
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

  const currentEvent = userEvents?.[0];

  const { data: userProfileObject } = useIotaClientQuery(
    "getObject",
    {
      id: currentEvent?.profile_id,
      options: {
        showContent: true,
      },
    },
    {
      enabled: !!currentEvent?.profile_id,
      refetchInterval: 3000, // keep the UI updated with live streams/likes
      select: (data) => {
        if (!data?.data?.content?.fields) return null;
        return data.data.content.fields;
      },
    },
  );

  return {
    registeredArtists,
    currentUser: currentEvent,
    userProfile: userProfileObject, // This contains stream_count, like_count, etc.
    isLoading,
  };
};

export default useFetchUsers;
