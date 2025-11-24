// Modal.tsx
import React, { useEffect, useState } from "react";

// Types
interface ModalProps {
  id?: string;
  children: any;
  isOpen?: boolean;
  onClose?: () => void;
  closeOnBackdrop?: boolean;
  closeOnEscape?: boolean;
  className?: string;
}

// Utility functions
type ModalCallbacks = {
  [key: string]: (isOpen: boolean) => void;
};

const modalCallbacks: ModalCallbacks = {};

export const openModal = (modalId: string): void => {
  if (modalCallbacks[modalId]) {
    modalCallbacks[modalId](true);
  } else {
    console.warn(`Modal with id "${modalId}" not found.`);
  }
};

export const closeModal = (modalId: string): void => {
  if (modalCallbacks[modalId]) {
    modalCallbacks[modalId](false);
  } else {
    console.warn(`Modal with id "${modalId}" not found.`);
  }
};

const Modal: React.FC<ModalProps> = ({
  id,
  children,
  isOpen: externalIsOpen,
  onClose,
  closeOnBackdrop = true,
  closeOnEscape = true,
  className = "",
}) => {
  const [internalIsOpen, setInternalIsOpen] = useState<boolean>(false);

  const isControlled = externalIsOpen !== undefined;
  const isOpen = isControlled ? externalIsOpen : internalIsOpen;

  // Register modal with utilities
  useEffect(() => {
    if (id) {
      modalCallbacks[id] = setInternalIsOpen;
      return () => {
        delete modalCallbacks[id];
      };
    }
  }, [id]);

  const handleClose = (): void => {
    if (!isControlled) {
      setInternalIsOpen(false);
    }
    onClose?.();
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>): void => {
    if (closeOnBackdrop && e.target === e.currentTarget) {
      handleClose();
    }
  };

  // Handle ESC key and body scroll
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent): void => {
      if (e.key === "Escape" && closeOnEscape && isOpen) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, closeOnEscape]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[rgba(0,0,0,0.5)]"
      onClick={handleBackdropClick}
    >
      <div
        className={`
          bg-white rounded-lg shadow-xl
          max-w-md w-full max-h-[90vh] overflow-y-auto
          transform transition-all
          relative
          ${className}
        `}
      >
        {children}

        {/* Close button */}
        <button
          className="
            absolute top-3 right-3
            w-8 h-8 rounded-full
            flex items-center justify-center
            hover:bg-gray-100 transition-colors
            text-gray-500 hover:text-gray-700
            z-10
          "
          onClick={handleClose}
          aria-label="Close modal"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Modal;
