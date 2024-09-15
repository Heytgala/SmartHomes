import React from 'react';
import './cartmodal.css';

function Modal({ show, onClose, children }) {
    if (!show) return null;

    return (
        <div className="cart-modal-overlay">
            <div className="cart-modal-content">
                <button className="cart-close-button" onClick={onClose}>
                    &times;
                </button>
                {children}
            </div>
        </div>
    );
}

export default Modal;
