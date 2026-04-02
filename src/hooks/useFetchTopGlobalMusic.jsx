import { useNetworkVariable } from "../config/networkConfig";
import { useIotaClientQuery } from "@iota/dapp-kit";

export const useFetchTopGlobalMusic = () => {
  const vibeTraxPackageId = useNetworkVariable("vibeTraxPackageId");

  const {
    data: boostEvents,
    isPending: isEventsPending,
    isError: isEventsError,
  } = useIotaClientQuery(
    "queryEvents",
    {
      query: {
        MoveEventType: `${vibeTraxPackageId}::vibetrax::MusicBoosted`,
      },
      order: "descending",
    },
    {
      select: (data) => data.data.map((x) => x.parsedJson.music_id),
    },
  );

  const boostMusicIds = [...new Set(boostEvents || [])];

  const {
    data: musicObjects,
    isPending: isObjectsPending,
    isError: isObjectsError,
  } = useIotaClientQuery(
    "multiGetObjects",
    {
      ids: boostMusicIds,
      options: {
        showContent: true,
      },
    },
    {
      enabled: boostMusicIds.length > 0,
      refetchInterval: 3000,
      select: (data) =>
        data
          .filter((obj) => obj.data?.content?.fields)
          .map((obj) => {
            const f = obj.data.content.fields;
            return {
              music_id: obj.data.objectId,
              title: f.title,
              description: f.description,
              genre: f.genre,
              music_image: f.music_image,
              preview_music: f.preview_music,
              full_music: f.full_music,
              price: f.price,
              for_sale: f.for_sale,
              likes: f.likes,
              streaming_count: f.streaming_count,
              boost_expiry_ms: f.boost_expiry_ms,
              creation_time: f.creation_time,
              artist: f.artist?.fields ?? f.artist,
              current_owner: f.current_owner?.fields ?? f.current_owner,
              collaborators: (f.collaborators ?? []).map((c) => c.fields ?? c),
            };
          })
          .filter((song) => Number(song.boost_expiry_ms) > Date.now())
          .sort((a, b) => Number(b.streaming_count) - Number(a.streaming_count))
          .slice(0, 100),
    },
  );

  const topGlobalMusics = !isEventsPending && musicObjects ? musicObjects : [];

  return {
    topGlobalMusics,
    isPending:
      isEventsPending || (boostMusicIds.length > 0 && isObjectsPending),
    isError: isEventsError || isObjectsError,
  };
};
