import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Catalog } from "@/components/Catalog";
import { HowToHelp } from "@/components/HowToHelp";
import { Comments } from "@/components/Comments";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ONG Viver Feliz — Plantas, artesanato e acolhimento" },
      { name: "description", content: "Descubra plantas e artesanatos feitos com amor pela ONG Viver Feliz. Sua compra sustenta oficinas, refeições e apoio às famílias." },
      { property: "og:title", content: "ONG Viver Feliz — Semeando alegria" },
      { property: "og:description", content: "Cada planta e cada artesanato aqui carrega uma história de acolhimento." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <About />
        <Catalog />
        <HowToHelp />
        <Comments />
      </main>
      <Footer />
    </>
  );
}
