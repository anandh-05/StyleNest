export default function Loader({ label = "Loading", fullScreen = false }) {
  return (
    <div className={fullScreen ? "flex min-h-[55vh] items-center justify-center" : "flex items-center justify-center py-12"}>
      <div className="inline-flex items-center gap-3 rounded-full border border-white/70 bg-white/80 px-5 py-3 shadow-soft backdrop-blur">
        <span className="relative flex h-3 w-3">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#8ecaff] opacity-75" />
          <span className="relative inline-flex h-3 w-3 rounded-full bg-[#8ecaff]" />
        </span>
        <span className="text-sm font-medium text-slate-700">{label}</span>
      </div>
    </div>
  );
}

