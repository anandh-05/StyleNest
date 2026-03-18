import RatingStars from "./RatingStars";

export default function ProductReviewCard({ review }) {
  return (
    <article className="panel-card space-y-4 p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-base font-semibold text-slate-950">{review.title}</p>
          <p className="mt-1 text-sm text-slate-500">
            {review.username} • {new Date(review.created_at).toLocaleDateString()}
          </p>
        </div>
        <RatingStars rating={review.rating} />
      </div>
      <p className="text-sm leading-7 text-slate-600">{review.comment}</p>
    </article>
  );
}
