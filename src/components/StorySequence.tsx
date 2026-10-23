import { useEffect, useRef, useState } from "react";
import { storyScrollDelta } from "@/lib/story-scroll";

const STEPS = [
  { t: "Մանրակրկիտ զննում", d: "Սկսում ենք ձեր ատամների և խնդրի ուշադիր գնահատումից։" },
  { t: "Անհատական բուժման պլան", d: "Բժիշկը բացատրում է տարբերակները և քայլերը՝ պարզ լեզվով։" },
  { t: "Հաջորդ քայլերը՝ ձեր բժշկի հետ", d: "Միասին որոշում եք, թե երբ և ինչպես շարունակել։" },
];

// Supply the optimized clinic video here when the source footage is available.
export function StoryScroll({ videoSrc, posterSrc }: { videoSrc?: string; posterSrc?: string }) {
  const ref = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [step, setStep] = useState(0);
  const [phone, setPhone] = useState(false);
  useEffect(() => {
    const media = window.matchMedia("(max-width: 767px)");
    const sync = () => setPhone(media.matches);
    sync(); media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);
  useEffect(() => {
    setStep(0);
    const section = ref.current;
    if (!section) return;
    const video = videoRef.current;
    const rows = [...section.querySelectorAll<HTMLElement>(".story-copy-step")];
    const copy = section.querySelector<HTMLElement>(".story-copy");
    const measureTextRows = () => {
      const heights = rows.map(row => parseFloat(getComputedStyle(row).height));
      section.style.setProperty("--story-first-row-height", `${heights[0]}px`);
      section.style.setProperty("--story-second-row-height", `${heights[1]}px`);
      section.style.setProperty("--story-total-text-height", `${heights.reduce((sum, height) => sum + height, 0)}px`);
      if (copy) section.style.setProperty("--story-card-height", `${parseFloat(getComputedStyle(copy).height)}px`);
    };
    const textObserver = new ResizeObserver(measureTextRows);
    rows.forEach(row => {
      textObserver.observe(row);
      row.querySelectorAll("h2, p").forEach(element => textObserver.observe(element));
    });
    measureTextRows();
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let raf = 0, target = 0, displayed = 0, lastTime = 0, currentStep = 0;
    let visible = false, disposed = false;
    const storyRect = () => section.getBoundingClientRect();
    const scrollMetrics = () => ({ range: Math.max(1, section.offsetHeight - window.innerHeight) });
    // Keep only the latest seek target. A slow decoder can never queue old seeks
    // or block the card, scrolling, or leaving this section.
    const syncVideo = () => {
      if (!video || video.seeking || !visible || !Number.isFinite(video.duration) || video.duration <= 0) return;
      const time = reduced.matches ? 0 : displayed * Math.max(0, video.duration - 1 / 30);
      if (Math.abs(video.currentTime - time) >= 1 / 30) video.currentTime = time;
    };
    const schedule = () => { if (!raf && visible && !disposed) raf = requestAnimationFrame(render); };
    function render(time: number) {
      raf = 0;
      if (disposed || !visible) return;
      const dt = lastTime ? Math.min(50, time - lastTime) : 16;
      lastTime = time;
      displayed = reduced.matches ? target : displayed + (target - displayed) * (1 - Math.exp(-dt / 80));
      if (Math.abs(target - displayed) < .0001) displayed = target;
      section!.style.setProperty("--story-position", String(displayed * 2));
      const nextStep = displayed < .3 ? 0 : displayed < .7 ? 1 : 2;
      if (nextStep !== currentStep) { currentStep = nextStep; setStep(nextStep); }
      syncVideo();
      if (displayed !== target) schedule();
    }
    const update = () => {
      const rect = storyRect();
      section.style.setProperty("--story-entry-radius", `${Math.min(40, Math.max(0, rect.top) * .22)}px`);
      target = Math.min(1, Math.max(0, -rect.top / scrollMetrics().range));
      schedule();
    };
    // The browser owns scrolling. Only oversized wheel input is bounded;
    // visual easing never moves the page or waits for a decoded frame.
    const onScroll = () => update();
    const onWheel = (event: WheelEvent) => {
      if (!event.cancelable || event.ctrlKey || event.metaKey || !event.deltaY || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
      if (event.target instanceof Element && event.target.closest('input, textarea, select, [contenteditable=true], [role=dialog]')) return;
      const y = window.scrollY;
      const start = y + storyRect().top;
      const pixels = event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? window.innerHeight : 1);
      const allowed = storyScrollDelta(y, pixels, start, start + scrollMetrics().range, window.innerHeight);
      if (allowed !== pixels) {
        event.preventDefault();
        window.scrollBy({ top: allowed, behavior: "instant" });
      }
    };
    const onResize = () => { measureTextRows(); update(); };
    const observer = new IntersectionObserver(entries => {
      visible = entries[0]?.isIntersecting ?? false;
      if (visible) { lastTime = 0; update(); }
      else { cancelAnimationFrame(raf); raf = 0; }
    }, { rootMargin: "300px" });
    observer.observe(section);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("resize", onResize);
    reduced.addEventListener("change", update);
    video?.addEventListener("loadedmetadata", syncVideo);
    video?.addEventListener("seeked", syncVideo);
    update();
    return () => {
      disposed = true; observer.disconnect(); cancelAnimationFrame(raf);
      textObserver.disconnect();
      window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onResize);
      window.removeEventListener("wheel", onWheel);
      reduced.removeEventListener("change", update);
      video?.removeEventListener("loadedmetadata", syncVideo);
      video?.removeEventListener("seeked", syncVideo);
    };
  }, [phone, videoSrc]);

  return (
    <section ref={ref} id="how" aria-label="Ինչպես ենք աշխատում" className="story-section story-clinic-section relative">
      <div className="story-sticky">
        {videoSrc && <video ref={videoRef} className="story-clinic-video" src={videoSrc} poster={posterSrc} muted playsInline preload="metadata" aria-hidden="true" disablePictureInPicture />}
        <div className="story-layout">
          <div className="story-visual">
            <span className="story-step-number" aria-hidden><span>0{step + 1}</span><small>/ 03</small></span>

          </div>
          <div className="story-copy">
            <p className="story-copy-label">Բուժման փուլերը</p>
            <div className="story-text-window"><div className="story-text-track">
            {STEPS.map((s, i) => (
              <div key={i} aria-hidden={i !== step} className={`story-copy-step ${i === step ? "is-active" : ""}`}>
                <h2>{s.t}</h2>
                <p>{String(i + 1).padStart(2, "0")}. {s.d}</p>
              </div>
            ))}
            </div></div>
          </div>
          <div className="story-scroll-hint">
            <span>թերթիր</span>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 4v16m-6-6 6 6 6-6" /></svg>
          </div>
        </div>
      </div>
    </section>
  );
}
