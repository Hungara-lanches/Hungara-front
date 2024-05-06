"use client";

import { Checkbox } from "@nextui-org/react";
import { IPlaylist } from "../../../../../../../model/playlist";

interface PlaylistGridProps {
  playlists: IPlaylist[];
}

export function PlaylistsGrid({ playlists }: PlaylistGridProps) {
  return (
    <div className="mt-5 flex flex-wrap gap-3">
      {playlists.map((playlist) => (
        <Checkbox key={playlist.id}>{playlist.name}</Checkbox>
      ))}
    </div>
  );
}
