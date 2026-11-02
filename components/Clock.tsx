"use client";

import { useEffect, useState } from "react";
import { profile } from "@/lib/data";

export default function Clock({ seconds = false }: { seconds?: boolean }) {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", {
      timeZone: profile.timezone,
      hour: "2-digit",
      minute: "2-digit",
      second: seconds ? "2-digit" : undefined,
    });
    const update = () => setTime(fmt.format(new Date()));
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [seconds]);

  return <span suppressHydrationWarning>{time ?? (seconds ? "--:--:--" : "--:--")}</span>;
}
