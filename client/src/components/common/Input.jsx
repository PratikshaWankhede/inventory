const Input = ({ type = "text", placeholder, onChange }) => (
  <input
    type={type}
    placeholder={placeholder}
    onChange={onChange}
    className="w-full mb-3 p-2 border rounded"
  />
);

export default Input;
