import React from 'react';
import { Card } from '@heroui/react';

/**
 * The standard Driftler "white surface": a bordered, lightly-shadowed panel
 * used for cards, form panels and content sections across the app.
 * Centralizes the ws-surface token so a visual-system change (border
 * weight, shadow, radius) happens in src/styles/index.css, not in every
 * view that renders a card.
 *
 * @param {boolean} hoverable - lift the shadow on hover/press (lists of
 *   clickable cards: destinations, saved places). Omit for static panels.
 * @param {boolean} elevated - use the more prominent shadow-md surface
 *   (auth cards, forms, modals) instead of the resting shadow-sm one.
 */
const SurfaceCard = ({ hoverable = false, elevated = false, className = '', children, ...props }) => {
  const classes = [elevated ? 'ws-surface-elevated' : 'ws-surface', hoverable && 'ws-surface-hover', className]
    .filter(Boolean)
    .join(' ');

  return (
    <Card className={classes} {...props}>
      {children}
    </Card>
  );
};

export default SurfaceCard;
