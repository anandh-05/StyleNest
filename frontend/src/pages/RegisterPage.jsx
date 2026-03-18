import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";
import { getApiErrorMessage } from "../utils/errors";

const initialForm = {
  username: "",
  email: "",
  first_name: "",
  last_name: "",
  password: "",
  password_confirm: ""
};

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState(initialForm);
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
      await register(formData);
      navigate("/checkout", { replace: true });
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, "Registration failed."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
      <section className="panel-card bg-white/80 p-8 sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#6aa6d4]">Create account</p>
        <h1 className="mt-4 font-display text-5xl text-slate-900">Register once, shop anytime.</h1>
        <p className="mt-4 max-w-xl text-base leading-7 text-slate-600">
          The backend hashes passwords securely, returns JWTs immediately after signup, and keeps your order history attached to your user profile.
        </p>
      </section>

      <section className="panel-card p-6 sm:p-8">
        <form className="grid gap-5 sm:grid-cols-2" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="first_name" className="muted-label">
              First Name
            </label>
            <input id="first_name" name="first_name" value={formData.first_name} onChange={handleChange} className="input-field" />
          </div>
          <div>
            <label htmlFor="last_name" className="muted-label">
              Last Name
            </label>
            <input id="last_name" name="last_name" value={formData.last_name} onChange={handleChange} className="input-field" />
          </div>
          <div>
            <label htmlFor="username" className="muted-label">
              Username
            </label>
            <input id="username" name="username" value={formData.username} onChange={handleChange} className="input-field" required />
          </div>
          <div>
            <label htmlFor="email" className="muted-label">
              Email
            </label>
            <input id="email" name="email" type="email" value={formData.email} onChange={handleChange} className="input-field" required />
          </div>
          <div>
            <label htmlFor="password" className="muted-label">
              Password
            </label>
            <input id="password" name="password" type="password" value={formData.password} onChange={handleChange} className="input-field" required />
          </div>
          <div>
            <label htmlFor="password_confirm" className="muted-label">
              Confirm Password
            </label>
            <input
              id="password_confirm"
              name="password_confirm"
              type="password"
              value={formData.password_confirm}
              onChange={handleChange}
              className="input-field"
              required
            />
          </div>

          {error ? <div className="sm:col-span-2 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-600">{error}</div> : null}

          <div className="sm:col-span-2 space-y-4">
            <button type="submit" className="accent-button w-full" disabled={submitting}>
              {submitting ? "Creating account..." : "Register"}
            </button>
            <p className="text-sm text-slate-600">
              Already have an account? <Link to="/login" className="font-semibold text-[#6aa6d4] hover:text-[#4d90c2]">Login instead</Link>
            </p>
          </div>
        </form>
      </section>
    </div>
  );
}

