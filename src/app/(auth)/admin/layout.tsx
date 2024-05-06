import Sidebar from "../_components/Sidebar";
import { Header } from "../_components/Header";
import { SidebarProvider } from "../../context/sidebarContext";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <Sidebar />
      <div className="lg:pl-72">
        <Header />
        <main className="py-10">
          <div className="px-4 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>
    </SidebarProvider>
  );
}
