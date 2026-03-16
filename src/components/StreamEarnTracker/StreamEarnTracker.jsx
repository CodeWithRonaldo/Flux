import { useEffect, useRef } from "react";
import { useAudio } from "../../hooks/useAudio";
import { useFetchSubscription } from "../../hooks/useFetchSubscription";
import { useVibetraxHook } from "../../hooks/useVibetraxHook";

const StreamEarnTracker = ({ currentUser }) => {
  const { currentTrack, currentTime } = useAudio();
  const { subscription, isSubscribed } = useFetchSubscription();
  const { streamMusic } = useVibetraxHook();
  const streamedRef = useRef(new Set());

  useEffect(() => {
    if (!isSubscribed || !subscription || !currentTrack) return;
    if (currentTime < 30) return;

    const musicId = currentTrack.music_id;
    if (streamedRef.current.has(musicId)) return;

    const name = subscription.subscriber?.name || currentUser?.[0]?.role || "user";
    const role = currentUser?.[0]?.role || "listener";

    streamedRef.current.add(musicId);
    streamMusic({ musicId, subscriptionId: subscription.id, streamerName: name, streamerRole: role })
      .then((result) => {
        if (!result) streamedRef.current.delete(musicId);
      });
  }, [isSubscribed, currentTrack?.music_id, subscription?.id, currentTime]);

  return null;
};

export default StreamEarnTracker;
