import { Link } from "react-router-dom";

import CartItem from "../components/CartItem";
import { useAuth } from "../hooks/useAuth";
import { useCart } from "../hooks/useCart";
import { formatCurrency } from "../utils/currency";

export default function CartPage() {
  const { isAuthenticated } = useAuth();
  const { cartItems, subtotal, updateQuantity, removeFromCart } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="panel-card space-y-5 p-10 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#6aa6d4]">Your cart is empty</p>
        <h1 className="font-display text-5xl text-slate-900">Start building your order.</h1>
        <p className="mx-auto max-w-xl text-base leading-7 text-slate-600">
          Products you add here are stored in localStorage, so the cart stays with you while you explore the storefront.
        </p>
        <div>
          <Link to="/" className="accent-button">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
      <section className="space-y-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#6aa6d4]">Cart</p>
          <h1 className="mt-2 font-display text-5xl text-slate-900">Review your picks.</h1>
        </div>
        {cartItems.map((item) => (
          <CartItem
            key={item.id}
            item={item}
            onIncrement={() => updateQuantity(item.id, item.quantity + 1)}
            onDecrement={() => updateQuantity(item.id, item.quantity - 1)}
            onRemove={() => removeFromCart(item.id)}
          />
        ))}
      </section>

      <aside className="panel-card h-fit space-y-6 p-6 sm:p-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#6aa6d4]">Summary</p>
          <h2 className="mt-2 font-display text-4xl text-slate-900">Checkout preview</h2>
        </div>

        <div className="space-y-3 rounded-[28px] bg-slate-50 p-5">
          <div className="flex items-center justify-between text-sm text-slate-600">
            <span>Items</span>
            <span>{cartItems.length}</span>
          </div>
          <div className="flex items-center justify-between text-sm text-slate-600">
            <span>Shipping</span>
            <span>Calculated at checkout</span>
          </div>
          <div className="flex items-center justify-between border-t border-slate-200 pt-3 text-lg font-semibold text-slate-900">
            <span>Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
        </div>

        {!isAuthenticated ? (
          <div className="rounded-[24px] border border-[#8ecaff]/15 bg-[#8ecaff]/5 p-4 text-sm leading-6 text-slate-700">
            Sign in before checkout so your order can be saved to your account history.
          </div>
        ) : null}

        <div className="flex flex-col gap-3">
          <Link to={isAuthenticated ? "/checkout" : "/login"} className="accent-button w-full">
            {isAuthenticated ? "Proceed To Checkout" : "Login To Checkout"}
          </Link>
          <Link to="/" className="ghost-button w-full">
            Keep Shopping
          </Link>
        </div>
      </aside>
    </div>
  );
}

