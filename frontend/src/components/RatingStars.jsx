export default function RatingStars({ rating = 0, size = "text-base", showValue = false }) {
  const safeRating = Number(rating || 0);

  return (
    <div className="flex items-center gap-2">
      <div className={`flex items-center gap-1 ${size}`}>
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            aria-hidden="true"
            className={star <= Math.round(safeRating) ? "text-[#79bff3]" : "text-slate-300"}
          >
            ★
          </span>
        ))}
      </div>
      {showValue ? <span className="text-sm font-semibold text-slate-700">{safeRating.toFixed(1)}</span> : null}
    </div>
  );
}
