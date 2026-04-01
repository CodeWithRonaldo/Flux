import { useEffect, useRef } from "react";
import { useAudio } from "../../hooks/useAudio";
import { useFetchSubscription } from "../../hooks/useFetchSubscription";
import { useVibetraxHook } from "../../hooks/useVibetraxHook";
import useFetchUsers from "../../hooks/useFetchUsers";

const StreamEarnTracker = () => {
  const { currentUser } = useFetchUsers();
  const { currentTrack, currentTime } = useAudio();
  const { subscription, isSubscribed } = useFetchSubscription();
  const { streamMusic } = useVibetraxHook();
  const streamedRef = useRef(new Set());

  useEffect(() => {
    if (!isSubscribed || !subscription || !currentTrack) return;
    if (currentTime < 30) return;

    const musicId = currentTrack.music_id;
    if (streamedRef.current.has(musicId)) return;

    if (currentUser.owner === currentTrack.artist?.user_address) return; // Don't track if the artist is streaming their own music
    if (currentUser.owner === currentTrack.current_owner?.user_address) return; // Don't track if the current owner is streaming their own music

    const name = subscription.subscriber?.name || currentUser?.role || "user";
    const role = currentUser?.role || "listener";

    streamedRef.current.add(musicId);
    streamMusic({
      musicId,
      subscriptionId: subscription.id,
      streamerName: name,
      streamerRole: role,
    }).then((result) => {
      if (!result) streamedRef.current.delete(musicId);
    });
  }, [
    isSubscribed,
    currentTrack?.music_id,
    subscription?.id,
    currentTime,
    streamMusic,
    currentUser,
    currentTrack,
    subscription,
  ]);

  return null;
};

export default StreamEarnTracker;
