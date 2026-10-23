import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, CalendarCheck, Instagram, MoreHorizontal, Phone, Plus } from "lucide-react";
import { CLINIC } from "@/lib/clinic";
import { HeroDots } from "./HeroDots";

const links = [
  { href: "#services", label: "Ծառայություններ" },
  { href: "#team", label: "Մեր թիմը" },
  { href: "#contact", label: "Կապ" },
];

export function HeroHeader({ onBook }: { onBook: () => void }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const video = useRef<HTMLVideoElement>(null);
  const hero = useRef<HTMLElement>(null);

  useEffect(() => {
    let inView = true;
    const resume = () => {
      if (!document.hidden && inView && video.current) {
        video.current.muted = true;
        void video.current.play().catch(() => {});
      }
    };
    resume();
    const observer = new IntersectionObserver(entries => {
      inView = entries[0]?.isIntersecting ?? false;
      if (inView) resume(); else video.current?.pause();
    }, { rootMargin: "100px" });
    if (video.current) observer.observe(video.current);
    document.addEventListener("visibilitychange", resume);
    return () => { observer.disconnect(); document.removeEventListener("visibilitychange", resume); };
  }, []);

  return (
    <>
      <header className="clinic-topbar" onKeyDown={event => { if (event.key === "Escape") setMenuOpen(false); }}>
        <nav id="clinic-main-nav" className="clinic-nav" data-open={menuOpen} aria-label="Գլխավոր նավարկում">
          {links.map(link => <a key={link.href} href={link.href} onClick={() => setMenuOpen(false)}>{link.label}</a>)}
        </nav>
        <div className="clinic-header-actions">
          <a className="clinic-header-icon clinic-header-instagram" href={CLINIC.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram"><Instagram size={22} strokeWidth={1.7} /></a>
          <button className="clinic-book" onClick={onBook}><span>Ամրագրել այցը</span><Plus size={23} strokeWidth={1.5} /></button>
          <button className="clinic-header-icon clinic-nav-toggle" aria-label={menuOpen ? "Փակել ընտրացանկը" : "Բացել ընտրացանկը"} aria-expanded={menuOpen} aria-controls="clinic-main-nav" onClick={() => setMenuOpen(!menuOpen)}><MoreHorizontal size={21} /></button>
        </div>
      </header>

    <section ref={hero} className="clinic-hero" aria-labelledby="clinic-hero-title">
      <HeroDots containerRef={hero} />
      <div className="clinic-hero-film" aria-hidden="true">
        <video ref={video} autoPlay muted loop playsInline preload="auto" poster="/media/dental-hero-poster.webp" disablePictureInPicture>
          <source src="/media/dental-hero-mobile.mp4" type="video/mp4" media="(max-width: 600px)" />
          <source src="/media/dental-hero-desktop.mp4" type="video/mp4" />
        </video>
      </div>



      <h1 id="clinic-hero-title" className="clinic-headline"><span>Alphastom</span><span>Dental <i>Clinic</i></span></h1>
      <div className="clinic-headline clinic-headline-light" aria-hidden="true"><span>Alphastom</span><span>Dental <i>Clinic</i></span></div>

      <a className="clinic-location" href={CLINIC.yandex} target="_blank" rel="noopener noreferrer"><span>Մեր հասցեն</span><strong>Երևան, Կենտրոն<br />Պռոշյան 28/2</strong><small>Ձեր կողքին՝ 2002 թվականից <ArrowUpRight size={14} /></small></a>
      <div className="clinic-hero-ctas">
        <button className="clinic-hero-cta clinic-hero-cta-book" onClick={onBook}><CalendarCheck size={21} /><span>Ամրագրել այցը</span><ArrowUpRight size={21} /></button>
        <a className="clinic-hero-cta clinic-hero-cta-call" href={CLINIC.mobileHref}><Phone size={21} /><span>Զանգահարել</span><ArrowUpRight size={21} /></a>
      </div>
      <p className="clinic-hero-note">Բազմապրոֆիլ<br />ստոմատոլոգիական կենտրոն<br />Երևանում՝ 2002 թվականից։</p>
    </section>
    </>
  );
}
