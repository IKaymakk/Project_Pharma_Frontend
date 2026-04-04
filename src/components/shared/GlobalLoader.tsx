import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

let requestCount = 0;
let axiosDone = true;

function tryHide() {
    if (axiosDone) {
        window.dispatchEvent(new Event("loaderHide"));
    }
}

export function loaderStart() {
    requestCount++;
    axiosDone = false;
}

export function loaderDone() {
    requestCount = Math.max(0, requestCount - 1);
    if (requestCount === 0) {
        axiosDone = true;
        tryHide();
    }
}

const SLOW_THRESHOLD_MS = 500;
const MIN_VISIBLE_MS = 500;
const FADE_MS = 350;
const READY_DELAY_MS = 80;

export function dispatchPageReady() {
    window.dispatchEvent(new Event("pageReady"));
}

export function usePageReady() {
    const [ready, setReady] = useState(false);
    useEffect(() => {
        setReady(true);
        const handler = () => setReady(true);
        window.addEventListener("pageReady", handler);
        return () => window.removeEventListener("pageReady", handler);
    }, []);
    return ready;
}

function waitForImages(): Promise<void> {
    return new Promise((resolve) => {
        const imgs = Array.from(document.querySelectorAll("img"))
            .filter(img => img.loading !== "lazy"); // ← lazy resimleri atla
        const unloaded = imgs.filter(img => !img.complete);
        if (unloaded.length === 0) { resolve(); return; }
        let remaining = unloaded.length;
        const done = () => { if (--remaining === 0) resolve(); };
        unloaded.forEach(img => {
            img.addEventListener("load", done, { once: true });
            img.addEventListener("error", done, { once: true });
        });
    });
}

export default function GlobalLoader() {
    const location = useLocation();
    const [visible, setVisible] = useState(false);
    const [fading, setFading] = useState(false);

    const isVisible = useRef(false);
    const thresholdT = useRef<ReturnType<typeof setTimeout> | null>(null);
    const minT = useRef<ReturnType<typeof setTimeout> | null>(null);
    const fadeT = useRef<ReturnType<typeof setTimeout> | null>(null);
    const readyT = useRef<ReturnType<typeof setTimeout> | null>(null);
    const prevPath = useRef(location.pathname);

    const clearAll = () => {
        if (thresholdT.current) { clearTimeout(thresholdT.current); thresholdT.current = null; }
        if (minT.current) { clearTimeout(minT.current); minT.current = null; }
        if (fadeT.current) { clearTimeout(fadeT.current); fadeT.current = null; }
        if (readyT.current) { clearTimeout(readyT.current); readyT.current = null; }
    };

    const show = () => {
        if (isVisible.current) return;
        isVisible.current = true;
        setFading(false);
        setVisible(true);
    };

    const hide = () => {
        if (!isVisible.current) { clearAll(); return; }
        clearAll();
        minT.current = setTimeout(() => {
            setFading(true);
            fadeT.current = setTimeout(() => {
                setVisible(false);
                setFading(false);
                isVisible.current = false;
                readyT.current = setTimeout(() => dispatchPageReady(), READY_DELAY_MS);
            }, FADE_MS);
        }, MIN_VISIBLE_MS);
    };

    useEffect(() => {
        const onHide = () => hide();
        window.addEventListener("loaderHide", onHide);
        return () => {
            window.removeEventListener("loaderHide", onHide);
            clearAll();
        };
    }, []);

    useEffect(() => {
        if (location.pathname === prevPath.current) return;
        prevPath.current = location.pathname;

        axiosDone = true; // sıfırla, axios başlarsa loaderStart false yapar
        clearAll();

        thresholdT.current = setTimeout(() => {
            const imgs = Array.from(document.querySelectorAll("img"))
                .filter(img => img.loading !== "lazy"); // ← lazy resimleri atla
            const hasUnloaded = imgs.some(img => !img.complete);

            if (axiosDone && !hasUnloaded) return;

            show();

            if (hasUnloaded) {
                waitForImages().then(() => tryHide());
            }
        }, SLOW_THRESHOLD_MS);

        return () => {
            if (thresholdT.current) { clearTimeout(thresholdT.current); thresholdT.current = null; }
        };
    }, [location.pathname]);

    if (!visible) return null;

    return (
        <>
            <style>{`
                @keyframes gl-spin   { to { transform: rotate(360deg);  } }
                @keyframes gl-spin-r { to { transform: rotate(-360deg); } }
                @keyframes gl-pulse  { 0%,100%{opacity:1} 50%{opacity:.35} }
                @keyframes gl-bar {
                    0%  { transform:scaleX(0);   opacity:1; }
                    80% { transform:scaleX(0.9); opacity:1; }
                    100%{ transform:scaleX(1);   opacity:0; }
                }
                #gl-overlay {
                    position:fixed; inset:0; z-index:9999;
                    background:#06111e;
                    display:flex; flex-direction:column;
                    align-items:center; justify-content:center; gap:22px;
                    transition:opacity ${FADE_MS}ms cubic-bezier(.16,1,.3,1);
                    opacity:1;
                }
                #gl-overlay.gl-out { opacity:0; pointer-events:none; }
                #gl-bar {
                    position:absolute; top:0; left:0; right:0; height:2px;
                    background:linear-gradient(90deg,#3b82f6,#06b6d4);
                    transform-origin:left center;
                    animation:gl-bar ${MIN_VISIBLE_MS}ms cubic-bezier(.4,0,.2,1) forwards;
                }
                #gl-wordmark {
                    color:#f8fafc; font-weight:900; font-size:13px;
                    letter-spacing:.32em; text-transform:uppercase;
                    font-family:system-ui,sans-serif;
                }
                #gl-tagline {
                    color:#334155; font-size:10px; letter-spacing:.18em;
                    text-transform:uppercase; font-family:system-ui,sans-serif;
                    animation:gl-pulse 1.6s ease-in-out infinite;
                    margin-top:5px;
                }
                #gl-rings { position:relative; width:44px; height:44px; }
                #gl-ring-a {
                    position:absolute; inset:0; border-radius:50%;
                    border:1.5px solid rgba(59,130,246,.12);
                    border-top-color:#3b82f6;
                    animation:gl-spin .9s linear infinite;
                }
                #gl-ring-b {
                    position:absolute; inset:9px; border-radius:50%;
                    border:1px solid rgba(6,182,212,.10);
                    border-bottom-color:#06b6d4;
                    animation:gl-spin-r 1.4s linear infinite;
                }
                #gl-dot {
                    position:absolute; top:50%; left:50%;
                    transform:translate(-50%,-50%);
                    width:4px; height:4px; border-radius:50%;
                    background:#38bdf8;
                    box-shadow:0 0 8px rgba(56,189,248,.8);
                }
                #gl-noise {
                    position:absolute; inset:0; pointer-events:none; opacity:.028;
                    background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
                }
                .au-hold { animation:none !important; opacity:0 !important; transform:translateY(22px) !important; }
                .au-play.au-1 { animation: au-up 0.65s cubic-bezier(.16,1,.3,1) both 0.05s; }
                .au-play.au-2 { animation: au-up 0.65s cubic-bezier(.16,1,.3,1) both 0.18s; }
                .au-play.au-3 { animation: au-up 0.65s cubic-bezier(.16,1,.3,1) both 0.30s; }
                .au-play.au-4 { animation: au-up 0.65s cubic-bezier(.16,1,.3,1) both 0.43s; }
                .au-play.au-5 { animation: au-up 0.65s cubic-bezier(.16,1,.3,1) both 0.56s; }
                @keyframes au-up {
                    from { opacity:0; transform:translateY(22px); }
                    to   { opacity:1; transform:translateY(0); }
                }
            `}</style>
            <div id="gl-overlay" className={fading ? "gl-out" : ""} aria-hidden="true" role="status">
                <div id="gl-noise" />
                <div id="gl-bar" />
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <span id="gl-wordmark">Curipharma</span>
                    <span id="gl-tagline">Global Pharma Distribution</span>
                </div>
                <div id="gl-rings">
                    <div id="gl-ring-a" />
                    <div id="gl-ring-b" />
                    <div id="gl-dot" />
                </div>
            </div>
        </>
    );
}