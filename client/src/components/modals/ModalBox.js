import { useEffect } from "react";

export default function ModalBox({ children, modalDispatch }) {
    function handleExitModalClick(e) {
        if (e.target.className === 'modal-box') modalDispatch({ type: 'modalClose' });
    }
    useEffect(function () {
        function handleExitModalKey(e) {
            if (e.key === "Escape") modalDispatch({ type: 'modalClose' });

        }
        document.addEventListener('keydown', handleExitModalKey);

        return () => {
            document.removeEventListener('keydown', handleExitModalKey);
        }
    })

    return (
        <div className="modal-box" onClick={handleExitModalClick}>
            {children}

        </div>

    )
}