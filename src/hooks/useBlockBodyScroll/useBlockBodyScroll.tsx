import "./style.css";
import React from "react";

let previousOverflow;
let previousTouchAction;
let previousOverflowScrolling;
let previousOverscrollBehavior;
let activeLock = 0;

export const useBlockBodyScroll = (isActive: boolean) => {
  React.useEffect(() => {
    if (isActive) {
      if (activeLock === 0) {
        previousOverflow = document.body.style.overflow;
        previousTouchAction = document.body.style.touchAction;
        previousOverflowScrolling =
          document.body.style["-webkit-overflow-scrolling"];
        previousOverscrollBehavior = document.body.style.overscrollBehavior;

        document.body.style.overflow = "hidden";
        document.body.style.touchAction = "none";
        document.body.style["-webkit-overflow-scrolling"] = "none";
        document.body.style.overscrollBehavior = "none";
      }
      activeLock++;

      return () => {
        activeLock--;
        if (activeLock === 0) {
          document.body.style.overflow = previousOverflow;
          document.body.style.touchAction = previousTouchAction;
          document.body.style["-webkit-overflow-scrolling"] =
            previousOverflowScrolling;
          document.body.style.overscrollBehavior = previousOverscrollBehavior;
        }
      };
    }
  }, [isActive]);
};

export default useBlockBodyScroll;
