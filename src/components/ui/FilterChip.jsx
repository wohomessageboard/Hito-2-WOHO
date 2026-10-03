import React from 'react';
import { Chip } from '@heroui/react';

// Selected-state fill + matching text/icon color. Add a key here if a
// filter group ever needs a third accent color.
const SELECTED_STYLES = {
  purple: { fill: 'ws-chip-selected', text: '', icon: 'text-ws-ink' },
  orange: { fill: 'ws-chip-selected', text: '', icon: 'text-ws-ink' },
};

/**
 * A single filter/category pill used in the Feed and CountryFeed filter
 * bars. Selection is communicated by a solid color fill, not a border —
 * keep it that way; it's the "minimal con color" rule for this control.
 *
 * @param {string} label - visible text
 * @param {React.ComponentType} [icon] - optional lucide-react icon
 * @param {boolean} isSelected
 * @param {() => void} onClick
 * @param {'purple'|'orange'} [selectedColor] - fill when selected
 * @param {'md'|'sm'} [size] - 'md' for the Feed bar, 'sm' for the denser
 *   CountryFeed bar
 */
const FilterChip = ({
  label,
  icon: Icon,
  isSelected,
  onClick,
  selectedColor = 'purple',
  size = 'md',
  className = '',
}) => {
  const isCompact = size === 'sm';
  const selected = SELECTED_STYLES[selectedColor] || SELECTED_STYLES.purple;

  return (
    <Chip
      variant="flat"
      radius="sm"
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-pressed={!!isSelected}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.(e);
        }
      }}
      className={[
        'cursor-pointer font-bold transition-colors',
        isCompact ? 'text-xs px-1 h-8' : 'font-cuerpo h-9',
        isSelected ? `${selected.fill} ${selected.text}` : 'ws-chip-idle',
        className,
      ].filter(Boolean).join(' ')}
      startContent={Icon ? (
        <Icon className={`${isCompact ? 'w-4 h-4' : 'w-5 h-5'} ml-1 ${isSelected ? selected.icon : 'text-ws-ink'}`} />
      ) : undefined}
    >
      <span className={isCompact ? '' : 'px-1 text-sm'}>{label}</span>
    </Chip>
  );
};

export default FilterChip;
