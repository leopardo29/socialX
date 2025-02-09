// components/ui/Modal.tsx
"use client";
import React from "react";

interface ModalProps {
  children: React.ReactNode;
  onClose: () => void;
}

const Modal = ({ children, onClose }: ModalProps) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-lg p-4 relative"
        onClick={(e) => e.stopPropagation()} // Evita cerrar el modal al hacer clic dentro
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 dark:text-gray-300"
        >
          X
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
