import { FC, ReactNode } from "react";
import { ChevronLeft } from "lucide-react";

interface ContentLayoutProps {
  backText: string;
  onBackClick: () => void;
  children: ReactNode;
}

/**
 * Mirrors chambers_proto's library page chrome:
 *
 * - Outer page bg = neutral-grey-200 (#fbfbfc)
 * - Back row at padding `spacing-3xl spacing-4xl` (24px 32px)
 * - "Back" link = `cb-sm cb-sm-secondary` style: 32px-tall, padded chevron
 *   button (bg-grey-100 + 1px border-tertiary) + `caption-md` text in
 *   text-secondary at 0.13px letter-spacing
 * - White card with `radius-xl` (12px), `border-tertiary`, margins
 *   `0 spacing-4xl spacing-4xl`
 */
const ContentLayout: FC<ContentLayoutProps> = ({
  children,
  backText,
  onBackClick,
}) => {
  return (
    <div className="flex h-full flex-col bg-[var(--color-bg-neutral-grey-200)]">
      {/* Back row */}
      <div className="shrink-0 px-8 py-6">
        <button
          type="button"
          onClick={onBackClick}
          aria-label="Go Back"
          className="inline-flex items-center gap-4 bg-transparent p-0 no-underline"
        >
          <span
            className="inline-flex h-8 items-center justify-center rounded-md border border-[var(--color-border-tertiary)] bg-[var(--color-bg-neutral-grey-100)] px-3 transition-[border-color,background-color] duration-150 ease-out hover:border-[var(--color-border-secondary)] hover:bg-[var(--color-bg-neutral-grey-200)]"
          >
            <ChevronLeft className="size-3 text-[var(--color-icon-secondary)]" />
          </span>
          <span className="text-[13px] leading-[1.6] tracking-[0.13px] text-[var(--color-text-secondary)]">
            {backText}
          </span>
        </button>
      </div>

      {/* White scrollable card */}
      <div className="mx-8 mb-8 flex min-h-0 flex-1 flex-col overflow-y-auto rounded-xl border border-[var(--color-border-tertiary)] bg-[var(--color-bg-neutral-grey-100)]">
        {children}
      </div>
    </div>
  );
};

export { ContentLayout };
