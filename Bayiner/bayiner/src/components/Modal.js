import ReactDOM from "react-dom";
import { useEffect } from "react";

function Modal({ onClose, children, style }) {
  useEffect(() => {
    document.body.classList.add("overflow-hidden");

    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, []);

  return ReactDOM.createPortal(
    <div>
      <div className="fixed inset-0 bg-gray-300 opacity-80 "></div>
      <div className={`fixed ${style} overflow-auto w-fit`}>
        <div className="flex flex-col justify-center items-center">
          {children}
        </div>
      </div>
    </div>,
    document.querySelector(".modal-container")
  );
}

export default Modal;
