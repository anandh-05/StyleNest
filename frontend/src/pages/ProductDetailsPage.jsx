import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import Loader from "../components/Loader";
import ProductGalleryLightbox from "../components/ProductGalleryLightbox";
import ProductReviewCard from "../components/ProductReviewCard";
import ProductReviewForm from "../components/ProductReviewForm";
import RatingStars from "../components/RatingStars";
import { useAuth } from "../hooks/useAuth";
import { useCart } from "../hooks/useCart";
import productService from "../services/productService";
import { formatCurrency } from "../utils/currency";
import { getApiErrorMessage } from "../utils/errors";
import { getProductGallery } from "../utils/productGallery";

const emptyReviewForm = {
  rating: 5,
  title: "",
  comment: ""
};

export default function ProductDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, buyNow } = useCart();
  const { isAuthenticated, user } = useAuth();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reviewForm, setReviewForm] = useState(emptyReviewForm);
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState("");
  const [reviewSuccess, setReviewSuccess] = useState("");

  const fetchProduct = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const data = await productService.getProduct(id);
      setProduct(data);
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, "Could not load this product."));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  const productGallery = useMemo(() => getProductGallery(product), [product]);

  useEffect(() => {
    setActiveImageIndex(0);
  }, [productGallery]);

  const userReview = useMemo(() => {
    if (!product?.reviews || !user) {
      return null;
    }

    return product.reviews.find((review) => review.user_id === user.id) || null;
  }, [product?.reviews, user]);

  useEffect(() => {
    if (userReview) {
      setReviewForm({
        rating: userReview.rating,
        title: userReview.title,
        comment: userReview.comment
      });
      return;
    }

    setReviewForm(emptyReviewForm);
  }, [userReview]);

  const handleReviewChange = (event) => {
    const { name, value } = event.target;
    setReviewForm((current) => ({
      ...current,
      [name]: name === "rating" ? Number(value) : value
    }));
  };

  const handleReviewSubmit = async (event) => {
    event.preventDefault();
    setReviewSubmitting(true);
    setReviewError("");
    setReviewSuccess("");

    try {
      await productService.addReview(id, reviewForm);
      setReviewSuccess(userReview ? "Your review has been updated." : "Your review has been added.");
      await fetchProduct();
    } catch (requestError) {
      setReviewError(getApiErrorMessage(requestError, "Could not save your review."));
    } finally {
      setReviewSubmitting(false);
    }
  };

  const handleBuyNow = () => {
    buyNow(product, quantity);

    if (isAuthenticated) {
      navigate("/checkout");
      return;
    }

    navigate("/login", {
      state: {
        from: {
          pathname: "/checkout"
        }
      }
    });
  };

  if (loading) {
    return <Loader label="Loading product" fullScreen />;
  }

  if (error || !product) {
    return <div className="panel-card p-6 text-rose-600">{error || "Product not found."}</div>;
  }

  const averageRating = Number(product.average_rating || 0);
  const reviewCount = Number(product.review_count || 0);
  const activeImage = productGallery[activeImageIndex];

  return (
    <div className="space-y-8">
      <ProductGalleryLightbox
        images={productGallery}
        initialIndex={activeImageIndex}
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
      />

      <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4">
          <button
            type="button"
            onClick={() => setIsLightboxOpen(true)}
            className="panel-card group relative block w-full overflow-hidden text-left"
          >
            <img
              src={activeImage?.image || product.image || "https://via.placeholder.com/900x900?text=Product"}
              alt={product.name}
              className="h-full min-h-[420px] w-full object-cover transition duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-x-4 bottom-4 flex items-center justify-between rounded-full border border-white/15 bg-[#05070C]/70 px-4 py-3 text-sm font-semibold text-white backdrop-blur">
              <span>Tap to zoom</span>
              <span>
                {activeImageIndex + 1} / {productGallery.length}
              </span>
            </div>
          </button>

          {productGallery.length > 1 ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {productGallery.map((image, index) => (
                <button
                  key={image.id ?? `${image.image}-${index}`}
                  type="button"
                  onClick={() => setActiveImageIndex(index)}
                  className={`panel-card overflow-hidden border transition ${
                    activeImageIndex === index ? "border-[#79bff3] ring-2 ring-[#dff1ff]" : "border-slate-200"
                  }`}
                >
                  <img
                    src={image.image}
                    alt={image.alt_text}
                    className="h-28 w-full object-cover"
                  />
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <div className="space-y-6">
          <div className="panel-card space-y-6 p-6 sm:p-8">
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#6aa6d4]">{product.category}</p>
              <h1 className="font-display text-5xl text-slate-900">{product.name}</h1>
              <p className="text-lg leading-8 text-slate-600">{product.description}</p>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              <span className="rounded-full bg-slate-100 px-4 py-2">Size {product.size}</span>
              <span className="rounded-full bg-slate-100 px-4 py-2">{product.color}</span>
              <span
                className={`rounded-full px-4 py-2 ${
                  product.stock > 0 ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
                }`}
              >
                {product.stock > 0 ? `${product.stock} available` : "Out of stock"}
              </span>
            </div>

            <div className="flex items-center justify-between rounded-[28px] bg-[#05070C] px-6 py-5 text-white">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.26em] text-slate-300">Price</p>
                <p className="mt-2 text-4xl font-bold">{formatCurrency(product.price)}</p>
              </div>
              <div className="rounded-3xl bg-white/10 px-4 py-3 text-sm text-slate-100">
                Shipped from our starter backend
              </div>
            </div>

            <div className="space-y-4">
              <label className="muted-label">Quantity</label>
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 p-1">
                  <button
                    type="button"
                    onClick={() => setQuantity((current) => Math.max(1, current - 1))}
                    className="h-10 w-10 rounded-full text-lg text-slate-700 transition hover:bg-slate-100"
                  >
                    -
                  </button>
                  <span className="w-10 text-center text-sm font-semibold">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity((current) => Math.min(product.stock || 1, current + 1))}
                    className="h-10 w-10 rounded-full text-lg text-slate-700 transition hover:bg-slate-100"
                  >
                    +
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => addToCart(product, quantity)}
                  disabled={product.stock === 0}
                  className="accent-button"
                >
                  Add {quantity} To Cart
                </button>
                <button
                  type="button"
                  onClick={handleBuyNow}
                  disabled={product.stock === 0}
                  className="ghost-button"
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>

          <div className="panel-card space-y-5 p-6 sm:p-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#6aa6d4]">Rating snapshot</p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-950">How customers rate this piece</h2>
              </div>
              <div className="rounded-full bg-[#eef8ff] px-4 py-2 text-sm font-semibold text-[#4f93c6]">
                {reviewCount} review{reviewCount === 1 ? "" : "s"}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-[auto_1fr] sm:items-center">
              <div className="text-5xl font-bold text-slate-950">{averageRating.toFixed(1)}</div>
              <div className="space-y-2">
                <RatingStars rating={averageRating} size="text-2xl" />
                <p className="text-sm text-slate-500">
                  {reviewCount > 0
                    ? "Ratings are averaged from customer reviews on this product."
                    : "No ratings yet. Be the first to leave one."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#6aa6d4]">Reviews</p>
            <h2 className="mt-2 font-display text-4xl text-slate-950">Product feedback and fit notes</h2>
          </div>

          {product.reviews.length > 0 ? (
            <div className="space-y-4">
              {product.reviews.map((review) => (
                <ProductReviewCard key={review.id} review={review} />
              ))}
            </div>
          ) : (
            <div className="panel-card p-8 text-center text-slate-600">
              No reviews yet. This product is ready for its first rating.
            </div>
          )}
        </div>

        <div>
          {isAuthenticated ? (
            <ProductReviewForm
              formData={reviewForm}
              onChange={handleReviewChange}
              onSubmit={handleReviewSubmit}
              submitting={reviewSubmitting}
              error={reviewError}
              success={reviewSuccess}
              hasExistingReview={Boolean(userReview)}
            />
          ) : (
            <div className="panel-card space-y-4 p-6 sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#6aa6d4]">Write a review</p>
              <h3 className="text-2xl font-semibold text-slate-950">Sign in to rate this product.</h3>
              <p className="text-sm leading-7 text-slate-600">
                Reviews are attached to authenticated accounts so each customer can manage a single review per product.
              </p>
              <Link to="/login" className="accent-button">
                Login To Review
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
