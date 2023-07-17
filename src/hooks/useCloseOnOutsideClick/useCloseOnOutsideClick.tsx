import React, { MutableRefObject } from "react";

const useCloseOnOutsideClick = (
  outsideRef: MutableRefObject<HTMLElement>,
  onClose: () => void
) => {
  const onRequestCloseRef = React.useRef(onClose);

  React.useEffect(() => {
    if (onRequestCloseRef.current) {
      let unmounted = false;
      const clickHandler: EventListenerOrEventListenerObject = (e) => {
        if (unmounted) return;

        if (e.target === outsideRef.current) {
          onRequestCloseRef.current();
        }
      };

      const keydownHandler: EventListener = (e) => {
        if (unmounted) return;
        if ((e as KeyboardEvent).key === "Escape") {
          onRequestCloseRef.current();
        }
      };

      const timeout = setTimeout(() => {
        document.body.addEventListener("click", clickHandler);
        window.addEventListener("keydown", keydownHandler);
      }, 100);

      return () => {
        unmounted = true;
        document.body.removeEventListener("click", clickHandler);
        window.removeEventListener("keydown", keydownHandler);
        clearTimeout(timeout);
      };
    }
  }, [outsideRef]);
};

export default useCloseOnOutsideClick;
