"use client";

import { Button, Checkbox } from "@nextui-org/react";
import { IMonitor } from "../../../../../../../model/monitor";
import { IPlaylist } from "../../../../../../../model/playlist";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

interface FormGridProps {
  playlists: IPlaylist[];
  monitors: IMonitor[];
}

export function FormGrid({ monitors, playlists }: FormGridProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [playlistsId, setPlaylistsId] = useState<number[]>([]);
  const [monitorsId, setMonitorsId] = useState<number[]>([]);

  function handlePlaylistChange(playlistId: number) {
    if (playlistsId.includes(playlistId)) {
      setPlaylistsId(playlistsId.filter((id) => id !== playlistId));
    } else {
      setPlaylistsId([...playlistsId, playlistId]);
    }
  }

  function handleMonitorChange(monitorId: number) {
    if (monitorsId.includes(monitorId)) {
      setMonitorsId(monitorsId.filter((id) => id !== monitorId));
    } else {
      setMonitorsId([...monitorsId, monitorId]);
    }
  }

  async function boundPlaylistsToMonitors() {
    setIsSubmitting(true);
    try {
      const data = {
        playlistIds: playlistsId,
        monitorIds: monitorsId,
      };

      if (!data.playlistIds.length || !data.monitorIds.length) {
        toast.error("Selecione pelo menos uma playlist e um monitor");
        return;
      }

      const res = await fetch(`/api/admin/playlists/bound-playlist-monitor`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(data),
      });

      if (res.status === 400) {
        throw new Error(await res.text());
      }
      toast.success("Playlists vinculadas com sucesso");
      return res.json();
    } catch (error: any) {
      const errorMessage = JSON.parse(error.message) as string;
      if (errorMessage.includes("Playlist already assigned to monitor")) {
        toast.error("Playlist já vinculada ao monitor");
      } else {
        toast.error("Erro ao vincular playlists aos monitores");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <Toaster />
      <div className="mb-24">
        <h2 className="text-1xl font-bold">Playlists:</h2>
        <div className="mt-5 flex flex-wrap gap-3">
          {playlists.map((playlist) => (
            <Checkbox
              onChange={() => handlePlaylistChange(playlist.id)}
              key={playlist.id}
            >
              {playlist.name}
            </Checkbox>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-1xl font-bold">Monitores:</h2>
        <div className="mt-5 flex flex-wrap gap-3">
          {monitors.map((monitor) => (
            <Checkbox
              onChange={() => handleMonitorChange(monitor.id)}
              key={monitor.id}
            >
              {monitor.name} <b>{`(${monitor.establishment.name})`}</b>
            </Checkbox>
          ))}
        </div>
      </div>

      <Button
        onClick={boundPlaylistsToMonitors}
        disabled={isSubmitting}
        isLoading={isSubmitting}
        className="mt-20 max-w-64 w-full"
        size="lg"
        color="primary"
        type="button"
      >
        Vincular
      </Button>
    </>
  );
}
