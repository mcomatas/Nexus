import { GameCard } from "./gamecard";
import { useRef } from "react";
import { IoArrowForward, IoArrowBack } from "react-icons/io5";

export const GameCarousel = ({ games, header }) => {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    scrollRef.current?.scrollBy({ left: direction * 300, behavior: "smooth" });
  };

  return (
    <div>
      <div className="relative px-12">
        <h1 className="text-xl font-semibold px-2 pt-2 pb-1">{header}</h1>
        <div className="border-b border-0.5 border-text-muted" />
        {/* Left Button */}
        <button
          onClick={() => scroll(-1)}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full cursor-pointer"
        >
          <IoArrowBack />
        </button>

        <div
          ref={scrollRef}
          className="flex flex-nowrap gap-4 overflow-x-auto snap-x snap-mandatory pb-4 pt-4 scrollbar-hide"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {games}
        </div>

        {/* Right Button */}
        <button
          onClick={() => scroll(1)}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full cursor-pointer"
        >
          <IoArrowForward />
        </button>
      </div>
    </div>
  );
};
