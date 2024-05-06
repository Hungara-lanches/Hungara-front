"use client";

import { createContext, useState, ReactNode, useContext } from "react";

interface Children {
  children: ReactNode;
}

interface SidebarContextProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export const SidebarContext = createContext({} as SidebarContextProps);

export const SidebarProvider = ({ children }: Children) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <SidebarContext.Provider value={{ sidebarOpen, setSidebarOpen }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => {
  const context = useContext(SidebarContext);

  return context;
};
