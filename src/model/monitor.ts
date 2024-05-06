import { IAdvertisement } from "./advertisement";
import { IEstablishment } from "./establishment";

export interface IMonitor {
  id: number;
  name: string;
  description: string | null;
  establishment: IEstablishment;
  establishmentId: number;
  createdAt: Date;
  updatedAt: Date;
  playlists: any;
}

export interface IMeMonitor {
  user: {
    id: number;
    name: string;
    advertisements: IAdvertisement[];
    role: string;
    createdAt: Date;
    updatedAt: Date;
  };
}
