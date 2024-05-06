"use server";

import { revalidatePath } from "next/cache";

export default async function refreshPath(path: string) {
  revalidatePath(path);
}
