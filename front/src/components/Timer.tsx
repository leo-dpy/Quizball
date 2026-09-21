import { useEffect, useState } from 'react';

interface TimerProps {
  durationSeconds?: number;
  isPaused?: boolean;
  onTimeUp: () => void;
}

export function Timer({
  durationSeconds = 30,
  isPaused = false,
  onTimeUp,
}: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(durationSeconds);

  useEffect(() => {
    if (isPaused || timeLeft <= 0) {
      if (timeLeft <= 0 && !isPaused) {
        onTimeUp();
      }
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, isPaused, onTimeUp]);

  const percentage = Math.max(0, Math.min(100, (timeLeft / durationSeconds) * 100));

  let statusClass = 'is-normal';
  let barColor = 'var(--cq-accent)';

  if (timeLeft <= 5) {
    statusClass = 'is-critical';
    barColor = 'var(--cq-wrong)';
  } else if (timeLeft <= 10) {
    statusClass = 'is-warning';
    barColor = 'var(--cq-accent-orange)';
  }

  return (
    <div className="cq-timer-card">
      <div className="cq-timer-top">
        <span style={{ color: 'var(--cq-ink-muted)', fontSize: '13px' }}>Temps restant</span>
        <div className={`cq-timer-countdown ${statusClass}`}>
          <span>⏱</span>
          <span>{timeLeft}s</span>
        </div>
      </div>
      <div className="cq-timer-bar-bg">
        <div
          className="cq-timer-bar-fill"
          style={{
            width: `${percentage}%`,
            backgroundColor: barColor,
          }}
        />
      </div>
    </div>
  );
}
