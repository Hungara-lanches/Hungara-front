import { SidebarProvider } from "../../context/sidebarContext";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <main>{children}</main>
    </SidebarProvider>
  );
}
