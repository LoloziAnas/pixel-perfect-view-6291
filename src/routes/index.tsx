import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Truck, Banknote, Gem, RefreshCw, Feather, Leaf, Droplets, Star, Mail, Phone, MapPin, Menu, X, ArrowRight, ChevronDown } from "lucide-react";
import hero from "@/assets/hero.jpg";
import fabric from "@/assets/fabric.jpg";
import about from "@/assets/about.jpg";
import { products, wa } from "@/lib/products";
const [p1, p2, p3, , p5] = products.map((x) => x.img);
import logo from "@/assets/logo.png";

const TITLE = "NOAUMA — La douceur, chez vous | Linge de lit premium, Kenitra";
const DESC = "Couvre-lits et parures premium pour les maisons marocaines. Livraison partout au Maroc, paiement à la livraison.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

type Lang = "fr" | "ar";

type Dict = { nav: string[]; trust: string[]; fabHl: [string, string][]; reviews: [string, string, string][]; orderMsg: (n: string) => string } & Record<"heroEyebrow"|"heroTitle"|"heroTitleAlt"|"heroSub"|"discover"|"orderWa"|"collTag"|"collTitle"|"order"|"mad"|"fabTag"|"fabTitle"|"fabText"|"aboutTag"|"aboutTitle"|"aboutText"|"revTag"|"revTitle"|"instaTitle"|"follow"|"ctaTitle"|"ctaSub"|"footTag"|"city"|"rights"|"defaultMsg", string>;
const t: Record<Lang, Dict> = {
  fr: {
    nav: ["Collections", "À propos", "Avis", "Contact"],
    heroEyebrow: "L’art du linge de lit",
    heroTitle: "Élégance",
    heroTitleAlt: "Confort · Raffinement",
    heroSub: "Des couvre-lits premium, doux et élégants, pensés pour les maisons marocaines.",
    discover: "Découvrir la collection",
    orderWa: "Commander sur WhatsApp",
    trust: ["Livraison partout au Maroc", "Paiement à la livraison", "Qualité premium", "Échange facile"],
    collTag: "Collection", collTitle: "Nos pièces signature",
    order: "Commander", mad: "MAD",
    orderMsg: (n: string) => `Bonjour NOAUMA, je souhaite commander : ${n}`,
    fabTag: "Matières", fabTitle: "Une douceur qui se ressent",
    fabText: "Nous sélectionnons des tissus respirants et durables — coton, lin lavé, velours — pour un confort qui dure saison après saison. Lavage délicat à 30°, séchage à l'air libre.",
    fabHl: [["Toucher soyeux", "Fibres sélectionnées pour leur douceur."], ["Matières nobles", "Coton, lin et velours de qualité."], ["Entretien facile", "Lavable en machine, garde sa forme."]],
    aboutTag: "Notre histoire", aboutTitle: "Née à Kenitra, pour vos nuits",
    aboutText: "NOAUMA — نعومة — signifie « douceur ». Tout est parti d'une idée simple : offrir aux foyers marocains un linge de lit beau, doux et accessible. Depuis Kenitra, nous choisissons chaque pièce avec soin pour transformer votre chambre en refuge.",
    revTag: "Avis", revTitle: "Elles nous font confiance",
    reviews: [["Salma", "Casablanca", "Une qualité incroyable, le velours est d'une douceur folle. Livraison rapide !"], ["Imane", "Rabat", "Exactement comme sur les photos. Ma chambre a complètement changé."], ["Khadija", "Kenitra", "Service adorable sur WhatsApp et paiement à la livraison, parfait."]],
    instaTitle: "Suivez-nous sur Instagram", follow: "Nous suivre",
    ctaTitle: "Offrez-vous la douceur", ctaSub: "Commandez en un message, nous vous livrons partout au Maroc.",
    footTag: "Le linge de lit qui rend chaque nuit plus douce.",
    city: "Kenitra, Maroc", rights: "Tous droits réservés.",
    defaultMsg: "Bonjour NOAUMA, je souhaite passer une commande.",
  },
  ar: {
    nav: ["المجموعات", "من نحن", "الآراء", "اتصل بنا"],
    heroEyebrow: "فنّ مفروشات السرير",
    heroTitle: "أناقة",
    heroTitleAlt: "راحة · رُقيّ",
    heroSub: "أغطية أسرّة فاخرة، ناعمة وأنيقة، مصمّمة للبيوت المغربية.",
    discover: "اكتشفي المجموعة",
    orderWa: "اطلبي عبر واتساب",
    trust: ["التوصيل لجميع أنحاء المغرب", "الدفع عند الاستلام", "جودة فاخرة", "استبدال سهل"],
    collTag: "المجموعة", collTitle: "قطعنا المميزة",
    order: "اطلبي", mad: "درهم",
    orderMsg: (n: string) => `مرحبا نعومة، أريد طلب: ${n}`,
    fabTag: "الأقمشة", fabTitle: "نعومة تُحَسّ",
    fabText: "نختار أقمشة متنفسة ومتينة — قطن، كتان مغسول، مخمل — لراحة تدوم موسماً بعد موسم. غسيل لطيف على 30 درجة وتجفيف في الهواء.",
    fabHl: [["لمسة حريرية", "ألياف مختارة لنعومتها."], ["خامات راقية", "قطن وكتان ومخمل عالي الجودة."], ["عناية سهلة", "قابل للغسل ويحافظ على شكله."]],
    aboutTag: "قصتنا", aboutTitle: "من القنيطرة، لليالٍ أهدأ",
    aboutText: "نعومة — NOAUMA — اسم يحمل معناه. بدأت الفكرة ببساطة: أن نقدّم للبيوت المغربية مفروشات جميلة وناعمة وفي المتناول. من القنيطرة، نختار كل قطعة بعناية لتصبح غرفتك ملاذاً دافئاً.",
    revTag: "الآراء", revTitle: "زبوناتنا يثقن بنا",
    reviews: [["سلمى", "الدار البيضاء", "جودة رائعة، المخمل ناعم جداً. والتوصيل سريع!"], ["إيمان", "الرباط", "تماماً كما في الصور. غرفتي تغيّرت كلياً."], ["خديجة", "القنيطرة", "خدمة لطيفة عبر واتساب والدفع عند الاستلام، ممتاز."]],
    instaTitle: "تابعونا على إنستغرام", follow: "تابعينا",
    ctaTitle: "امنحي نفسك النعومة", ctaSub: "اطلبي برسالة واحدة، ونوصل لجميع أنحاء المغرب.",
    footTag: "مفروشات تجعل كل ليلة أنعم.",
    city: "القنيطرة، المغرب", rights: "جميع الحقوق محفوظة.",
    defaultMsg: "مرحبا نعومة، أريد تقديم طلب.",
  },
};

const ids = ["collections", "about", "reviews", "contact"];

function WaIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35zM12.05 21.5h-.01a9.4 9.4 0 0 1-4.8-1.32l-.34-.2-3.57.94.95-3.48-.22-.36a9.4 9.4 0 0 1-1.44-5.02c0-5.2 4.23-9.43 9.44-9.43 2.52 0 4.89.98 6.67 2.77a9.37 9.37 0 0 1 2.76 6.67c0 5.2-4.24 9.43-9.44 9.43zm8.03-17.46A11.3 11.3 0 0 0 12.05.7C5.79.7.7 5.79.7 12.05c0 2 .52 3.95 1.52 5.67L.6 23.5l5.9-1.55a11.3 11.3 0 0 0 5.55 1.41c6.26 0 11.35-5.09 11.35-11.35 0-3.03-1.18-5.88-3.32-8z" />
    </svg>
  );
}
function IgIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r=".8" fill="currentColor" />
    </svg>
  );
}
function FbIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M13.5 21v-7.5h2.5l.4-3h-2.9V8.6c0-.87.25-1.46 1.5-1.46h1.6V4.46A21 21 0 0 0 14.27 4.3c-2.3 0-3.87 1.4-3.87 3.98v2.22H7.8v3h2.6V21h3.1z" />
    </svg>
  );
}
function TkIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M16.6 5.82A4.28 4.28 0 0 1 15.54 3h-3.09v12.4a2.59 2.59 0 1 1-2.59-2.6c.27 0 .53.04.77.12V9.77a5.7 5.7 0 0 0-.77-.05A5.68 5.68 0 1 0 15.54 15.4V9.01a7.35 7.35 0 0 0 4.3 1.38V7.3a4.3 4.3 0 0 1-3.24-1.48z" />
    </svg>
  );
}

function Logo({ size = 72, className = "" }: { size?: number; className?: string }) {
  return (
    <a href="#top" className={`flex items-center gap-3 ${className}`} aria-label="NOAUMA — Accueil">
      <img
        src={logo}
        alt="Logo NOAUMA"
        width={size}
        height={size}
        className="rounded-full object-contain"
        style={{ width: size, height: size }}
      />
      <span className="sr-only">NOAUMA — نعومة</span>
    </a>
  );
}

function SectionHead({ tag, title }: { tag: string; title: string }) {
  return (
    <div className="reveal mb-12 flex flex-col items-center text-center">
      <span className="text-xs uppercase tracking-[0.3em] text-gold">{tag}</span>
      <h2 className="mt-3 text-4xl text-ink md:text-5xl">{title}</h2>
      <div className="gold-line mt-5" />
    </div>
  );
}

function Index() {
  const [lang, setLang] = useState<Lang>("fr");
  const [open, setOpen] = useState(false);
  const c = t[lang];

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && (e.target.classList.add("in"), io.unobserve(e.target))),
      { threshold: 0.12 },
    );
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const gallery = [p2, fabric, p3, about, p5, p1];

  return (
    <div id="top" className="min-h-screen bg-background">
      {/* Header */}
      <header className="relative z-40 h-[76px] border-b border-gold/15 bg-background/95 md:h-[98px]">
        <div className="mx-auto flex h-full max-w-[1440px] items-center justify-between gap-4 px-5 md:px-12">
          <nav className="hidden items-center gap-9 md:flex">
            {c.nav.map((n, i) => (
              <a key={n} href={`#${ids[i]}`} className="text-[0.68rem] uppercase tracking-[0.16em] text-ink/65 transition-colors hover:text-rose-deep">{n}</a>
            ))}
          </nav>
          <Logo size={154} className="absolute left-1/2 top-2 z-20 -translate-x-1/2 max-md:hidden" />
          <Logo size={72} className="md:hidden" />
          <div className="flex shrink-0 items-center gap-2">
            <button
              onClick={() => setLang(lang === "fr" ? "ar" : "fr")}
              className="rounded-full border border-gold/50 px-3 py-1.5 text-[0.62rem] tracking-widest text-ink transition-colors hover:bg-cream"
              aria-label="Changer de langue / تغيير اللغة"
            >
              {lang === "fr" ? "العربية" : "FR"}
            </button>
            <a href={wa(c.defaultMsg)} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="grid h-9 w-9 place-items-center rounded-full text-rose-deep hover:bg-cream">
              <WaIcon />
            </a>
            <button className="grid h-9 w-9 place-items-center md:hidden" onClick={() => setOpen(!open)} aria-label="Menu">
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
        {open && (
          <nav className="flex flex-col gap-1 border-t border-border/60 px-5 py-4 md:hidden">
            {c.nav.map((n, i) => (
              <a key={n} href={`#${ids[i]}`} onClick={() => setOpen(false)} className="py-2 font-serif text-xl text-ink">{n}</a>
            ))}
          </nav>
        )}
      </header>

      {/* Hero */}
      <section className="hero-reference relative min-h-[calc(100svh-76px)] w-full overflow-hidden md:min-h-[690px] md:h-[calc(100vh-98px)]">
        <img src={hero} alt="Lit élégant habillé d'un couvre-lit rose NOAUMA" width={1600} height={1008} className="absolute inset-0 h-full w-full object-cover object-[58%_center] md:object-center" />
        <div className="hero-reference-veil absolute inset-0" />
        <div className="relative z-10 mx-auto flex min-h-[calc(100svh-76px)] max-w-[1440px] flex-col justify-center px-6 pb-44 pt-20 md:h-full md:min-h-[690px] md:px-12 md:pb-36 md:pt-16 lg:px-24">
          <div className="max-w-[650px] text-primary-foreground md:text-ink">
            <div className="reveal flex items-center gap-5">
              <span className="text-[0.64rem] uppercase tracking-[0.36em] md:text-xs">{c.heroEyebrow}</span>
              <span className="h-px w-14 bg-current opacity-35" />
            </div>
            <h1 className="reveal mt-7 text-[3.4rem] leading-[0.92] md:text-[5.5rem] lg:text-[6.5rem]">
              <span className="block">{c.heroTitle}</span>
              <span className="mt-2 block text-[0.76em] font-normal">{c.heroTitleAlt}</span>
            </h1>
            <p className="reveal mt-7 max-w-md text-sm font-light leading-relaxed opacity-85 md:text-base">{c.heroSub}</p>
            <div className="reveal mt-9 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
              <a href="#collections" className="hero-cta">{c.discover}<ArrowRight className="h-4 w-4" /></a>
              <a href={wa(c.defaultMsg)} target="_blank" rel="noopener noreferrer" className="hero-wa"><WaIcon className="h-4 w-4" />{c.orderWa}</a>
            </div>
          </div>
        </div>

        <div className="hero-trust absolute inset-x-0 bottom-0 z-20">
          <div className="mx-auto grid max-w-[1440px] grid-cols-2 gap-x-4 gap-y-5 px-6 pb-7 pt-12 md:grid-cols-4 md:px-12 md:pb-9 lg:px-24">
          {[Truck, Banknote, Gem, RefreshCw].map((Icon, i) => (
            <div key={i} className="flex items-center gap-3 border-r border-gold/20 last:border-r-0 max-md:even:border-r-0">
              <Icon className="h-6 w-6 shrink-0 text-gold" strokeWidth={1.1} />
              <span className="text-[0.58rem] uppercase leading-relaxed tracking-[0.1em] text-ink/70 md:text-[0.65rem]">{c.trust[i]}</span>
            </div>
          ))}
          </div>
        </div>
        <a href="#collections" aria-label={c.discover} className="absolute bottom-3 left-1/2 z-30 hidden h-10 w-7 -translate-x-1/2 place-items-center rounded-full border border-gold/40 text-gold md:grid">
          <ChevronDown className="h-4 w-4" />
        </a>
      </section>

      {/* Collection */}
      <section id="collections" className="mx-auto max-w-7xl scroll-mt-20 px-5 py-20 md:py-28">
        <SectionHead tag={c.collTag} title={c.collTitle} />
        <div className="grid grid-cols-2 gap-4 md:gap-8 lg:grid-cols-3">
          {products.map((p) => {
            const [name, desc] = p[lang];
            return (
              <article key={p.fr[0]} className="reveal group flex flex-col overflow-hidden rounded-2xl bg-card shadow-soft">
                <div className="aspect-[4/5] overflow-hidden">
                  <img src={p.img} alt={name} loading="lazy" width={800} height={1008} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>
                <div className="flex flex-1 flex-col p-3 md:p-6">
                  <h3 className="text-xl text-ink md:text-2xl"><Link to="/produit/$slug" params={{ slug: p.slug }}>{name}</Link></h3>
                  <p className="mt-1 text-xs text-muted-foreground md:text-sm">{desc}</p>
                  <div className="mt-auto flex flex-col gap-3 pt-4 md:flex-row md:items-center md:justify-between">
                    <span className="font-serif text-lg text-rose-deep">{p.price} {c.mad}</span>
                    <Link to="/produit/$slug" params={{ slug: p.slug }} className="btn-primary !px-4 !py-2.5 !text-[0.7rem]">
                      {c.order}
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Fabric */}
      <section className="fabric">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-20 md:grid-cols-2 md:gap-16 md:py-28">
          <div className="reveal overflow-hidden rounded-3xl shadow-soft">
            <img src={fabric} alt="Gros plan sur un tissu matelassé rose" loading="lazy" width={1024} height={1024} className="aspect-square w-full object-cover" />
          </div>
          <div className="reveal">
            <span className="text-xs uppercase tracking-[0.3em] text-gold">{c.fabTag}</span>
            <h2 className="mt-3 text-4xl text-ink md:text-5xl">{c.fabTitle}</h2>
            <div className="gold-line mt-5 !w-16" />
            <p className="mt-6 leading-relaxed text-muted-foreground">{c.fabText}</p>
            <div className="mt-10 grid gap-6 sm:grid-cols-3">
              {[Feather, Leaf, Droplets].map((Icon, i) => (
                <div key={i}>
                  <Icon className="h-6 w-6 text-gold" strokeWidth={1.25} />
                  <h4 className="mt-3 text-lg text-ink">{c.fabHl[i]?.[0]}</h4>
                  <p className="mt-1 text-sm text-muted-foreground">{c.fabHl[i]?.[1]}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="mx-auto grid max-w-7xl scroll-mt-20 items-center gap-10 px-5 py-20 md:grid-cols-2 md:gap-16 md:py-28">
        <div className="reveal md:order-2 overflow-hidden rounded-3xl shadow-soft">
          <img src={about} alt="Chambre chaleureuse à la marocaine" loading="lazy" width={1024} height={1024} className="aspect-[4/5] w-full object-cover" />
        </div>
        <div className="reveal md:order-1">
          <span className="text-xs uppercase tracking-[0.3em] text-gold">{c.aboutTag}</span>
          <h2 className="mt-3 text-4xl text-ink md:text-5xl">{c.aboutTitle}</h2>
          <div className="gold-line mt-5" />
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">{c.aboutText}</p>
          <p className="mt-8 font-arabic text-3xl text-rose">نعومة</p>
        </div>
      </section>

      {/* Reviews */}
      <section id="reviews" className="scroll-mt-20 bg-cream/50 py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-5">
          <SectionHead tag={c.revTag} title={c.revTitle} />
          <div className="grid gap-6 md:grid-cols-3">
            {c.reviews.map(([name, city, text]) => (
              <figure key={name} className="reveal rounded-2xl border border-gold/25 bg-card p-8 shadow-soft">
                <div className="flex gap-1 text-gold">
                  {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
                </div>
                <blockquote className="mt-5 font-serif text-xl leading-snug text-ink">“{text}”</blockquote>
                <figcaption className="mt-6 text-sm text-muted-foreground"><span className="text-rose-deep">{name}</span> · {city}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* Instagram */}
      <section className="mx-auto max-w-7xl px-5 py-20 md:py-28">
        <SectionHead tag="@noauma" title={c.instaTitle} />
        <div className="grid grid-cols-3 gap-2 md:gap-4">
          {gallery.map((g, i) => (
            <a key={i} href="https://www.instagram.com/noauma.ma" target="_blank" rel="noopener noreferrer" className="reveal group relative block aspect-square overflow-hidden rounded-xl">
              <img src={g} alt="Instagram NOAUMA" loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
            </a>
          ))}
        </div>
        <div className="mt-10 flex justify-center">
          <a href="https://www.instagram.com/noauma.ma" target="_blank" rel="noopener noreferrer" className="btn-primary"><IgIcon className="h-4 w-4" />{c.follow}</a>
        </div>
      </section>

      {/* CTA */}
      <section className="fabric relative overflow-hidden">
        <div className="absolute inset-0 bg-rose/25" />
        <div className="reveal relative mx-auto flex max-w-3xl flex-col items-center px-6 py-24 text-center md:py-32">
          <div className="gold-line" />
          <h2 className="mt-6 text-5xl text-ink md:text-6xl">{c.ctaTitle}</h2>
          <p className="mt-5 text-muted-foreground">{c.ctaSub}</p>
          <a href={wa(c.defaultMsg)} target="_blank" rel="noopener noreferrer" className="btn-primary mt-10 !px-10 !py-5 !text-sm">
            <WaIcon />{c.orderWa}
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="scroll-mt-20 bg-ink text-cream">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 md:grid-cols-3">
          <div>
            <Logo size={96} />
            <p className="mt-4 max-w-xs text-sm text-cream/70">{c.footTag}</p>
          </div>
          <ul className="space-y-3 text-sm text-cream/80">
            <li><a href="tel:+212674427340" className="flex items-center gap-3 hover:text-gold"><Phone className="h-4 w-4 text-gold" /><span dir="ltr">+212 6 74 42 73 40</span></a></li>
            <li><a href={wa(c.defaultMsg)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-gold"><WaIcon className="h-4 w-4 text-gold" />WhatsApp</a></li>
            <li><a href="mailto:contact.noauma@gmail.com" className="flex items-center gap-3 hover:text-gold"><Mail className="h-4 w-4 text-gold" />contact.noauma@gmail.com</a></li>
            <li className="flex items-center gap-3"><MapPin className="h-4 w-4 text-gold" />{c.city}</li>
          </ul>
          <div className="flex gap-3 md:justify-end">
            {[[IgIcon, "Instagram", "https://www.instagram.com/noauma.ma"], [FbIcon, "Facebook", "https://www.facebook.com/noauma.ma"], [TkIcon, "TikTok", "https://www.tiktok.com/@noauma.ma"]].map(([Icon, label, href]) => {
              const I = Icon as typeof IgIcon;
              return (
                <a key={label as string} href={href as string} target="_blank" rel="noopener noreferrer" aria-label={label as string} className="grid h-10 w-10 place-items-center rounded-full border border-gold/40 text-gold transition-colors hover:bg-gold/10">
                  <I className="h-4 w-4" />
                </a>
              );
            })}
          </div>
        </div>
        <div className="border-t border-cream/10 py-6 text-center text-xs text-cream/50">© {new Date().getFullYear()} NOAUMA. {c.rights}</div>
      </footer>

      {/* Floating WhatsApp */}
      <a
        href={wa(c.defaultMsg)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp"
        className="fixed bottom-5 right-5 z-50 grid h-14 w-14 place-items-center rounded-full bg-rose-deep text-primary-foreground shadow-soft transition-transform hover:scale-105"
      >
        <WaIcon className="h-7 w-7" />
      </a>
    </div>
  );
}
