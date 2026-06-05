import { Loader2, X } from 'lucide-react';
import type { FC, ReactNode } from 'react';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetTitle } from '@/components/ui/sheet';

interface AppDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  cancelLabel?: string;
  submitLabel?: string;
  isPending?: boolean;
  onSubmit?: () => void;
  onCancel?: () => void;
}

const AppDrawer: FC<AppDrawerProps> = ({
  open,
  onOpenChange,
  title,
  children,
  footer,
  cancelLabel = 'Cancel',
  submitLabel,
  isPending = false,
  onSubmit,
  onCancel,
}) => {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" showCloseButton={false} className="w-[440px] gap-0 border-l-0 p-0 sm:max-w-[440px]">
        <SheetTitle className="sr-only">{title}</SheetTitle>
        <SheetDescription className="sr-only">{title}</SheetDescription>
        <div className="flex h-full flex-col gap-8 p-10 shadow-[0px_12px_16px_-4px_rgba(16,24,40,0.08),0px_4px_6px_-2px_rgba(16,24,40,0.03)]">
          {/* Header */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase leading-6 tracking-[0.33px] text-foreground">{title}</span>
            </div>
            <div className="h-px w-full bg-[#eaedf1]" />
          </div>

          {/* Content */}
          <div className="flex min-h-0 flex-1 flex-col gap-8 overflow-y-auto p-1">{children}</div>

          {/* Footer */}
          {footer ??
            (submitLabel && (
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 rounded-md border-[#eaedf1] text-sm text-[#515b69]"
                  onClick={onCancel ?? (() => onOpenChange(false))}
                >
                  {cancelLabel}
                </Button>
                <Button
                  type={onSubmit ? 'button' : 'submit'}
                  className="flex-1 rounded-md bg-black text-sm text-white hover:bg-black/90"
                  disabled={isPending}
                  onClick={onSubmit}
                >
                  {isPending && <Loader2 className="mr-1.5 size-3.5 animate-spin" />}
                  {submitLabel}
                </Button>
              </div>
            ))}

          {/* Close button */}
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="absolute top-8 right-10 flex size-8 items-center justify-center rounded-lg bg-[#eef0f4] transition-colors hover:bg-[#e4e6ea]"
          >
            <X className="size-[18px] text-[#515b69]" />
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default AppDrawer;
