import { Link } from "react-router-dom";

import { useCart } from "../hooks/useCart";
import { formatCurrency } from "../utils/currency";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  return (
    <article className="group panel-card overflow-hidden animate-rise">
      <div className="relative overflow-hidden">
        <img
          src={product.image || "https://via.placeholder.com/600x750?text=Product"}
          alt={product.name}
          className="h-72 w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute left-4 top-4 rounded-full bg-white/85 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-[#05070C] backdrop-blur">
          {product.category}
        </div>
      </div>

      <div className="space-y-4 p-5">
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-4">
            <h3 className="text-xl font-semibold text-slate-900">{product.name}</h3>
            <span className="rounded-full bg-[#8ecaff]/10 px-3 py-1 text-sm font-semibold text-[#6aa6d4]">
              {formatCurrency(product.price)}
            </span>
          </div>
          <p className="min-h-[3rem] text-sm leading-6 text-slate-600">{product.description}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          <span className="rounded-full bg-slate-100 px-3 py-1">Size {product.size}</span>
          <span className="rounded-full bg-slate-100 px-3 py-1">{product.color}</span>
          <span className={`rounded-full px-3 py-1 ${product.stock > 0 ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}>
            {product.stock > 0 ? `${product.stock} in stock` : "Sold out"}
          </span>
        </div>

        <div className="flex gap-3">
          <Link to={`/products/${product.id}`} className="ghost-button flex-1">
            View Details
          </Link>
          <button
            type="button"
            onClick={() => addToCart(product, 1)}
            disabled={product.stock === 0}
            className="accent-button flex-1"
          >
            Add To Cart
          </button>
        </div>
      </div>
    </article>
  );
}

