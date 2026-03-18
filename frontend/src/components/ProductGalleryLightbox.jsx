import { useEffect, useMemo, useState } from "react";

export default function ProductGalleryLightbox({
  images,
  initialIndex = 0,
  isOpen,
  onClose,
}) {
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [zoomLevel, setZoomLevel] = useState(1);

  useEffect(() => {
    if (!isOpen) {
      setZoomLevel(1);
      return;
    }

    setActiveIndex(initialIndex);
  }, [initialIndex, isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }

      if (event.key === "ArrowRight") {
        setActiveIndex((current) => (current + 1) % images.length);
        setZoomLevel(1);
      }

      if (event.key === "ArrowLeft") {
        setActiveIndex((current) => (current - 1 + images.length) % images.length);
        setZoomLevel(1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [images.length, isOpen, onClose]);

  const activeImage = useMemo(() => images[activeIndex], [activeIndex, images]);

  const handlePrevious = () => {
    setActiveIndex((current) => (current - 1 + images.length) % images.length);
    setZoomLevel(1);
  };

  const handleNext = () => {
    setActiveIndex((current) => (current + 1) % images.length);
    setZoomLevel(1);
  };

  const handleZoomIn = () => {
    setZoomLevel((current) => Math.min(current + 0.5, 2.5));
  };

  const handleZoomOut = () => {
    setZoomLevel((current) => Math.max(current - 0.5, 1));
  };

  const stopPropagation = (event) => {
    event.stopPropagation();
  };

  const handleClose = (event) => {
    if (event) {
      event.stopPropagation();
    }

    onClose();
  };

  if (!isOpen || !activeImage) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/92 px-4 py-6"
      onClick={onClose}
    >
      <button
        type="button"
        onClick={handleClose}
        className="absolute right-5 top-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/12 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
      >
        <span aria-hidden="true" className="text-base leading-none">X</span>
        <span>Exit Zoom</span>
      </button>

      <div
        className="absolute left-5 top-5 flex items-center gap-3 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur"
        onClick={stopPropagation}
      >
        <span>
          {activeIndex + 1} / {images.length}
        </span>
        <span className="text-white/60">|</span>
        <span>Zoom {zoomLevel.toFixed(1)}x</span>
      </div>

      <div
        className="absolute bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-3 rounded-full border border-white/15 bg-white/10 px-3 py-2 backdrop-blur"
        onClick={stopPropagation}
      >
        <button
          type="button"
          onClick={handlePrevious}
          className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
        >
          Prev
        </button>
        <button
          type="button"
          onClick={handleZoomOut}
          className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
        >
          -
        </button>
        <button
          type="button"
          onClick={handleZoomIn}
          className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
        >
          +
        </button>
        <button
          type="button"
          onClick={handleNext}
          className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
        >
          Next
        </button>
      </div>

      <div
        className="flex h-full w-full max-w-6xl flex-col items-center justify-center gap-5"
        onClick={stopPropagation}
      >
        <div className="relative flex max-h-[78vh] w-full items-center justify-center overflow-auto rounded-[30px] border border-white/10 bg-white/5 p-4 backdrop-blur">
          <button
            type="button"
            onClick={handleClose}
            className="absolute right-4 top-4 z-10 rounded-full border border-white/20 bg-black/45 px-4 py-2 text-sm font-semibold text-white backdrop-blur transition hover:bg-black/60"
          >
            Exit
          </button>
          <img
            src={activeImage.image}
            alt={activeImage.alt_text}
            onClick={() => setZoomLevel((current) => (current === 1 ? 2 : 1))}
            className={`max-h-[72vh] w-auto max-w-full cursor-zoom-in rounded-[22px] object-contain transition duration-300 ${
              zoomLevel > 1 ? "cursor-zoom-out" : ""
            }`}
            style={{ transform: `scale(${zoomLevel})` }}
          />
        </div>

        {images.length > 1 ? (
          <div className="flex max-w-full gap-3 overflow-x-auto pb-2">
            {images.map((image, index) => (
              <button
                key={image.id ?? `${image.image}-${index}`}
                type="button"
                onClick={() => {
                  setActiveIndex(index);
                  setZoomLevel(1);
                }}
                className={`overflow-hidden rounded-2xl border transition ${
                  activeIndex === index ? "border-[#79bff3]" : "border-white/15"
                }`}
              >
                <img
                  src={image.image}
                  alt={image.alt_text}
                  className="h-20 w-20 object-cover"
                />
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
