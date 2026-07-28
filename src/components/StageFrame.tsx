import type { ReactNode } from 'react';

interface StageFrameProps {
  title: string;
  duration?: number;
  eyebrow: string;
  hidden?: boolean;
  children: ReactNode;
}

export function StageFrame({
  title,
  duration,
  eyebrow,
  hidden = false,
  children,
}: StageFrameProps) {
  return (
    <section
      className="stage-frame"
      aria-labelledby={`${eyebrow.replace(/\s+/g, '-').toLowerCase()}-title`}
      hidden={hidden}
    >
      <div className="stage-heading">
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h1 id={`${eyebrow.replace(/\s+/g, '-').toLowerCase()}-title`}>
            {title}
          </h1>
        </div>
        {duration ? (
          <span className="duration-pill">{duration} min</span>
        ) : null}
      </div>
      <div className="stage-content">{children}</div>
    </section>
  );
}
