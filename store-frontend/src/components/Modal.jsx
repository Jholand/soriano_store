import { motion, AnimatePresence } from "framer-motion";
import { FaTimes } from "react-icons/fa";

export default function Modal({ isOpen, onClose, title, children, size = "md" }) {
  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-2xl",
    lg: "max-w-4xl",
    xl: "max-w-6xl",
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className={`${sizeClasses[size]} w-full bg-gradient-to-b from-gray-900 via-black to-gray-900 border border-yellow-400/30 rounded-2xl shadow-[0_0_30px_#FFD70030] backdrop-blur-xl`}>
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-yellow-400/20">
                <h3 className="text-2xl font-bold text-yellow-400 drop-shadow-[0_0_8px_#FFD70060]">
                  {title}
                </h3>
                <button
                  onClick={onClose}
                  className="text-yellow-400 hover:text-yellow-300 hover:bg-yellow-400/10 p-2 rounded-lg transition-all"
                >
                  <FaTimes size={20} />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 max-h-[calc(100vh-200px)] overflow-y-auto custom-scrollbar">
                {children}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}