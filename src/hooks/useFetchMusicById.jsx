import { useIotaClientQuery } from "@iota/dapp-kit";

export const useFetchMusicById = (id) => {
  const {
    data: music,
    isPending,
    isError,
  } = useIotaClientQuery(
    "getObject",
    {
      id: id,
      options: {
        showContent: true,
        showDisplay: true,
      },
    },
    {
      enabled: true,
      refetchInterval: 3000,
      select: (data) => {
        const f = data.data.content.fields;
        return {
          music_id: data.data.objectId,
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
      },
    },
  );

  return {
    music: music ?? null,
    isPending,
    isError,
  };
};
