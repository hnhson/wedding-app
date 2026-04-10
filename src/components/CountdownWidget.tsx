'use client';

import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

interface TimeLeft {
  isPast: boolean;
  daysPast: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function getTimeLeft(weddingDate: string): TimeLeft {
  const now = dayjs();
  const wedding = dayjs(weddingDate);
  const diff = wedding.diff(now);

  if (diff <= 0) {
    return {
      isPast: true,
      daysPast: now.diff(wedding, 'day'),
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    };
  }

  const dur = dayjs.duration(diff);
  return {
    isPast: false,
    daysPast: 0,
    days: Math.floor(dur.asDays()),
    hours: dur.hours(),
    minutes: dur.minutes(),
    seconds: dur.seconds(),
  };
}

export default function CountdownWidget({
  weddingDate,
}: {
  weddingDate: string;
}) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);

  useEffect(() => {
    if (!weddingDate) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTimeLeft(getTimeLeft(weddingDate));
    const interval = setInterval(
      () => setTimeLeft(getTimeLeft(weddingDate)),
      1000,
    );
    return () => clearInterval(interval);
  }, [weddingDate]);

  if (!weddingDate || !timeLeft) return null;

  if (timeLeft.isPast) {
    return (
      <div className="text-center">
        <p
          className="text-2xl font-light"
          style={{ color: 'var(--card-accent, #D4AF37)' }}
        >
          Đã {timeLeft.daysPast} ngày hạnh phúc
        </p>
      </div>
    );
  }

  return (
    <div className="flex justify-center gap-6 text-center">
      {[
        { value: timeLeft.days, label: 'Ngày' },
        { value: timeLeft.hours, label: 'Giờ' },
        { value: timeLeft.minutes, label: 'Phút' },
        { value: timeLeft.seconds, label: 'Giây' },
      ].map(({ value, label }) => (
        <div key={label}>
          <p
            className="text-4xl font-bold"
            style={{ color: 'var(--card-primary, #B76E79)' }}
          >
            {String(value).padStart(2, '0')}
          </p>
          <p className="text-xs tracking-widest uppercase opacity-70">
            {label}
          </p>
        </div>
      ))}
    </div>
  );
}
