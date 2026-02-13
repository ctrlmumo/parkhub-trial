import './Input.css';

/**
 * Input Component
 * 
 * @param {object} props - Component props
 * @param {string} [props.label] - Input label text
 * @param {string} [props.type='text'] - Input type (text, email, password, etc.)
 * @param {string} [props.placeholder] - Placeholder text
 * @param {string|number} [props.value] - Input value
 * @param {Function} [props.onChange] - Change handler
 * @param {Function} [props.onBlur] - Blur handler
 * @param {string} [props.error] - Error message
 * @param {string} [props.hint] - Helper text
 * @param {boolean} [props.required=false] - Mark as required
 * @param {boolean} [props.disabled=false] - Disable input
 * @param {React.ReactNode} [props.icon] - Icon element
 * @param {string} [props.iconPosition='left'] - Icon position ('left' or 'right')
 * @param {string} [props.className=''] - Additional CSS classes
 * @param {string} [props.id] - Input ID
 * @param {string} [props.name] - Input name
 */
const Input = ({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  hint,
  required = false,
  disabled = false,
  icon,
  iconPosition = 'left',
  className = '',
  id,
  name,
  ...rest // Spread remaining props
}) => {
  
  /* Generate unique ID if not provided
   * Used to link label with input for accessibility
   */
  const inputId = id || `input-${name || Math.random().toString(36).substr(2, 9)}`;
  
  /* Build input wrapper classes based on state */
  const wrapperClasses = [
    'input-wrapper',
    error ? 'input-wrapper-error' : '',
    disabled ? 'input-wrapper-disabled' : '',
    icon ? `input-wrapper-with-icon-${iconPosition}` : ''
  ]
    .filter(Boolean)
    .join(' ');
  
  /* Build input classes */
  const inputClasses = [
    'input',
    error ? 'input-error' : '',
    className
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className="input-group">
      {/* Label */}
      {label && (
        <label htmlFor={inputId} className="input-label">
          {label}
          {required && <span className="input-required" aria-label="required">*</span>}
        </label>
      )}

      {/* Input Wrapper (contains input and icon) */}
      <div className={wrapperClasses}>
        {/* Left Icon */}
        {icon && iconPosition === 'left' && (
          <span className="input-icon input-icon-left" aria-hidden="true">
            {icon}
          </span>
        )}

        {/* Input Element */}
        <input
          id={inputId}
          name={name}
          type={type}
          className={inputClasses}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          required={required}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={
            error ? `${inputId}-error` : 
            hint ? `${inputId}-hint` : 
            undefined
          }
          {...rest}
        />

        {/* Right Icon */}
        {icon && iconPosition === 'right' && (
          <span className="input-icon input-icon-right" aria-hidden="true">
            {icon}
          </span>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <p id={`${inputId}-error`} className="input-error-message" role="alert">
          {error}
        </p>
      )}

      {/* Hint/Helper Text */}
      {hint && !error && (
        <p id={`${inputId}-hint`} className="input-hint">
          {hint}
        </p>
      )}
    </div>
  );
};

export default Input;