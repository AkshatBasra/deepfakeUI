import { useMemo, useState } from "react";

function getImageSource(image) {
  const imageData = image?.image || image;

  if (typeof imageData === "string") return imageData;
  if (!imageData?.data) return null;

  return imageData.data.startsWith("data:")
    ? imageData.data
    : `data:${imageData.mime_type || "image/jpeg"};base64,${imageData.data}`;
}

function HeatmapResult({ result }) {
  const images = useMemo(() => {
    const primaryImage = result?.heatmap?.image;
    const frameImages = Array.isArray(result?.frames)
      ? result.frames
      : Array.isArray(result?.heatmap?.frames)
        ? result.heatmap.frames
        : [];

    return [primaryImage, ...frameImages]
      .map((image) => getImageSource(image))
      .filter(Boolean);
  }, [result]);
  const [carouselState, setCarouselState] = useState({
    result: null,
    index: 0,
  });
  const activeIndex =
    carouselState.result === result
      ? Math.min(carouselState.index, Math.max(images.length - 1, 0))
      : 0;

  if (!images.length) return null;

  const showPrevious = () => {
    setCarouselState((state) => ({
      result,
      index: state.result === result
        ? state.index === 0
          ? images.length - 1
          : state.index - 1
        : images.length - 1,
    }));
  };
  const showNext = () => {
    setCarouselState((state) => ({
      result,
      index: state.result === result ? (state.index + 1) % images.length : 1 % images.length,
    }));
  };

  return (
    <section className="heatmap-result" aria-label="Heatmap results">
      <div className="heatmap-result-header">
        <span className="heatmap-label">Heatmap</span>
        {images.length > 1 && (
          <span className="heatmap-counter">
            {activeIndex + 1} / {images.length}
          </span>
        )}
      </div>

      <div className="heatmap-carousel">
        {images.length > 1 && (
          <button
            className="carousel-control"
            type="button"
            onClick={showPrevious}
            aria-label="Show previous heatmap"
          >
            &#8592;
          </button>
        )}
        <img
          className="heatmap-image"
          src={images[activeIndex]}
          alt={`Heatmap frame ${activeIndex + 1}`}
        />
        {images.length > 1 && (
          <button
            className="carousel-control"
            type="button"
            onClick={showNext}
            aria-label="Show next heatmap"
          >
            &#8594;
          </button>
        )}
      </div>

      {images.length > 1 && (
        <div className="carousel-indicators" aria-label="Select heatmap frame">
          {images.map((_, index) => (
            <button
              className={`carousel-indicator${index === activeIndex ? " active" : ""}`}
              type="button"
              key={index}
              onClick={() => setCarouselState({ result, index })}
              aria-label={`Show heatmap frame ${index + 1}`}
              aria-current={index === activeIndex ? "true" : undefined}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default HeatmapResult;
