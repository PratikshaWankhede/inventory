const Button = ({ children, loading, ...rest }) => (
  <button
    {...rest}
    className="w-full bg-blue-600 text-white p-2 rounded disabled:opacity-50"
    disabled={loading}
  >
    {loading ? "Please wait..." : children}
  </button>
);

export default Button;
