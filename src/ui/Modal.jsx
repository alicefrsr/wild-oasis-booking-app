import {
  cloneElement,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import { HiXMark } from 'react-icons/hi2';
import styled from 'styled-components';
import { useOutsideClick } from '../hooks/useOutsideClick';

const StyledModal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: var(--color-grey-0);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-lg);
  padding: 3.2rem 4rem;
  transition: all 0.5s;
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: var(--backdrop-color);
  backdrop-filter: blur(4px);
  z-index: 1000;
  transition: all 0.5s;
`;

const Button = styled.button`
  background: none;
  border: none;
  padding: 0.4rem;
  border-radius: var(--border-radius-sm);
  transform: translateX(0.8rem);
  transition: all 0.2s;
  position: absolute;
  top: 1.2rem;
  right: 1.9rem;

  &:hover {
    background-color: var(--color-grey-100);
  }

  & svg {
    width: 2.4rem;
    height: 2.4rem;
    /* Sometimes we need both */
    /* fill: var(--color-grey-500);
    stroke: var(--color-grey-500); */
    color: var(--color-grey-500);
  }
`;
// create context
const ModalContext = createContext();

// create parent component which contains its own state
function Modal({ children }) {
  // state
  const [openName, setOpenName] = useState('');
  // handler fns
  const open = setOpenName;
  const close = () => setOpenName('');
  return (
    <ModalContext.Provider value={{ openName, open, close }}>
      {children}
    </ModalContext.Provider>
  );
}

// create children
function Open({ children, opens: opensWindowName }) {
  // use context to access handler fn
  const { open } = useContext(ModalContext);
  // return children // clone children instead to pass in different props
  return cloneElement(children, { onClick: () => open(opensWindowName) });
}

function Window({ children, name }) {
  const { openName, close } = useContext(ModalContext);

  // custom hook
  // ref the element we want to click outside of (<StyledModal>)
  // const ref = useRef();

  // useEffect(() => {
  //   function handleClick(e) {
  //     if (
  //       ref.current && // current is where the dom node that references <StyleModal> is stored
  //       !ref.current.contains(e.target) // = if window does not contain the element we clicked on (e.target)
  //     ) {
  //       console.log('click outside');
  //       close();
  //     }
  //   }

  //   // document.addEventListener('click', handleClick);
  //   // problem: 'add new cabin' button now doesnt work: modal 'opens' but click outside immediately detected therefore modal closes again
  //   // fix: pass in 3rd argument to prevent listening event on bubbling phase, but on the capturing phase:
  //   document.addEventListener('click', handleClick, true); // true = capturing phase

  //   // clean up
  //   return () => document.removeEventListener('click', handleClick);
  // }, [close]);
  const ref = useOutsideClick(close);

  if (name !== openName) return null;

  return createPortal(
    <Overlay>
      <StyledModal ref={ref}>
        <Button onClick={close}>
          <HiXMark />
        </Button>
        {/* clone children to pass in 'close' props for CreateCabinForm conditional 'type' rendering  */}
        <div>{cloneElement(children, { onCloseModal: close })}</div>
      </StyledModal>
    </Overlay>,
    document.body
  );
}

// set these children props on Modal
Modal.Open = Open;
Modal.Window = Window;

export default Modal;
