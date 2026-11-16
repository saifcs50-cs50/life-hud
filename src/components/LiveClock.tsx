import { useEffect, useState } from "react";

export function LiveClock() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const time = now.toLocaleTimeString("en-US", { hour12: true });

  return (
    <p className="font-tele text-lg font-semibold whitespace-nowrap text-ink-100">
      {time}
    </p>
  );
}
