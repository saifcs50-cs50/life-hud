import { useEffect, useState } from "react";

export function LiveClock() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const time = now.toLocaleTimeString("en-US", { hour12: true });

  return (
    <div className="text-right">
      <p className="font-tele text-[11px] tracking-[0.25em] text-ink-700">
        LIVE
      </p>
      <p className="font-tele text-lg font-semibold text-ink-100">{time}</p>
    </div>
  );
}
