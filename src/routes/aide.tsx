import { createFileRoute } from "@tanstack/react-router";
import { ChevronDown } from "lucide-react";
import { ShopHeader } from "@/components/shop";
import { useLang } from "@/lib/lang";
import { policies } from "@/lib/policies";
import { wa } from "@/lib/products";

const TITLE = "Aide & conditions — NOAUMA";
const DESC =
  "Livraison gratuite partout au Maroc, paiement à la livraison, échange ou retour sous 7 jours. Toutes les réponses à vos questions.";

export const Route = createFileRoute("/aide")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
    ],
  }),
  component: HelpPage,
});

function HelpPage() {
  const [lang] = useLang();
  const c = policies[lang];

  return (
    <div className="min-h-screen bg-background">
      <ShopHeader />

      <main className="mx-auto max-w-3xl px-5 py-12 md:py-20">
        <div className="flex flex-col items-center text-center">
          <h1 className="text-4xl text-ink md:text-5xl">{c.title}</h1>
          <div className="gold-line mt-5" />
          <p className="mt-5 max-w-xl text-muted-foreground">{c.intro}</p>
        </div>

        <nav className="mt-10 flex flex-wrap justify-center gap-2">
          {[...c.sections.map((x) => [x.id, x.title]), ["faq", c.faqTitle]].map(([id, title]) => (
            <a
              key={id}
              href={`#${id}`}
              className="rounded-full border border-gold/40 px-4 py-1.5 text-xs text-ink/80 transition-colors hover:bg-cream"
            >
              {title}
            </a>
          ))}
        </nav>

        <div className="mt-12 space-y-6">
          {c.sections.map((x) => (
            <section
              key={x.id}
              id={x.id}
              className="scroll-mt-6 rounded-2xl border border-gold/25 bg-card p-6 shadow-soft md:p-8"
            >
              <h2 className="text-2xl text-ink md:text-3xl">{x.title}</h2>
              <ul className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground md:text-base">
                {x.items.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <section id="faq" className="mt-16 scroll-mt-6">
          <h2 className="text-center text-3xl text-ink md:text-4xl">{c.faqTitle}</h2>
          <div className="mt-8 divide-y divide-border border-y border-border">
            {c.faq.map((f) => (
              <details key={f.q} className="group py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-serif text-lg text-ink md:text-xl">
                  {f.q}
                  <ChevronDown className="h-4 w-4 shrink-0 text-gold transition-transform group-open:rotate-180" />
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
                  {f.a}
                </p>
              </details>
            ))}
          </div>
        </section>

        <section className="mt-16 rounded-2xl bg-cream p-8 text-center">
          <h2 className="text-2xl text-ink">{c.contactTitle}</h2>
          <p className="mt-2 text-sm text-muted-foreground">{c.contactText}</p>
          <a
            href={wa(
              lang === "ar" ? "مرحبا نعومة، عندي سؤال." : "Bonjour NOAUMA, j'ai une question.",
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary mt-6"
          >
            {c.contactCta}
          </a>
        </section>
      </main>
    </div>
  );
}
