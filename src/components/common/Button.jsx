/**
 * ParkHub - Button Component
 * 
 * A reusable button component with multiple variants and sizes.
 * Handles loading states, disabled states, and icons.
 * 
 * Usage:
 * <Button variant="primary" size="md" onClick={handleClick}>
 *   Click Me
 * </Button>
 */

import './Button.css';

/**
 * Button Component
 * 
 * @param {object} props - Component props
 * @param {React.ReactNode} props.children - Button content (text, icons, etc.)
 * @param {string} [props.variant='primary'] - Button style variant
 *   Options: 'primary', 'secondary', 'outline', 'ghost', 'danger'
 * @param {string} [props.size='md'] - Button size
 *   Options: 'sm', 'md', 'lg'
 * @param {boolean} [props.loading=false] - Show loading spinner
 * @param {boolean} [props.disabled=false] - Disable button
 * @param {boolean} [props.fullWidth=false] - Make button full width
 * @param {React.ReactNode} [props.icon] - Icon element to display before text
 * @param {Function} [props.onClick] - Click handler
 * @param {string} [props.type='button'] - Button type (button, submit, reset)
 * @param {string} [props.className=''] - Additional CSS classes
 */
const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  icon,
  onClick,
  type = 'button',
  className = '',
  ...rest // Spread remaining props (e.g., id, data-*, aria-*)
}) => {
  
  /**
   * Build CSS classes based on props
   * Combines base class with variant, size, and state classes
   */
  const buttonClasses = [
    'btn', // Base class
    `btn-${variant}`, // Variant class (btn-primary, btn-secondary, etc.)
    `btn-${size}`, // Size class (btn-sm, btn-md, btn-lg)
    fullWidth ? 'btn-full-width' : '', // Full width modifier
    loading ? 'btn-loading' : '', // Loading state
    className // Custom classes from parent
  ]
    .filter(Boolean) // Remove empty strings
    .join(' '); // Join with spaces

  /**
   * Handle button click
   * Prevents click when loading or disabled
   */
  const handleClick = (e) => {
    if (loading || disabled) {
      e.preventDefault();
      return;
    }
    
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={handleClick}
      disabled={disabled || loading}
      {...rest}
    >
      {/* Loading Spinner */}
      {loading && (
        <span className="btn-spinner" aria-hidden="true">
          <svg
            className="spinner"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              className="spinner-track"
              cx="12"
              cy="12"
              r="10"
              strokeWidth="3"
            />
            <circle
              className="spinner-indicator"
              cx="12"
              cy="12"
              r="10"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
        </span>
      )}

      {/* Icon (if provided and not loading) */}
      {!loading && icon && (
        <span className="btn-icon" aria-hidden="true">
          {icon}
        </span>
      )}

      {/* Button Content */}
      <span className="btn-content">
        {children}
      </span>
    </button>
  );
};

export default Button;