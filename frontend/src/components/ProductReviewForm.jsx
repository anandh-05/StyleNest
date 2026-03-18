import RatingStars from "./RatingStars";

export default function ProductReviewForm({
  formData,
  onChange,
  onSubmit,
  submitting,
  error,
  success,
  hasExistingReview
}) {
  return (
    <form className="panel-card space-y-5 p-6 sm:p-8" onSubmit={onSubmit}>
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#6aa6d4]">
          {hasExistingReview ? "Update your review" : "Write a review"}
        </p>
        <h3 className="mt-2 text-2xl font-semibold text-slate-950">Share your StyleNest experience.</h3>
      </div>

      <div className="space-y-3">
        <label className="muted-label">Rating</label>
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => onChange({ target: { name: "rating", value } })}
              className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                Number(formData.rating) === value
                  ? "border-[#79bff3] bg-[#eef8ff] text-slate-950"
                  : "border-slate-200 bg-white text-slate-600 hover:border-[#b5dcfb] hover:bg-[#f6fbff]"
              }`}
            >
              {value} Star{value > 1 ? "s" : ""}
            </button>
          ))}
        </div>
        <RatingStars rating={formData.rating} showValue />
      </div>

      <div>
        <label htmlFor="title" className="muted-label">
          Review Title
        </label>
        <input
          id="title"
          name="title"
          value={formData.title}
          onChange={onChange}
          className="input-field"
          placeholder="Summarize your experience"
          required
        />
      </div>

      <div>
        <label htmlFor="comment" className="muted-label">
          Review
        </label>
        <textarea
          id="comment"
          name="comment"
          rows="5"
          value={formData.comment}
          onChange={onChange}
          className="input-field resize-none"
          placeholder="What stood out about the fit, material, or overall feel?"
          required
        />
      </div>

      {error ? <div className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-600">{error}</div> : null}
      {success ? <div className="rounded-2xl bg-[#eef8ff] px-4 py-3 text-sm text-[#3d81b4]">{success}</div> : null}

      <button type="submit" className="accent-button" disabled={submitting}>
        {submitting ? "Saving review..." : hasExistingReview ? "Update Review" : "Submit Review"}
      </button>
    </form>
  );
}
