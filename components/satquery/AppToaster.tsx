'use client';

import { Toaster } from 'sonner';

export function AppToaster() {
  return (
    <Toaster
      position="bottom-right"
      toastOptions={{
        classNames: {
          toast:
            'border border-sq-outline-variant/50 bg-white text-sq-on-surface shadow-lg',
          description: 'text-sq-on-surface-variant',
        },
      }}
    />
  );
}
