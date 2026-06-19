"use server";

import { sql } from "@vercel/postgres";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createClient(formData: FormData) {
  const nombre = formData.get("nombre") as string;
  const telefono = formData.get("telefono") as string;
  const correo = formData.get("correo") as string;
  const direccion = formData.get("direccion") as string;

  await sql`
    INSERT INTO animation_store.clientes (nombre, telefono, correo, direccion)
    VALUES (${nombre}, ${telefono}, ${correo}, ${direccion})
  `;

  revalidatePath("/clientes");
  redirect("/clientes");
}

export async function createOrder(formData: FormData) {
  const cliente_id = formData.get("cliente_id") as string;
  const total = parseFloat(formData.get("total") as string || "0");
  const envio_direccion = formData.get("envio_direccion") as string;

  // Insertar orden base
  await sql`
    INSERT INTO animation_store.ordenes (cliente_id, estado, total, envio_direccion)
    VALUES (${cliente_id}, 'pendiente', ${total}, ${envio_direccion})
  `;

  revalidatePath("/ordenes");
  revalidatePath("/clientes");
  redirect("/ordenes");
}
