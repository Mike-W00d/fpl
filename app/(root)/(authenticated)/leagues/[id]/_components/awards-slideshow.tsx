"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { X } from "lucide-react";
import type { AwardResult } from "@/lib/awards/types";
import AwardSlide from "./award-slide";
import ShareAward from "./share-award";

type AwardsSlideshowProps = {
  awards: AwardResult[];
  onClose: () => void;
  onSeen?: (awardId: string) => void;
  initialSlide?: number;
};

export default function AwardsSlideshow({
  awards,
  onClose,
  onSeen,
  initialSlide,
}: AwardsSlideshowProps) {
  const [currentSlide, setCurrentSlide] = useState(initialSlide ?? 0);
  const pointerStart = useRef<{ x: number; y: number } | null>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);

  const goTo = useCallback(
    (index: number) => {
      if (index < 0 || index >= awards.length) return;
      setCurrentSlide(index);
    },
    [awards.length],
  );

  const next = useCallback(
    () => goTo(Math.min(currentSlide + 1, awards.length - 1)),
    [currentSlide, awards.length, goTo],
  );
  const prev = useCallback(
    () => goTo(Math.max(currentSlide - 1, 0)),
    [currentSlide, goTo],
  );

  // Mark current slide as seen
  useEffect(() => {
    onSeen?.(awards[currentSlide].id);
  }, [currentSlide, awards, onSeen]);

  // Keyboard navigation
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        next();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        prev();
      } else if (e.key === "Escape") {
        onClose();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [next, prev, onClose]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // Touch/pointer swipe
  const handlePointerDown = (e: React.PointerEvent) => {
    pointerStart.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!pointerStart.current) return;
    const dx = e.clientX - pointerStart.current.x;
    const dy = e.clientY - pointerStart.current.y;
    pointerStart.current = null;

    // Only count horizontal swipes
    if (Math.abs(dx) < 40 || Math.abs(dx) < Math.abs(dy)) return;

    if (dx < 0) next();
    else prev();
  };

  // Tap navigation (left third = prev, right third = next)
  const handleTap = (e: React.MouseEvent) => {
    // Ignore if it was a swipe
    if (pointerStart.current) return;
    // Ignore clicks on buttons
    if ((e.target as HTMLElement).closest("button")) return;

    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const third = rect.width / 3;

    if (x < third) prev();
    else if (x > third * 2) next();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      {/* Progress bar */}
      <div className="absolute top-0 left-0 right-0 z-10 flex gap-1 p-2 px-3">
        {awards.map((_, i) => (
          <div
            key={i}
            className="flex-1 h-0.5 rounded-full overflow-hidden bg-white/20"
          >
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                i < currentSlide
                  ? "bg-white w-full"
                  : i === currentSlide
                    ? "bg-white w-full"
                    : "w-0"
              }`}
            />
          </div>
        ))}
      </div>

      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-3 z-10 p-2 text-white/70 hover:text-white"
      >
        <X size={24} />
      </button>

      {/* Slide counter */}
      <div className="absolute bottom-6 left-3 z-10 text-white/40 text-xs tabular-nums">
        {currentSlide + 1} / {awards.length}
      </div>

      {/* Slides container */}
      <div
        className="flex-1 overflow-hidden relative touch-pan-y"
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onClick={handleTap}
      >
        <div
          className="flex h-full transition-transform duration-300 ease-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {awards.map((award, i) => (
            <div key={award.id} className="w-full h-full flex-shrink-0">
              <AwardSlide
                award={award}
                ref={(el) => {
                  slideRefs.current[i] = el;
                }}
                shareButton={
                  i === currentSlide ? (
                    <ShareAward
                      getSlideElement={() => slideRefs.current[i]}
                      awardName={award.id}
                    />
                  ) : undefined
                }
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
