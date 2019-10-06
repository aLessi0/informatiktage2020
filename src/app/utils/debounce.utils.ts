export class DebounceUtils {
  private constructor() {
    // is a utils. Never call the constructor!
  }

  public static debounce(func, wait, immediate): Function {
    let timeout;
    return function () {
      let context = this, args = arguments;
      let later = function () {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      let callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  };
}
