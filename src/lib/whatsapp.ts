import { getSite } from "./site-content";

export function buildWhatsappLink(itemName: string, tipo: "planta" | "artesanato"): string {
  const kind = tipo === "planta" ? "na planta" : "no artesanato";
  const msg = `Olá! Tenho interesse ${kind} ${itemName} da ONG Viver Feliz`;
  return `https://wa.me/${getSite().ong.whatsapp}?text=${encodeURIComponent(msg)}`;
}

export function buildContactLink(text: string): string {
  return `https://wa.me/${getSite().ong.whatsapp}?text=${encodeURIComponent(text)}`;
}
