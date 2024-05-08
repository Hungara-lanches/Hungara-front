import { Metadata } from "next";
import CreateEstablishmentForm from "../_components/create-establishment";

export const metadata: Metadata = {
  title: "Criar estabelecimento",
  description: "Página para criar um novo estabelecimento",
};

export default function CreateEstablishment() {
  return (
    <>
      <header className="flex items-center gap-5 mb-10 flex-wrap">
        <h1 className="text-2xl font-bold">Criar Estabelecimento</h1>
      </header>

      <CreateEstablishmentForm />
    </>
  );
}
