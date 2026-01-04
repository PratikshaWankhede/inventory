const Button = ({ children, loading, className = "", ...rest }) => (
  <button
    {...rest}
    className={`${className} w-full p-2 rounded disabled:opacity-50`}
    disabled={loading}
  >
    {loading ? "Please wait..." : children}
  </button>
);

export default Button;
