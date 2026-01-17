import './EmptyState.css';

interface EmptyStateProps {
  /**
   * Icon to display (emoji or SVG)
   */
  icon?: string;
  /**
   * Primary message
   */
  message: string;
  /**
   * Secondary description (optional)
   */
  description?: string;
  /**
   * Call-to-action button label (optional)
   */
  actionLabel?: string;
  /**
   * Call-to-action button handler (optional)
   */
  onAction?: () => void;
}

/**
 * EmptyState component for displaying helpful messages when no data exists
 */
export function EmptyState({
  icon = '📭',
  message,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="empty-state">
      <div className="empty-state__icon" role="img" aria-label="Empty state icon">
        {icon}
      </div>
      <h3 className="empty-state__message">{message}</h3>
      {description && (
        <p className="empty-state__description">{description}</p>
      )}
      {actionLabel && onAction && (
        <button
          className="empty-state__action"
          onClick={onAction}
          type="button"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
