import React from 'react';
import { Input } from '@heroui/react';
import FilterChip from './FilterChip';
import { Calendar } from './icons';
import { MAX_USER_DURATION_DAYS, MAX_ADMIN_DURATION_DAYS, DURATION_PRESETS } from '../../config/limits';

/**
 * Duración del aviso. Las personas usuarias eligen hasta 30 días; el equipo (admin) puede
 * llegar a 365 o dejarla vacía para un aviso sin caducidad.
 * @param {string} value   días como texto
 * @param {(e) => void} onChange recibe un evento con target.name y target.value
 * @param {boolean} isAdmin
 * @param {number} [currentDays] duración actual (al editar un aviso antiguo que ya superaba el máximo)
 */
const DurationField = ({ value, onChange, isAdmin = false, currentDays = 0, label = 'Días de duración del aviso' }) => {
  const max = isAdmin ? MAX_ADMIN_DURATION_DAYS : Math.max(MAX_USER_DURATION_DAYS, currentDays || 0);
  const set = (n) => onChange({ target: { name: 'duration_days', value: String(n) } });

  return (
    <div className="flex flex-col gap-3">
      <div role="group" aria-label="Duraciones habituales" className="flex flex-wrap gap-2">
        {DURATION_PRESETS.map((n) => (
          <FilterChip
            key={n}
            label={`${n} días`}
            size="sm"
            isSelected={String(value) === String(n)}
            onClick={() => set(n)}
            className={String(value) === String(n) ? '' : '!bg-ws-paper-deep'}
          />
        ))}
      </div>
      <Input
        name="duration_days"
        type="number"
        min={1}
        max={max}
        label={label}
        placeholder={isAdmin ? 'Vacío = sin caducidad' : 'Ej: 15'}
        labelPlacement="inside"
        variant="bordered"
        radius="sm"
        size="lg"
        isRequired={!isAdmin}
        value={value}
        onChange={onChange}
        classNames={{ inputWrapper: 'ws-input-border', label: 'font-bold text-ws-ink text-sm' }}
      />
      <p className="flex items-start gap-2 font-cuerpo text-sm text-ws-ink/85 leading-relaxed">
        <Calendar className="w-5 h-5 shrink-0 mt-0.5" aria-hidden="true" />
        {isAdmin
          ? 'Como administrador puedes publicar hasta 365 días o dejar el campo vacío para un aviso sin caducidad.'
          : `Los avisos duran como máximo ${MAX_USER_DURATION_DAYS} días y luego desaparecen. Así quienes buscan siempre ven información vigente.`}
      </p>
    </div>
  );
};

export default DurationField;
