import { useNetworkVariable } from "../config/networkConfig";
import { useIotaClient, useIotaClientQuery } from "@iota/dapp-kit";
import { useQuery } from "@tanstack/react-query";

export const useFetchMusic = () => {
  const vibeTraxPackageId = useNetworkVariable("vibeTraxPackageId");
  const client = useIotaClient();

  const { data: musicIds, isPending: isEventsPending, isError } = useIotaClientQuery(
    "queryEvents",
    { query: { MoveEventType: `${vibeTraxPackageId}::vibetrax::MusicUploaded` } },
    { select: (data) => data.data.map((x) => x.parsedJson.music_id) }
  );

  const { data: musics, isPending: isObjectsPending } = useQuery({
    queryKey: ["musicObjects", musicIds],
    enabled: !!musicIds && musicIds.length > 0,
    queryFn: async () => {
      const objects = await client.multiGetObjects({
        ids: musicIds,
        options: { showContent: true },
      });
      return objects
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
        });
    },
  });

  return {
    musics: musics ?? [],
    isPending: isEventsPending || isObjectsPending,
    isError,
  };
};
