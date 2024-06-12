import { Suspense } from "react";

import FormAdmin from "./_components/form-admin";
import FormMonitor from "./_components/form-monitor";
import { Metadata } from "next";
import { IMonitor } from "../../model/monitor";
import { IEstablishmentList } from "../../model/establishment";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export const metadata: Metadata = {
  title: "Login",
  description: "Tela de login",
};

async function listMonitorsEstablishmentLogin(
  establishmentId: string
): Promise<IMonitor[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/list-establishment-monitors-login?id=${establishmentId}`,
    {
      cache: "no-store",
    }
  );
  if (!res.ok) {
    throw new Error(res.statusText);
  }

  return res.json();
}

async function listEstablishments(): Promise<IEstablishmentList> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/list-establishments`,
    {
      cache: "no-store",
    }
  );
  if (!res.ok) {
    throw new Error(res.statusText);
  }

  return res.json();
}

async function qrCodeHasRelation(qrCode: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/code-relation/${qrCode}`,
    {
      next: {
        revalidate: 3000,
      },
    }
  );
  if (!res.ok) {
    throw new Error(res.statusText);
  }
  const responseBody = await res.json();

  return responseBody;
}

async function generateQrCode() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/generate-code`, {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(res.statusText);
  }

  return res.json();
}

export default async function Login({
  searchParams,
}: {
  searchParams?: {
    establishmentId?: string;
    accountType?: "admin" | "monitor";
  };
}) {
  const establishmentIdQuery = searchParams?.establishmentId || "";
  const accountType = searchParams?.accountType || "admin";

  const monitors = await listMonitorsEstablishmentLogin(establishmentIdQuery);

  const establishments = await listEstablishments();

  const qrCode = await generateQrCode();

  // if (accountType !== "admin" && qrCode) await qrCodeHasRelation(qrCode);

  return (
    <>
      <main className="bg-gray-50 flex min-h-screen flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          {accountType === "admin" ? (
            <FormAdmin />
          ) : (
            <Suspense fallback="Carregando...">
              <FormMonitor
                establishments={establishments}
                monitors={monitors}
                qrCode={qrCode}
              />
            </Suspense>
          )}
        </div>
      </main>
    </>
  );
}
