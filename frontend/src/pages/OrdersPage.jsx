import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import Loader from "../components/Loader";
import orderService from "../services/orderService";
import { formatCurrency } from "../utils/currency";
import { getApiErrorMessage } from "../utils/errors";

export default function OrdersPage() {
  const location = useLocation();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const data = await orderService.getOrders();
        setOrders(data);
      } catch (requestError) {
        setError(getApiErrorMessage(requestError, "Could not load order history."));
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#6aa6d4]">Account</p>
        <h1 className="mt-2 font-display text-5xl text-slate-900">Your orders</h1>
      </div>

      {location.state?.successMessage ? (
        <div className="rounded-[28px] border border-emerald-200 bg-emerald-50 p-5 text-emerald-700 shadow-soft">
          {location.state.successMessage}
        </div>
      ) : null}

      {loading ? <Loader label="Loading orders" /> : null}
      {error ? <div className="panel-card p-6 text-rose-600">{error}</div> : null}

      {!loading && !error ? (
        orders.length > 0 ? (
          <div className="space-y-5">
            {orders.map((order) => (
              <article key={order.id} className="panel-card space-y-5 p-6 sm:p-8">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#6aa6d4]">Order #{order.id}</p>
                    <h2 className="mt-2 text-2xl font-semibold text-slate-900">{new Date(order.created_at).toLocaleString()}</h2>
                    <p className="mt-2 text-sm text-slate-500">Payment ref: {order.payment_reference}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="status-pill bg-slate-100 text-slate-600">{order.status}</span>
                    <span className="status-pill bg-emerald-100 text-emerald-700">{order.payment_status}</span>
                    <span className="status-pill bg-[#8ecaff]/10 text-[#6aa6d4]">{formatCurrency(order.total_price)}</span>
                  </div>
                </div>

                <div className="grid gap-3">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex flex-col justify-between gap-3 rounded-[22px] bg-slate-50 p-4 sm:flex-row sm:items-center">
                      <div>
                        <p className="text-lg font-semibold text-slate-900">{item.product_name}</p>
                        <p className="text-sm text-slate-500">Qty {item.quantity} • Size {item.size} • {item.color}</p>
                      </div>
                      <div className="text-sm font-semibold text-slate-700">{formatCurrency(item.line_total)}</div>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="panel-card space-y-4 p-10 text-center text-slate-600">
            <p>No orders yet.</p>
            <Link to="/" className="accent-button mx-auto">
              Browse Products
            </Link>
          </div>
        )
      ) : null}
    </div>
  );
}

