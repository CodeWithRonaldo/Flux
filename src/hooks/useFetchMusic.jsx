import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useNetworkVariable } from "../config/networkConfig";
import { useIotaClientQuery } from "@iota/dapp-kit";

export const useFetchMusic = () => {
  const [musics, setMusics] = useState([]);
  const vibeTraxPackageId = useNetworkVariable("vibeTraxPackageId");

  const {
    data: musicData,
    isPending,
    isError,
  } = useIotaClientQuery(
    "queryEvents",
    {
      query: {
        MoveEventType: `${vibeTraxPackageId}::vibetrax::MusicUploaded`,
      },
    },
    {
      select: (data) => data.data.flatMap((x) => x.parsedJson),
    },
  );

  useEffect(() => {
    if (!isPending) {
      setMusics(musicData);
    }
  }, [isPending]);

  return {
    musics,
    isPending,
    isError,
  };
};
