const Input = ({
  type = "text",
  placeholder,
  onChange,
  className = "",
  ...rest
}) => (
  <input
    type={type}
    placeholder={placeholder}
    onChange={onChange}
    {...rest}
    className={`
      w-full
      h-11                
      px-3
      pr-10              
      mb-3
      border
      rounded
      outline-none
      focus:ring-2 focus:ring-blue-500
      ${className}
    `}
  />
);

export default Input;
