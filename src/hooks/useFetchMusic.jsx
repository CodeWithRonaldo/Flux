import { useState, useEffect } from "react";
import { useNetworkVariable } from "../config/networkConfig";
import { useIotaClientQuery } from "@iota/dapp-kit";

export const useFetchMusic = () => {
  const [musics, setMusics] = useState([]);
  const vibeTraxPackageId = useNetworkVariable("vibeTraxPackageId");

  const {
    data,
    isPending: isEventsPending,
    isError,
  } = useIotaClientQuery(
    "queryEvents",
    {
      query: {
        MoveEventType: `${vibeTraxPackageId}::vibetrax::MusicUploaded`,
      },
    },
    {
      select: (data) => data.data.map((x) => x.parsedJson.music_id),
    },
  );

  const musicIds = data || [];

  const { data: musicObjects, isPending: isObjectsPending } =
    useIotaClientQuery(
      "multiGetObjects",
      {
        ids: musicIds,
        options: {
          showContent: true,
        },
      },
      {
        enabled: musicIds.length > 0,
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
                collaborators: (f.collaborators ?? []).map(
                  (c) => c.fields ?? c,
                ),
              };
            }),
      },
    );

  useEffect(() => {
    if (!isEventsPending && musicObjects) {
      setMusics(musicObjects);
    }
  }, [musicObjects, isEventsPending]);

  return {
    musics: musics ?? [],
    isPending: isEventsPending || isObjectsPending,
    isError,
  };
};
