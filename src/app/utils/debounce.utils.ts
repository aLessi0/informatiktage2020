export class DebounceUtils {
  private constructor() {
    // is a utils. Never call the constructor!
  }

  public static debounce(func, wait, immediate): () => void {
    let timeout;
    return function () {
      const context = this;
      const args = arguments;
      const later = () => {
        timeout = null;
        if (!immediate) {
          func.apply(context, args);
        }
      };
      const callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) {
        func.apply(context, args);
      }
    };
  }
}
