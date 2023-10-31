import { useEffect, useRef } from 'react';

export function useOutsideClick(handler, listenCapturing = true) {
  //   ref the element we want to click outside of (<StyledModal>)
  const ref = useRef();

  useEffect(() => {
    function handleClick(e) {
      if (
        ref.current && // current is where the dom node that references <StyleModal> is stored
        !ref.current.contains(e.target) // = if window does not contain the element we clicked on (e.target)
      ) {
        // console.log('click outside');
        handler();
      }
    }

    // document.addEventListener('click', handleClick);
    // problem: 'add new cabin' button now doesnt work: modal 'opens' but click outside immediately detected therefore modal closes again
    // fix: pass in 3rd argument to prevent listening event on bubbling phase, but on the capturing phase:
    document.addEventListener('click', handleClick, listenCapturing); // true = capturing phase

    // clean up
    return () => document.removeEventListener('click', handleClick);
  }, [handler, listenCapturing]);

  return ref;
}
