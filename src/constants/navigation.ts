import { CalendarIcon, HomeIcon, UsersIcon } from "@heroicons/react/24/outline";

export const SIDEBAR_NAVIGATION = [
  {
    name: "Estabelecimentos",
    href: "/admin/establishments",
    icon: HomeIcon,
    current: (path: string) => path === "/admin/establishments",
  },
  {
    name: "Monitores",
    href: "/admin/monitors",
    icon: UsersIcon,
    current: (path: string) => path === "/admin/monitors",
  },
  {
    name: "Playlists",
    href: "/admin/playlists",
    icon: UsersIcon,
    current: (path: string) => path === "/admin/playlists",
  },
  {
    name: "Propagandas",
    href: "/admin/advertisements",
    icon: UsersIcon,
    current: (path: string) => path === "/admin/advertisements",
  },
];
