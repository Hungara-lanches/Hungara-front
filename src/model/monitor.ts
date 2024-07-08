import { IAdvertisement } from "./advertisement";
import { IEstablishment } from "./establishment";
import { IPlaylist } from "./playlist";

export interface IMonitor {
  id: number;
  name: string;
  description: string | null;
  isLogged: boolean;
  establishment: IEstablishment;
  establishmentId: number;
  createdAt: Date;
  updatedAt: Date;
  playlists: [
    {
      playlist: IPlaylist;
    }
  ];
}

export interface IMeMonitor {
  user: {
    id: number;
    name: string;
    playlists: [
      {
        playlist: {
          advertisements: IAdvertisement[];
        };
      }
    ];
    isLogged: boolean;
    role: string;
    createdAt: Date;
    updatedAt: Date;
  };
}
