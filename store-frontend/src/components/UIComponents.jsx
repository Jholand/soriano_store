export const Button = ({ 
  children, 
  onClick, 
  type = "button", 
  variant = "primary", 
  size = "md",
  icon,
  className = "",
  disabled = false 
}) => {
  const variants = {
    primary: "bg-yellow-500/20 hover:bg-yellow-500/30 border-yellow-400/40 text-yellow-200 hover:text-yellow-100",
    danger: "bg-red-500/20 hover:bg-red-500/30 border-red-400/40 text-red-300 hover:text-red-100",
    success: "bg-green-500/20 hover:bg-green-500/30 border-green-400/40 text-green-300 hover:text-green-100",
    secondary: "bg-gray-500/20 hover:bg-gray-500/30 border-gray-400/40 text-gray-300 hover:text-gray-100",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        flex items-center justify-center gap-2
        ${variants[variant]}
        ${sizes[size]}
        border rounded-lg
        transition-all duration-200
        font-medium
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
    >
      {icon && <span>{icon}</span>}
      {children}
    </button>
  );
};

export const Input = ({ 
  label, 
  type = "text", 
  value, 
  onChange, 
  placeholder, 
  required = false,
  error,
  className = ""
}) => {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-yellow-300 text-sm font-medium">
          {label} {required && <span className="text-red-400">*</span>}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`
          bg-transparent border border-yellow-500/30 
          text-yellow-200 px-4 py-2 rounded-lg 
          focus:outline-none focus:border-yellow-400/60 
          placeholder-yellow-500/50
          transition-all duration-200
          ${error ? 'border-red-400/60' : ''}
          ${className}
        `}
      />
      {error && <span className="text-red-400 text-xs">{error}</span>}
    </div>
  );
};

export const Select = ({ 
  label, 
  value, 
  onChange, 
  options, 
  required = false,
  error,
  className = ""
}) => {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-yellow-300 text-sm font-medium">
          {label} {required && <span className="text-red-400">*</span>}
        </label>
      )}
      <select
        value={value}
        onChange={onChange}
        required={required}
        className={`
          bg-black/50 border border-yellow-500/30 
          text-yellow-200 px-4 py-2 rounded-lg 
          focus:outline-none focus:border-yellow-400/60
          transition-all duration-200
          ${error ? 'border-red-400/60' : ''}
          ${className}
        `}
      >
        {options.map((opt, idx) => (
          <option key={idx} value={opt.value} className="bg-black text-yellow-200">
            {opt.label}
          </option>
        ))}
      </select>
      {error && <span className="text-red-400 text-xs">{error}</span>}
    </div>
  );
};

export const Table = ({ headers, children, className = "" }) => {
  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="w-full border-collapse border border-yellow-400/20 rounded-xl overflow-hidden">
        <thead className="bg-yellow-400/10 border-b border-yellow-400/30 text-yellow-300">
          <tr>
            {headers.map((header, idx) => (
              <th key={idx} className={`py-3 px-4 ${header.align || 'text-left'} ${header.className || ''}`}>
                {header.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {children}
        </tbody>
      </table>
    </div>
  );
};