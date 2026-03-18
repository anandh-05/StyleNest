import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";
import { useCart } from "../hooks/useCart";
import StyleNestLogo from "./StyleNestLogo";

const navClassName = ({ isActive }) =>
  `rounded-full px-4 py-2 text-sm font-semibold transition ${
    isActive ? "bg-[#05070C] text-white shadow-warm" : "text-slate-700 hover:bg-[#eff7ff] hover:text-slate-950"
  }`;

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();

  const links = [{ label: "Home", to: "/" }];
  if (isAuthenticated) {
    links.push({ label: "Orders", to: "/orders" });
  }

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3" onClick={() => setMenuOpen(false)}>
          <StyleNestLogo />
          <div>
            <p className="font-display text-2xl leading-none text-slate-950">StyleNest</p>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#6aa6d4]">premium wardrobe edit</p>
          </div>
        </Link>

        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white/90 text-slate-700 md:hidden"
          onClick={() => setMenuOpen((current) => !current)}
          aria-label="Toggle navigation"
        >
          <span className="space-y-1.5">
            <span className="block h-0.5 w-5 bg-current" />
            <span className="block h-0.5 w-5 bg-current" />
            <span className="block h-0.5 w-5 bg-current" />
          </span>
        </button>

        <div className={`${menuOpen ? "flex" : "hidden"} absolute left-4 right-4 top-[84px] flex-col gap-4 rounded-[28px] border border-slate-200 bg-white/95 p-5 shadow-soft md:static md:flex md:flex-row md:items-center md:rounded-none md:border-0 md:bg-transparent md:p-0 md:shadow-none`}>
          <nav className="flex flex-col gap-2 md:flex-row md:items-center">
            {links.map((link) => (
              <NavLink key={link.to} to={link.to} className={navClassName} onClick={() => setMenuOpen(false)}>
                {link.label}
              </NavLink>
            ))}
            <NavLink to="/cart" className={navClassName} onClick={() => setMenuOpen(false)}>
              Cart {cartCount > 0 ? `(${cartCount})` : ""}
            </NavLink>
          </nav>

          <div className="flex flex-col gap-3 md:ml-4 md:flex-row md:items-center">
            {isAuthenticated ? (
              <>
                <div className="rounded-full bg-[#eaf6ff] px-4 py-2 text-sm font-semibold text-[#4f93c6]">
                  {user?.username}
                </div>
                <button type="button" onClick={handleLogout} className="ghost-button">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="ghost-button" onClick={() => setMenuOpen(false)}>
                  Login
                </Link>
                <Link to="/register" className="accent-button" onClick={() => setMenuOpen(false)}>
                  Create Account
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}


