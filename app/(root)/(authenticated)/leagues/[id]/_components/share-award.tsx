"use client";

import { useCallback, useState } from "react";
import { Share2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

type ShareAwardProps = {
  getSlideElement: () => HTMLDivElement | null;
  awardName: string;
};

function supportsNativeShare(): boolean {
  return (
    typeof navigator !== "undefined" &&
    "share" in navigator &&
    "canShare" in navigator
  );
}

export default function ShareAward({ getSlideElement, awardName }: ShareAwardProps) {
  const [isCapturing, setIsCapturing] = useState(false);

  const capture = useCallback(async () => {
    const el = getSlideElement();
    if (!el || isCapturing) return;

    setIsCapturing(true);
    try {
      const { toPng, toBlob } = await import("html-to-image");

      // Check for native sharing support with files
      if (supportsNativeShare()) {
        const blob = await toBlob(el, {
          cacheBust: true,
          backgroundColor: "#000000",
          filter: (node) => !node.hasAttribute?.("data-share-button"),
        });
        if (!blob) return;

        const file = new File([blob], `${awardName}.png`, {
          type: "image/png",
        });

        if (navigator.canShare?.({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: `FPL Award: ${awardName}`,
          });
          return;
        }
      }

      // Fallback: download as PNG
      const dataUrl = await toPng(el, {
        cacheBust: true,
        backgroundColor: "#000000",
        filter: (node) => !node.hasAttribute?.("data-share-button"),
      });
      const link = document.createElement("a");
      link.download = `${awardName}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      // Silence user cancellation (e.g. dismissing the share sheet)
      if (error instanceof DOMException && (error.name === "AbortError" || error.name === "NotAllowedError")) {
        return;
      }
      console.error("Failed to capture/share award:", error);
    } finally {
      setIsCapturing(false);
    }
  }, [getSlideElement, awardName, isCapturing]);

  const isNative = supportsNativeShare();

  return (
    <Button
      data-share-button=""
      variant="secondary"
      className="bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm gap-2 px-4"
      onClick={capture}
      disabled={isCapturing}
    >
      {isNative ? <Share2 size={18} /> : <Download size={18} />}
      <span className="text-sm font-medium">
        {isNative ? "Share" : "Save"}
      </span>
    </Button>
  );
}
