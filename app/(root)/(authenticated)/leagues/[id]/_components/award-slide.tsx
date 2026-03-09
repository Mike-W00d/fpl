import { forwardRef, type ReactNode } from "react";
import type { AwardResult } from "@/lib/awards/types";
import { getAwardImageUrl } from "@/lib/awards/image-url";

type AwardSlideProps = {
  award: AwardResult;
  shareButton?: ReactNode;
};

const AwardSlide = forwardRef<HTMLDivElement, AwardSlideProps>(
  ({ award, shareButton }, ref) => {
    return (
      <div
        className={`flex-shrink-0 w-full h-full bg-gradient-to-br ${award.gradient} flex flex-col items-center justify-center text-white relative`}
      >
        <div
          ref={ref}
          className={`bg-gradient-to-br ${award.gradient} flex flex-col items-center justify-center text-white px-8 py-12 max-w-md w-full rounded-2xl`}
        >
          {award.image ? (
            <img
              src={getAwardImageUrl(award.image)}
              alt={award.name}
              className="w-56 h-56 sm:w-64 sm:h-64 object-contain drop-shadow-lg mb-6"
            />
          ) : (
            <span className="text-7xl mb-6">{award.emoji}</span>
          )}

          <h2 className="text-xs sm:text-sm uppercase tracking-[0.2em] font-semibold text-white/80 mb-4">
            {award.name}
          </h2>

          <p className="text-5xl sm:text-6xl font-bold tabular-nums mb-2">
            {award.heroStat}
          </p>

          <p className="text-sm sm:text-base text-white/70 mb-3">
            {award.statLabel}
          </p>

          <p className="text-sm sm:text-base text-white/50 italic mb-8 px-8 text-center">
            {award.description}
          </p>

          <div className="text-center">
            <p className="text-lg sm:text-xl font-semibold">
              {award.winner.entry_name}
            </p>
            <p className="text-sm text-white/60">{award.winner.player_name}</p>
          </div>

          {award.runnerUp && (
            <div className="mt-6 text-center text-white/50 text-xs">
              <p>Runner-up: {award.runnerUp.entry_name}</p>
              <p>{award.runnerUp.stat}</p>
            </div>
          )}
        </div>

        {shareButton && <div className="mt-6">{shareButton}</div>}
      </div>
    );
  },
);

AwardSlide.displayName = "AwardSlide";

export default AwardSlide;
