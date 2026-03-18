import { useEffect, useMemo, useState } from "react";

import Loader from "../components/Loader";
import ProductCard from "../components/ProductCard";
import StyleNestLogo from "../components/StyleNestLogo";
import productService from "../services/productService";
import { PRODUCT_CATEGORIES } from "../utils/constants";
import { getApiErrorMessage } from "../utils/errors";

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await productService.getProducts();
        setProducts(data);
      } catch (requestError) {
        setError(getApiErrorMessage(requestError, "Could not load products."));
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const categoryMatch = activeCategory === "all" || product.category === activeCategory;
      const searchMatch = `${product.name} ${product.description}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase().trim());
      return categoryMatch && searchMatch;
    });
  }, [activeCategory, products, searchTerm]);

  return (
    <div className="space-y-10">
      <section className="relative overflow-hidden rounded-[34px] bg-[#05070C] text-white shadow-soft">
        <div className="absolute -right-12 top-8 h-56 w-56 rounded-full bg-[#8ecaff]/25 blur-3xl" />
        <div className="absolute left-6 top-10 h-32 w-32 rounded-full border border-[#8ecaff]/25 animate-drift" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.1),transparent_34%)]" />
        <div className="grid gap-10 px-6 py-10 sm:px-10 lg:grid-cols-[1.2fr_0.95fr] lg:px-12 lg:py-14">
          <div className="relative z-10 space-y-6">
            <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur">
              <StyleNestLogo className="h-9 w-9" />
              <span className="text-xs font-semibold uppercase tracking-[0.28em] text-[#d8eeff]">StyleNest Signature</span>
            </div>
            <div className="space-y-4">
              <h1 className="max-w-3xl font-display text-5xl leading-tight text-white sm:text-6xl">
                A premium fashion storefront in black, white, and light blue.
              </h1>
              <p className="max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
                StyleNest curates elevated essentials with a polished shopping flow, refined visuals, and a backend ready for real orders, auth, and payments.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a href="#catalog" className="accent-button">
                Shop The Edit
              </a>
              <div className="rounded-full border border-white/12 bg-white/5 px-5 py-3 text-sm font-semibold text-slate-100 backdrop-blur">
                React + Django REST + Tailwind
              </div>
            </div>
          </div>

          <div className="panel-card relative overflow-hidden border-white/10 bg-white/5 p-6 text-white backdrop-blur-md">
            <div className="absolute inset-x-6 top-6 h-px bg-gradient-to-r from-transparent via-[#d8eeff] to-transparent" />
            <div className="space-y-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#d8eeff]">Premium storefront snapshot</p>
                <h2 className="mt-3 font-display text-3xl text-white">Built for a luxury retail feel.</h2>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                  <p className="text-3xl font-bold text-white">JWT</p>
                  <p className="mt-2 text-sm text-slate-300">Secure sessions with refresh support and protected routes.</p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                  <p className="text-3xl font-bold text-white">Catalog</p>
                  <p className="mt-2 text-sm text-slate-300">Curated product cards, filters, detail pages, and admin CRUD.</p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                  <p className="text-3xl font-bold text-white">Cart</p>
                  <p className="mt-2 text-sm text-slate-300">Persistent localStorage cart with quantity controls and smooth checkout.</p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                  <p className="text-3xl font-bold text-white">Orders</p>
                  <p className="mt-2 text-sm text-slate-300">Real order records, shipping details, and payment-ready placeholders.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="catalog" className="space-y-6">
        <div className="flex flex-col gap-5 rounded-[30px] border border-slate-200/80 bg-white/80 p-6 shadow-soft backdrop-blur sm:p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#6aa6d4]">Catalog</p>
              <h2 className="mt-2 font-display text-4xl text-slate-950">A sharper, more premium shopping experience.</h2>
            </div>
            <div className="w-full max-w-md">
              <label htmlFor="search" className="muted-label">
                Search Products
              </label>
              <input
                id="search"
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search by name or description"
                className="input-field"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            {PRODUCT_CATEGORIES.map((category) => (
              <button
                key={category.value}
                type="button"
                onClick={() => setActiveCategory(category.value)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  activeCategory === category.value
                    ? "bg-[#05070C] text-white shadow-warm"
                    : "bg-slate-100 text-slate-600 hover:bg-[#eff7ff] hover:text-slate-950"
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? <Loader label="Loading products" /> : null}

        {error ? <div className="panel-card p-6 text-rose-600">{error}</div> : null}

        {!loading && !error ? (
          filteredProducts.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="panel-card p-10 text-center text-slate-600">
              No products matched that search. Try a different category or keyword.
            </div>
          )
        ) : null}
      </section>
    </div>
  );
}


