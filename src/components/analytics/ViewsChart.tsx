import type { DailyView } from '@/types/analytics';

interface Props {
  days: DailyView[];
}

export default function ViewsChart({ days }: Props) {
  if (days.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-gray-400">
        Chưa có lượt xem nào trong 14 ngày qua
      </p>
    );
  }

  const maxCount = Math.max(...days.map((d) => d.view_count), 1);

  return (
    <div className="flex items-end gap-1.5" style={{ height: '120px' }}>
      {days.map((day) => {
        const heightPct = Math.round((day.view_count / maxCount) * 100);
        const shortDate = day.view_date.slice(5); // "MM-DD"
        return (
          <div
            key={day.view_date}
            className="flex flex-1 flex-col items-center gap-1"
          >
            <span className="text-xs text-gray-500">{day.view_count}</span>
            <div
              data-testid="views-bar"
              className="w-full rounded-t bg-blue-400 transition-all"
              style={{ height: `${heightPct}%` }}
            />
            <span className="text-[10px] text-gray-400">{shortDate}</span>
          </div>
        );
      })}
    </div>
  );
}
