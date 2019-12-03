export class TypewriterUtils {

  public static typewrite(element: HTMLElement, text: string): Promise<void> {
    return new Promise((resolve, reject) => {

      if (element && text) {

        const speed = 50;
        let letterIndex = 0;

        const intervalId = setInterval(() => {

          if (text[letterIndex] === '\n' ) {
            element.innerHTML = element.innerHTML += '<br/>';
          }

          element.innerHTML = element.innerHTML += text[letterIndex];
          letterIndex++;
          if (letterIndex === text.length) {
            clearInterval(intervalId);
            resolve();
          }
        }, speed);
      } else {
        reject();
      }
    });
  }
}
