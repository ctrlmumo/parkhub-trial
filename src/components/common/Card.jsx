/**
 * ParkHub - Card Component
 * 
 * A reusable card container with optional header and footer.
 * Provides consistent spacing and styling for content sections.
 * 
 * Usage:
 * <Card>
 *   <Card.Header>
 *     <Card.Title>Card Title</Card.Title>
 *     <Card.Description>Optional description</Card.Description>
 *   </Card.Header>
 *   <Card.Content>
 *     Main content goes here
 *   </Card.Content>
 *   <Card.Footer>
 *     Footer content
 *   </Card.Footer>
 * </Card>
 */

import './Card.css';

/**
 * Main Card Component
 * 
 * @param {object} props - Component props
 * @param {React.ReactNode} props.children - Card content
 * @param {string} [props.variant='default'] - Card style variant
 *   Options: 'default', 'glass', 'gradient'
 * @param {boolean} [props.hoverable=false] - Add hover effect
 * @param {Function} [props.onClick] - Click handler (makes card clickable)
 * @param {string} [props.className=''] - Additional CSS classes
 */
const Card = ({
  children,
  variant = 'default',
  hoverable = false,
  onClick,
  className = '',
  ...rest
}) => {
  
  /**
   * Build card classes based on props
   */
  const cardClasses = [
    'card',
    `card-${variant}`,
    hoverable || onClick ? 'card-hoverable' : '',
    onClick ? 'card-clickable' : '',
    className
  ]
    .filter(Boolean)
    .join(' ');
  
  /**
   * Determine if card should be a button (for accessibility)
   * If onClick is provided, use button element
   */
  const Component = onClick ? 'button' : 'div';
  const extraProps = onClick ? { type: 'button', onClick } : {};

  return (
    <Component className={cardClasses} {...extraProps} {...rest}>
      {children}
    </Component>
  );
};

/**
 * Card Header Component
 * 
 * Container for card title and description
 * 
 * @param {object} props - Component props
 * @param {React.ReactNode} props.children - Header content
 * @param {string} [props.className=''] - Additional CSS classes
 */
Card.Header = ({ children, className = '', ...rest }) => {
  return (
    <div className={`card-header ${className}`} {...rest}>
      {children}
    </div>
  );
};

/**
 * Card Title Component
 * 
 * Main heading for the card
 * 
 * @param {object} props - Component props
 * @param {React.ReactNode} props.children - Title text
 * @param {string} [props.as='h3'] - HTML heading level
 * @param {string} [props.className=''] - Additional CSS classes
 */
Card.Title = ({ children, as: Component = 'h3', className = '', ...rest }) => {
  return (
    <Component className={`card-title ${className}`} {...rest}>
      {children}
    </Component>
  );
};

/**
 * Card Description Component
 * 
 * Subtitle or description text for the card
 * 
 * @param {object} props - Component props
 * @param {React.ReactNode} props.children - Description text
 * @param {string} [props.className=''] - Additional CSS classes
 */
Card.Description = ({ children, className = '', ...rest }) => {
  return (
    <p className={`card-description ${className}`} {...rest}>
      {children}
    </p>
  );
};

/**
 * Card Content Component
 * 
 * Main content area of the card
 * 
 * @param {object} props - Component props
 * @param {React.ReactNode} props.children - Content
 * @param {string} [props.className=''] - Additional CSS classes
 */
Card.Content = ({ children, className = '', ...rest }) => {
  return (
    <div className={`card-content ${className}`} {...rest}>
      {children}
    </div>
  );
};

/**
 * Card Footer Component
 * 
 * Footer area for actions or additional info
 * 
 * @param {object} props - Component props
 * @param {React.ReactNode} props.children - Footer content
 * @param {string} [props.className=''] - Additional CSS classes
 */
Card.Footer = ({ children, className = '', ...rest }) => {
  return (
    <div className={`card-footer ${className}`} {...rest}>
      {children}
    </div>
  );
};

export default Card;