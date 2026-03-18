import { formatCurrency } from "../utils/currency";

export default function CartItem({ item, onIncrement, onDecrement, onRemove }) {
  return (
    <div className="panel-card grid gap-5 p-4 sm:grid-cols-[110px_1fr] sm:p-5">
      <img
        src={item.image || "https://via.placeholder.com/300x300?text=Item"}
        alt={item.name}
        className="h-28 w-full rounded-3xl object-cover sm:w-28"
      />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-slate-900">{item.name}</h3>
          <div className="flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            <span className="rounded-full bg-slate-100 px-3 py-1">{item.category}</span>
            <span className="rounded-full bg-slate-100 px-3 py-1">Size {item.size}</span>
            <span className="rounded-full bg-slate-100 px-3 py-1">{item.color}</span>
          </div>
          <p className="text-sm text-slate-500">Saved locally so your cart survives a refresh.</p>
        </div>

        <div className="flex flex-col items-start gap-3 sm:items-end">
          <div className="text-lg font-semibold text-slate-900">{formatCurrency(Number(item.price) * item.quantity)}</div>
          <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 p-1">
            <button type="button" onClick={onDecrement} className="h-9 w-9 rounded-full text-lg text-slate-700 transition hover:bg-slate-100">
              -
            </button>
            <span className="w-10 text-center text-sm font-semibold">{item.quantity}</span>
            <button type="button" onClick={onIncrement} className="h-9 w-9 rounded-full text-lg text-slate-700 transition hover:bg-slate-100">
              +
            </button>
          </div>
          <button type="button" onClick={onRemove} className="text-sm font-semibold text-rose-600 transition hover:text-rose-700">
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}

