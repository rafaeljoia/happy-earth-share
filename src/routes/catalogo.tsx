import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Catalog } from "@/components/Catalog";

export const Route = createFileRoute("/catalogo")({
  head: () => ({
    meta: [
      { title: "Catálogo — ONG Viver Feliz" },
      {
        name: "description",
        content:
          "Plantas e artesanatos feitos à mão pelas famílias da ONG Viver Feliz. Escolha um item e apoie diretamente quem precisa.",
      },
      { property: "og:title", content: "Catálogo — ONG Viver Feliz" },
      {
        property: "og:description",
        content: "Plantas e artesanatos com propósito. Cada compra apoia as famílias atendidas pela ONG.",
      },
    ],
  }),
  component: CatalogPage,
});

function CatalogPage() {
  return (
    <>
      <Header />
      <main>
        <Catalog variant="full" />
      </main>
      <Footer />
    </>
  );
}
