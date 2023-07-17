export const withVibrate = <T, V>(
  callback: (...args: T[]) => V,
  duration = 10
) => {
  return (...inputArgs: T[]): V => {
    try {
      if ('vibrate' in navigator) {
        navigator.vibrate(duration);
      }
    } catch (e) {
      console.warn(e);
    }
    return callback(...inputArgs);
  };
};
