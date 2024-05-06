import { IMonitor } from "./monitor";

export interface IEstablishmentList {
  count: number;
  currentPage: number;
  hasNextPage: null;
  hasPrevPage: null;
  establishments: IEstablishment[];
}

export interface IEstablishment {
  id: number;
  name: string;
  address: string;
  createdAt: Date;
  updatedAt: Date;
  monitors: IMonitor[];
}
