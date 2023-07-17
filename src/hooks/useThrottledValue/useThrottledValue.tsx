import throttle from 'lodash/throttle';
import React from 'react';

export function useThrottledValue<T>(value: T, duration = 500): T {
  const [throttledValue, setThrottledValue] = React.useState(value);

  const throttledFn = React.useRef(throttle(setThrottledValue, duration));

  React.useEffect(() => {
    throttledFn.current(value);
  }, [value]);

  React.useEffect(() => {
    const cancel = () => {
      throttledFn.current?.cancel();
    };
    return cancel;
  }, []);

  return throttledValue;
}
