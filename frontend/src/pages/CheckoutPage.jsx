import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";
import { useCart } from "../hooks/useCart";
import orderService from "../services/orderService";
import { PAYMENT_PROVIDERS } from "../utils/constants";
import { formatCurrency } from "../utils/currency";
import { getApiErrorMessage } from "../utils/errors";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cartItems, subtotal, clearCart } = useCart();
  const [formData, setFormData] = useState({
    shipping_name: `${user?.first_name || ""} ${user?.last_name || ""}`.trim(),
    shipping_email: user?.email || "",
    shipping_phone: "",
    shipping_address: "",
    payment_provider: "simulation"
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [paymentMessage, setPaymentMessage] = useState("");

  const itemCount = useMemo(() => cartItems.reduce((sum, item) => sum + item.quantity, 0), [cartItems]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    setPaymentMessage("");

    try {
      const paymentResponse = await orderService.simulatePayment({
        amount: subtotal.toFixed(2),
        provider: formData.payment_provider,
        currency: "INR"
      });

      const createdOrder = await orderService.createOrder({
        ...formData,
        order_items: cartItems.map((item) => ({
          product_id: item.id,
          quantity: item.quantity
        }))
      });

      setPaymentMessage(paymentResponse.message);
      clearCart();
      navigate("/orders", {
        replace: true,
        state: {
          successMessage: `Order #${createdOrder.id} placed successfully. ${paymentResponse.message}`
        }
      });
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, "Checkout failed. Please review your cart and try again."));
    } finally {
      setSubmitting(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="panel-card space-y-5 p-10 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#6aa6d4]">Nothing to checkout</p>
        <h1 className="font-display text-5xl text-slate-900">Your cart is empty.</h1>
        <p className="mx-auto max-w-xl text-base leading-7 text-slate-600">
          Add products first, then come back here to test the full simulated payment and order creation flow.
        </p>
        <div>
          <Link to="/" className="accent-button">
            Shop Now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-8 xl:grid-cols-[1.05fr_0.95fr]">
      <section className="panel-card p-6 sm:p-8">
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#6aa6d4]">Checkout</p>
          <h1 className="mt-2 font-display text-5xl text-slate-900">Confirm shipping and payment.</h1>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="shipping_name" className="muted-label">
              Full Name
            </label>
            <input id="shipping_name" name="shipping_name" value={formData.shipping_name} onChange={handleChange} className="input-field" required />
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="shipping_email" className="muted-label">
                Email
              </label>
              <input
                id="shipping_email"
                name="shipping_email"
                type="email"
                value={formData.shipping_email}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>
            <div>
              <label htmlFor="shipping_phone" className="muted-label">
                Phone
              </label>
              <input id="shipping_phone" name="shipping_phone" value={formData.shipping_phone} onChange={handleChange} className="input-field" required />
            </div>
          </div>
          <div>
            <label htmlFor="shipping_address" className="muted-label">
              Shipping Address
            </label>
            <textarea
              id="shipping_address"
              name="shipping_address"
              rows="5"
              value={formData.shipping_address}
              onChange={handleChange}
              className="input-field resize-none"
              placeholder="Street, city, state, postal code, country"
              required
            />
          </div>
          <div>
            <label htmlFor="payment_provider" className="muted-label">
              Payment Provider Placeholder
            </label>
            <select id="payment_provider" name="payment_provider" value={formData.payment_provider} onChange={handleChange} className="input-field" required>
              {PAYMENT_PROVIDERS.map((provider) => (
                <option key={provider.value} value={provider.value}>
                  {provider.label}
                </option>
              ))}
            </select>
          </div>

          {error ? <div className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-600">{error}</div> : null}
          {paymentMessage ? <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{paymentMessage}</div> : null}

          <button type="submit" className="accent-button w-full" disabled={submitting}>
            {submitting ? "Processing simulated payment..." : "Place Order"}
          </button>
        </form>
      </section>

      <aside className="panel-card h-fit space-y-5 p-6 sm:p-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#6aa6d4]">Order summary</p>
          <h2 className="mt-2 font-display text-4xl text-slate-900">{itemCount} item(s) ready.</h2>
        </div>

        <div className="space-y-3">
          {cartItems.map((item) => (
            <div key={item.id} className="flex items-center gap-4 rounded-[24px] bg-slate-50 p-4">
              <img src={item.image || "https://via.placeholder.com/140x140?text=Item"} alt={item.name} className="h-16 w-16 rounded-2xl object-cover" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-base font-semibold text-slate-900">{item.name}</p>
                <p className="text-sm text-slate-500">Qty {item.quantity} • Size {item.size}</p>
              </div>
              <div className="text-sm font-semibold text-slate-700">{formatCurrency(Number(item.price) * item.quantity)}</div>
            </div>
          ))}
        </div>

        <div className="rounded-[28px] bg-[#05070C] p-6 text-white">
          <div className="flex items-center justify-between text-sm text-slate-200">
            <span>Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-3 text-xl font-semibold">
            <span>Total</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
        </div>
      </aside>
    </div>
  );
}

