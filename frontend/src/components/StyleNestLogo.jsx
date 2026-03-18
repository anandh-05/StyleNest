export default function StyleNestLogo({ className = "h-11 w-11" }) {
  return (
    <svg
      viewBox="0 0 64 64"
      aria-hidden="true"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="stylenestBg" x1="10" y1="6" x2="52" y2="58" gradientUnits="userSpaceOnUse">
          <stop stopColor="#111827" />
          <stop offset="1" stopColor="#05070C" />
        </linearGradient>
        <linearGradient id="stylenestStroke" x1="18" y1="18" x2="46" y2="47" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F7FBFF" />
          <stop offset="1" stopColor="#8ECAFF" />
        </linearGradient>
      </defs>
      <rect x="4" y="4" width="56" height="56" rx="18" fill="url(#stylenestBg)" />
      <path
        d="M20 21.5C24.2 18 31 16.8 38.2 18C43.3 18.9 46 21.4 46 24.8C46 29 42.8 31.2 36.9 32.4L28.9 34C23.1 35.1 20 37.3 20 41.2C20 45.2 23.7 47.3 29.8 47.3C35.8 47.3 41 45.4 44.9 41.7"
        stroke="url(#stylenestStroke)"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path d="M18 40.8C24.4 37.7 39.6 37.7 46 40.8" stroke="#A8D9FF" strokeWidth="2.4" strokeLinecap="round" opacity="0.95" />
      <path d="M16.5 46C24.6 42.8 39.4 42.8 47.5 46" stroke="#73BCF0" strokeWidth="2.2" strokeLinecap="round" opacity="0.7" />
    </svg>
  );
}

