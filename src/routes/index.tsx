import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { Phone, CalendarCheck, ChevronDown, Star, MapPin, Instagram, ShieldCheck, Users, Clock3, ArrowUpRight, Stethoscope } from "lucide-react";
import { CLINIC, DOCTORS, FIRST_AVAILABLE, SERVICES } from "@/lib/clinic";
import { BookingSheet, type BookingPreset } from "@/components/BookingSheet";
import { StoryScroll } from "@/components/StoryScroll";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ALPHASTOM — Ատամնաբուժություն Երևանում՝ 2002 թվականից" },
      { name: "description", content: "Բազմապրոֆիլ ստոմատոլոգիական կենտրոն Երևանում։ Օրթոդոնտիա, իմպլանտացիա, բուժում, հիգիենա։ Ամրագրեք այցը։" },
      { property: "og:title", content: "ALPHASTOM — Ատամնաբուժություն՝ անհատական մոտեցմամբ" },
      { property: "og:description", content: "Բազմապրոֆիլ ստոմատոլոգիական կենտրոն Երևանում՝ 2002 թվականից։" },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "hy_AM" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && (e.target.classList.add("is-in"), io.unobserve(e.target))), { rootMargin: "0px 0px -10% 0px" });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

const NAV = [
  { href: "#services", label: "Ծառայություններ" },
  { href: "#team", label: "Թիմ" },
  { href: "#faq", label: "Հարցեր" },
  { href: "#contact", label: "Կապ" },
];

const FAQ = [
  { q: "Ինչպե՞ս ամրագրել այցը", a: "Սեղմեք «Ամրագրել այցը», ընտրեք նախընտրելի ծառայությունը և ժամը, ապա ավարտեք Yandex-ում կամ զանգահարեք։ Կլինիկան կհաստատի այցը։" },
  { q: "Ինչ է լինում առաջին այցի ժամանակ", a: "Բժիշկը զննում է, քննարկում ձեր հարցերը և անհրաժեշտության դեպքում առաջարկում բուժման պլան։" },
  { q: "Որտե՞ղ է գտնվում կլինիկան", a: `${CLINIC.address}։ Ճանապարհը կարող եք տեսնել Yandex Maps-ում։` },
  { q: "Ի՞նչ ծառայություններ եք մատուցում", a: "Օրթոդոնտիա, իմպլանտացիա, թերապևտիկ և վիրաբուժական ստոմատոլոգիա, պրոթեզավորում, հիգիենա։ Ճշգրտեք ձեր դեպքը զանգով։" },
];

function Index() {
  useReveal();
  const [open, setOpen] = useState(false);
  const [preset, setPreset] = useState<BookingPreset>({});
  const [svc, setSvc] = useState<string | null>(null);
  const [faq, setFaq] = useState<number | null>(0);
  const book = useCallback((p: BookingPreset = {}) => { setPreset(p); setOpen(true); }, []);
  const close = useCallback(() => setOpen(false), []);

  return (
    <div className="pb-24 md:pb-0">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5">
          <a href="#top" className="font-display text-xl font-extrabold tracking-tight">ALPHA<span className="text-primary">STOM</span></a>
          <nav aria-label="Գլխավոր" className="hidden gap-7 text-sm font-medium md:flex">
            {NAV.map((n) => <a key={n.href} href={n.href} className="hover:text-primary">{n.label}</a>)}
          </nav>
          <button onClick={() => book()} className="btn btn-primary min-h-10 px-4 text-sm">Ամրագրել</button>
        </div>
      </header>

      <main id="top">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="mx-auto grid max-w-6xl gap-10 px-5 pb-14 pt-12 md:grid-cols-[1.2fr_1fr] md:items-center md:py-24">
            <div className="animate-rise">
              <p className="inline-flex items-center gap-2 rounded-full bg-primary-soft px-3 py-1.5 text-sm font-semibold text-primary-deep"><MapPin className="size-4" />Երևան, Կենտրոն</p>
              <h1 className="mt-5 text-[2.1rem] font-extrabold leading-[1.12] sm:text-5xl md:text-6xl">Ատամնաբուժություն՝ <span className="text-primary">անհատական</span> մոտեցմամբ</h1>
              <p className="mt-5 max-w-md text-lg text-muted-foreground">Բազմապրոֆիլ ստոմատոլոգիական կենտրոն Երևանում՝ 2002 թվականից։</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button onClick={() => book()} className="btn btn-primary"><CalendarCheck className="size-5" />Ամրագրել այցը</button>
                <a href={CLINIC.mobileHref} className="btn btn-outline"><Phone className="size-5" />Զանգահարել</a>
              </div>
            </div>
            <div className="animate-rise [animation-delay:150ms]" aria-hidden>
              <svg viewBox="0 0 320 320" className="mx-auto w-full max-w-xs md:max-w-sm">
                <defs><linearGradient id="hg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="var(--primary-deep)" /><stop offset="1" stopColor="var(--primary)" stopOpacity=".55" /></linearGradient></defs>
                <circle cx="160" cy="160" r="150" fill="var(--primary-soft)" />
                <path d="M160 70c-30-18-78-10-88 34-8 36 8 62 16 96 6 26 12 62 30 62 16 0 14-46 42-46s26 46 42 46c18 0 24-36 30-62 8-34 24-60 16-96-10-44-58-52-88-34z" fill="url(#hg)" />
                <path d="M40 250 Q160 190 280 250" fill="none" stroke="var(--primary)" strokeOpacity=".35" strokeWidth="2" />
              </svg>
            </div>
          </div>
        </section>

        {/* Trust */}
        <section aria-label="Փաստեր" className="mx-auto max-w-6xl px-5">
          <ul className="grid gap-3 sm:grid-cols-3">
            <li className="reveal flex items-center gap-3 rounded-3xl bg-muted p-5"><Clock3 className="size-6 text-primary" /><span className="font-semibold">Հիմնադրված՝ 2002 թ.</span></li>
            <li className="reveal flex items-center gap-3 rounded-3xl bg-muted p-5"><Users className="size-6 text-primary" /><span className="font-semibold">Բազմապրոֆիլ թիմ</span></li>
            <li className="reveal">
              <a href={CLINIC.yandex} target="_blank" rel="noopener noreferrer" className="flex h-full items-center gap-3 rounded-3xl bg-muted p-5 transition-colors hover:bg-accent">
                <Star className="size-6 fill-primary text-primary" /><span className="font-semibold">{CLINIC.rating}՝ Yandex-ում · {CLINIC.ratingCount} գնահատական</span><ArrowUpRight className="ml-auto size-4" />
              </a>
            </li>
          </ul>
        </section>

        <div className="h-16" />
        <StoryScroll />

        {/* Services */}
        <section id="services" className="mx-auto max-w-3xl scroll-mt-20 px-5 py-20">
          <h2 className="reveal text-3xl font-bold md:text-4xl">Ծառայություններ</h2>
          <p className="reveal mt-3 text-muted-foreground">Ընտրեք ուղղությունը՝ մանրամասների համար։</p>
          <ul className="mt-8 space-y-3">
            {SERVICES.map((s) => {
              const isOpen = svc === s.id;
              return (
                <li key={s.id} className={`reveal overflow-hidden rounded-3xl border transition-colors ${isOpen ? "border-primary bg-primary-soft" : "border-border bg-card hover:border-input"}`}>
                  <h3>
                    <button aria-expanded={isOpen} aria-controls={`svc-${s.id}`} onClick={() => setSvc(isOpen ? null : s.id)}
                      className="flex w-full items-center justify-between gap-4 rounded-3xl px-5 py-5 text-left text-lg font-semibold">
                      {s.title}
                      <ChevronDown className={`size-5 shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180 text-primary" : ""}`} />
                    </button>
                  </h3>
                  <div id={`svc-${s.id}`} className={`grid transition-[grid-template-rows] duration-300 ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                    <div className="overflow-hidden">
                      <div className="px-5 pb-5">
                        <p className="text-muted-foreground">{s.text}</p>
                        <button tabIndex={isOpen ? 0 : -1} onClick={() => book({ service: s.title })} className="btn btn-primary mt-4 text-sm">Ամրագրել այս ծառայության համար</button>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>

        {/* Team */}
        <section id="team" className="scroll-mt-20 bg-muted">
          <div className="mx-auto max-w-6xl px-5 py-20">
            <h2 className="reveal text-3xl font-bold md:text-4xl">Մեր մասնագետները</h2>
            {DOCTORS.length === 0 ? (
              <div className="reveal mt-8 grid gap-6 rounded-3xl bg-card p-6 shadow-card md:grid-cols-[1fr_auto] md:items-center md:p-10">
                <div>
                  <Stethoscope className="size-8 text-primary" />
                  <p className="mt-4 text-lg">Կլինիկայում աշխատում է բազմապրոֆիլ թիմ՝ տարբեր ուղղությունների բժիշկներով։ Եթե չգիտեք՝ ում մոտ գրանցվել, ընտրեք առաջին հասանելի մասնագետին։</p>
                </div>
                <button onClick={() => book({ doctor: FIRST_AVAILABLE })} className="btn btn-primary">{FIRST_AVAILABLE}</button>
              </div>
            ) : (
              <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {DOCTORS.map((d) => (
                  <li key={d.name} className="reveal overflow-hidden rounded-3xl bg-card shadow-card">
                    <img src={d.photo} alt={d.name} className="aspect-[4/5] w-full object-cover" loading="lazy" />
                    <div className="p-5"><h3 className="text-lg font-bold">{d.name}</h3><p className="text-muted-foreground">{d.specialty}</p>
                      <button onClick={() => book({ doctor: d.name })} className="btn btn-primary mt-4 w-full text-sm">Ամրագրել այս բժշկի մոտ</button></div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        {/* Feedback */}
        <section className="mx-auto max-w-6xl px-5 py-20">
          <div className="reveal flex flex-col gap-6 rounded-3xl border border-border p-8 md:flex-row md:items-center md:justify-between md:p-12">
            <div>
              <h2 className="text-3xl font-bold">Պացիենտների կարծիքները</h2>
              <p className="mt-3 text-muted-foreground">Կարդացեք իրական կարծիքները Yandex-ում։</p>
            </div>
            <a href={CLINIC.yandex} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 rounded-3xl bg-primary-soft px-6 py-5 transition-colors hover:bg-accent">
              <span className="font-display text-5xl font-extrabold text-primary-deep">4.8</span>
              <span><span className="flex gap-0.5" aria-label="5-ից 4.8 աստղ">{[0,1,2,3,4].map((i) => <Star key={i} className="size-4 fill-primary text-primary" />)}</span>
                <span className="text-sm font-medium">{CLINIC.ratingCount} գնահատական · Yandex</span></span>
              <ArrowUpRight className="size-5" />
            </a>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="mx-auto max-w-3xl scroll-mt-20 px-5 pb-20">
          <h2 className="reveal text-3xl font-bold md:text-4xl">Հաճախ տրվող հարցեր</h2>
          <ul className="mt-8 divide-y divide-border border-y border-border">
            {FAQ.map((f, i) => (
              <li key={i}>
                <button aria-expanded={faq === i} onClick={() => setFaq(faq === i ? null : i)} className="flex w-full items-center justify-between gap-4 py-5 text-left font-semibold">
                  {f.q}<ChevronDown className={`size-5 shrink-0 transition-transform ${faq === i ? "rotate-180" : ""}`} />
                </button>
                <div className={`grid transition-[grid-template-rows] duration-300 ${faq === i ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                  <p className="overflow-hidden text-muted-foreground"><span className="block pb-5">{f.a}</span></p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Contact */}
        <section id="contact" className="relative scroll-mt-16 overflow-hidden bg-sky-gradient text-sky-foreground">
          <svg className="pointer-events-none absolute -right-24 -top-24 size-[480px] opacity-30" viewBox="0 0 200 200" aria-hidden>
            <circle cx="100" cy="100" r="60" fill="none" stroke="currentColor" /><circle cx="100" cy="100" r="80" fill="none" stroke="currentColor" strokeOpacity=".6" /><circle cx="100" cy="100" r="98" fill="none" stroke="currentColor" strokeOpacity=".3" />
          </svg>
          <div className="relative mx-auto max-w-6xl px-5 py-20">
            <h2 className="reveal max-w-xl text-3xl font-extrabold leading-tight md:text-5xl">Պատրա՞ստ եք առաջին քայլին</h2>
            <p className="reveal mt-4 max-w-md text-lg opacity-90">Ընտրեք հարմար ժամը․ կլինիկան կկապվի ձեզ հետ՝ այցը հաստատելու համար։</p>
            <div className="reveal mt-8 flex flex-col gap-3 sm:flex-row">
              <button onClick={() => book()} className="btn btn-white"><CalendarCheck className="size-5" />Ամրագրել այցը</button>
              <a href={CLINIC.mobileHref} className="btn btn-ghost-white"><Phone className="size-5" />{CLINIC.mobile}</a>
            </div>
            <div className="mt-14 grid gap-4 sm:grid-cols-3">
              <a href={CLINIC.yandex} target="_blank" rel="noopener noreferrer" className="rounded-3xl bg-sky-foreground/10 p-5 transition-colors hover:bg-sky-foreground/20">
                <MapPin className="size-6" /><p className="mt-3 font-semibold">{CLINIC.address}</p><p className="mt-1 text-sm opacity-80">Ճանապարհ Yandex Maps-ում ↗</p>
              </a>
              <div className="rounded-3xl bg-sky-foreground/10 p-5">
                <Phone className="size-6" />
                <a href={CLINIC.mobileHref} className="mt-3 block font-semibold hover:underline">{CLINIC.mobile}</a>
                <a href={CLINIC.landlineHref} className="mt-1 block font-semibold hover:underline">{CLINIC.landline}</a>
              </div>
              <a href={CLINIC.instagram} target="_blank" rel="noopener noreferrer" className="rounded-3xl bg-sky-foreground/10 p-5 transition-colors hover:bg-sky-foreground/20">
                <Instagram className="size-6" /><p className="mt-3 font-semibold">@alphastom_mc</p><p className="mt-1 text-sm opacity-80">Instagram ↗</p>
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-8 text-sm text-muted-foreground">
        <span>© ALPHASTOM Dental Clinic · 2002</span>
        <span className="flex items-center gap-2"><ShieldCheck className="size-4" /><span className="rounded-full border border-border px-2.5 py-0.5 text-xs font-medium">Concept preview</span></span>
      </footer>

      {/* Mobile bar */}
      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 p-3 backdrop-blur md:hidden">
        <div className="grid grid-cols-[auto_1fr] gap-2">
          <a href={CLINIC.mobileHref} aria-label="Զանգահարել" className="btn btn-outline px-4"><Phone className="size-5" /></a>
          <button onClick={() => book()} className="btn btn-primary">Ամրագրել այցը</button>
        </div>
      </div>

      <BookingSheet open={open} preset={preset} onClose={close} />
    </div>
  );
}
