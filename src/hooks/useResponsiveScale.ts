import { useEffect } from "react";

export function useResponsiveScale(): void {
  useEffect(() => {
    const update = () => document.documentElement.style.setProperty("--app-height", `${window.innerHeight}px`);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
}
