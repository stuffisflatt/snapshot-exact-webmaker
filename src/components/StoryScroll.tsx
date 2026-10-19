import { useEffect, useRef, useState } from "react";

const STEPS = [
  { t: "Մանրակրկիտ զննում", d: "Սկսում ենք ձեր ատամների և խնդրի ուշադիր գնահատումից։" },
  { t: "Անհատական բուժման պլան", d: "Բժիշկը բացատրում է տարբերակները և քայլերը՝ պարզ լեզվով։" },
  { t: "Հաջորդ քայլերը՝ ձեր բժշկի հետ", d: "Միասին որոշում եք, թե երբ և ինչպես շարունակել։" },
];

export function StoryScroll() {
  const ref = useRef<HTMLElement>(null);
  const [p, setP] = useState(0);
  useEffect(() => {
    let raf = 0;
    const update = () => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const total = el.offsetHeight - window.innerHeight;
      setP(Math.min(1, Math.max(0, -r.top / total)));
    };
    const onScroll = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); };
  }, []);

  const step = Math.min(2, Math.floor(p * 3));
  const blue = Math.min(1, p / 0.3);
  const onBlue = blue > 0.5;

  return (
    <section ref={ref} id="how" aria-label="Ինչպես ենք աշխատում" className="relative h-[240svh]">
      <div className="sticky top-0 flex h-svh items-center overflow-hidden">
        <div className="absolute inset-0 bg-sky-gradient" style={{ opacity: blue }} aria-hidden />
        <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 400 800" preserveAspectRatio="xMidYMid slice" aria-hidden style={{ opacity: blue * 0.5 }}>
          <circle cx="330" cy="120" r="160" fill="none" stroke="currentColor" className="text-sky-foreground" strokeOpacity=".25" />
          <circle cx="330" cy="120" r="250" fill="none" stroke="currentColor" className="text-sky-foreground" strokeOpacity=".15" />
          <circle cx="330" cy="120" r="340" fill="none" stroke="currentColor" className="text-sky-foreground" strokeOpacity=".08" />
        </svg>
        <div className={`relative mx-auto grid w-full max-w-5xl gap-10 px-6 md:grid-cols-2 md:items-center ${onBlue ? "text-sky-foreground" : "text-foreground"} transition-colors duration-500`}>
          <div className="flex justify-center">
            <svg viewBox="0 0 200 200" className="size-48 md:size-72" aria-hidden>
              <circle cx="100" cy="100" r="86" fill="none" stroke="currentColor" strokeOpacity=".2" strokeWidth="2" />
              <circle cx="100" cy="100" r="86" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round"
                pathLength={1} strokeDasharray="1" strokeDashoffset={1 - p} transform="rotate(-90 100 100)" />
              {[0, 1, 2].map((i) => {
                const a = (-90 + i * 120) * (Math.PI / 180);
                return <circle key={i} cx={100 + 86 * Math.cos(a)} cy={100 + 86 * Math.sin(a)} r={i <= step ? 9 : 6}
                  fill="currentColor" fillOpacity={i <= step ? 1 : 0.3} className="transition-all duration-300" />;
              })}
              <text x="100" y="114" textAnchor="middle" fontSize="44" fontWeight="800" fill="currentColor" fontFamily="Montserrat">0{step + 1}</text>
            </svg>
          </div>
          <div>
            <div className="flex gap-3 text-sm font-semibold" aria-hidden>
              {[0, 1, 2].map((i) => (
                <span key={i} className={`transition-opacity duration-300 ${i === step ? "opacity-100" : "opacity-40"}`}>0{i + 1}</span>
              ))}
            </div>
            <div className="relative mt-4 min-h-44">
              {STEPS.map((s, i) => (
                <div key={i} aria-hidden={i !== step}
                  className={`absolute inset-0 transition-all duration-500 ${i === step ? "opacity-100 translate-y-0" : i < step ? "opacity-0 -translate-y-4" : "opacity-0 translate-y-4"}`}>
                  <h2 className="text-3xl font-bold leading-tight md:text-5xl">{s.t}</h2>
                  <p className="mt-4 text-lg opacity-85">{s.d}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
