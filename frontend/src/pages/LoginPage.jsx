import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";
import { getApiErrorMessage } from "../utils/errors";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from?.pathname || "/";

  const [formData, setFormData] = useState({ username: "", password: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      await login(formData);
      navigate(redirectTo, { replace: true });
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, "Login failed. Check your credentials."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
      <section className="panel-card bg-[#05070C] p-8 text-white sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#d8eeff]">Welcome back</p>
        <h1 className="mt-4 font-display text-5xl text-white">Sign in to keep checkout smooth.</h1>
        <p className="mt-4 max-w-xl text-base leading-7 text-slate-200">
          Your account unlocks protected routes, order history, and a frictionless handoff from cart to checkout.
        </p>
      </section>

      <section className="panel-card p-6 sm:p-8">
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username" className="muted-label">
              Username
            </label>
            <input id="username" name="username" value={formData.username} onChange={handleChange} className="input-field" required />
          </div>
          <div>
            <label htmlFor="password" className="muted-label">
              Password
            </label>
            <input id="password" name="password" type="password" value={formData.password} onChange={handleChange} className="input-field" required />
          </div>

          {error ? <div className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-600">{error}</div> : null}

          <button type="submit" className="accent-button w-full" disabled={submitting}>
            {submitting ? "Signing in..." : "Login"}
          </button>

          <p className="text-sm text-slate-600">
            Need an account? <Link to="/register" className="font-semibold text-[#6aa6d4] hover:text-[#4d90c2]">Register here</Link>
          </p>
        </form>
      </section>
    </div>
  );
}

