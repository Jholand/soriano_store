import { useState, useEffect } from 'react';
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaTimes } from 'react-icons/fa';

let toastId = 0;

const toastTypes = {
  success: {
    icon: FaCheckCircle,
    bgColor: 'bg-green-500/20',
    borderColor: 'border-green-400/40',
    textColor: 'text-green-400',
  },
  error: {
    icon: FaExclamationCircle,
    bgColor: 'bg-red-500/20',
    borderColor: 'border-red-400/40',
    textColor: 'text-red-400',
  },
  info: {
    icon: FaInfoCircle,
    bgColor: 'bg-yellow-500/20',
    borderColor: 'border-yellow-400/40',
    textColor: 'text-yellow-400',
  },
};

export const toast = {
  success: (message) => {
    const event = new CustomEvent('toast', { detail: { type: 'success', message } });
    window.dispatchEvent(event);
  },
  error: (message) => {
    const event = new CustomEvent('toast', { detail: { type: 'error', message } });
    window.dispatchEvent(event);
  },
  info: (message) => {
    const event = new CustomEvent('toast', { detail: { type: 'info', message } });
    window.dispatchEvent(event);
  },
};

export default function Toast() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const handleToast = (e) => {
      const { type, message } = e.detail;
      const id = ++toastId;
      
      setToasts((prev) => [...prev, { id, type, message }]);

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4000);
    };

    window.addEventListener('toast', handleToast);
    return () => window.removeEventListener('toast', handleToast);
  }, []);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="fixed top-4 right-4 z-[100] space-y-2">
      {toasts.map((toast) => {
        const config = toastTypes[toast.type];
        const Icon = config.icon;

        return (
          <div
            key={toast.id}
            className={`
              ${config.bgColor} ${config.borderColor} ${config.textColor}
              border rounded-xl px-4 py-3 shadow-[0_0_20px_#00000040]
              backdrop-blur-md min-w-[300px] max-w-md
              animate-slideIn flex items-center gap-3
            `}
          >
            <Icon className="text-xl flex-shrink-0" />
            <p className="flex-1 text-sm font-medium">{toast.message}</p>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-lg hover:opacity-70 transition-opacity flex-shrink-0"
            >
              <FaTimes />
            </button>
          </div>
        );
      })}
    </div>
  );
}