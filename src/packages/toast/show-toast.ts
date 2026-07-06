import { toast } from 'sonner';

export const ToastType = {
  Success: 'success',
  Error: 'error',
  Info: 'info',
  Warning: 'warning',
} as const;

export type ToastTypeValue = (typeof ToastType)[keyof typeof ToastType];

export interface ShowToastOptions {
  readonly type: ToastTypeValue;
  /** Already-translated message text (translation happens in the hook layer). */
  readonly message: string;
  /** Stable id to deduplicate repeated toasts. */
  readonly id?: string;
}

/** The only toast entry point. Vendor API never leaks past this facade. */
export function showToast(options: ShowToastOptions): void {
  const toastOptions = options.id === undefined ? {} : { id: options.id };

  switch (options.type) {
    case ToastType.Success: {
      toast.success(options.message, toastOptions);

      break;
    }
    case ToastType.Error: {
      toast.error(options.message, toastOptions);

      break;
    }
    case ToastType.Warning: {
      toast.warning(options.message, toastOptions);

      break;
    }
    case ToastType.Info: {
      toast.info(options.message, toastOptions);

      break;
    }
  }
}
