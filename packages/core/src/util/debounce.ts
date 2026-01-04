// biome-ignore lint/suspicious/noExplicitAny: Generic callback signature for debounce.
type Procedure = (...args: any[]) => void;

export function debounce<F extends Procedure>(func: F, wait: number): F {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  const invoke = function (this: ThisParameterType<F>, ...args: Parameters<F>) {
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, wait);
  };

  return invoke as F;
}
