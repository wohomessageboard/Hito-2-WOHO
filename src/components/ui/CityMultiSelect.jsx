import React from 'react';
import { Button, Checkbox, CheckboxGroup, Popover, PopoverContent, PopoverTrigger } from '@heroui/react';
import { MapPin, Close } from './icons';

/**
 * Filtro de ciudades de selección múltiple: un botón abre una lista con casillas y lo elegido
 * queda a la vista como chips con ✕ para quitarlos uno a uno. Sin nada elegido = todas las ciudades.
 *
 * @param {{ city: string, count: number }[]} options  ciudades disponibles (con su cantidad de avisos)
 * @param {string[]} value                             ciudades elegidas
 * @param {(next: string[]) => void} onChange
 */
const CityMultiSelect = ({ options, value, onChange }) => {
  const remove = (city) => onChange(value.filter((c) => c !== city));

  return (
    <div className="flex flex-col gap-3">
      <Popover placement="bottom-start" offset={6}>
        <PopoverTrigger>
          <Button
            variant="bordered"
            radius="sm"
            className="ws-input-border h-11 w-full sm:w-64 justify-between font-bold text-ws-ink"
            aria-label={value.length ? `Ciudades: ${value.length} ${value.length === 1 ? 'elegida' : 'elegidas'}` : 'Elegir ciudades'}
            endContent={<span aria-hidden="true" className="text-xs">▾</span>}
          >
            <span className="flex items-center gap-2">
              <MapPin className="w-4 h-4" aria-hidden="true" />
              {value.length ? `Ciudades (${value.length})` : 'Todas las ciudades'}
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-3 w-72 max-w-[calc(100vw-2rem)] items-stretch gap-2 bg-ws-paper-light">
          <CheckboxGroup
            aria-label="Filtrar por ciudad"
            value={value}
            onValueChange={onChange}
            classNames={{ wrapper: 'max-h-64 overflow-y-auto flex-nowrap gap-0 pr-1' }}
          >
            {options.map(({ city, count }) => (
              <Checkbox
                key={city}
                value={city}
                radius="sm"
                classNames={{
                  base: 'max-w-full w-full m-0 min-h-11 px-1 rounded-[6px] hover:bg-ws-paper-deep',
                  label: 'w-full flex items-center gap-2 font-cuerpo text-ws-ink',
                  wrapper: 'before:border-ws-ink after:bg-ws-ink',
                  icon: 'text-ws-paper-light',
                }}
              >
                <span className="flex-1 text-left">{city}</span>
                <span className="ws-mono text-ws-ink/60">{count}</span>
              </Checkbox>
            ))}
          </CheckboxGroup>
          <div className="flex items-center justify-between border-t border-ws-line pt-2">
            <span className="ws-mono text-ws-ink/70">{value.length ? `${value.length} ${value.length === 1 ? 'elegida' : 'elegidas'}` : 'Sin filtro'}</span>
            <Button size="sm" variant="light" radius="sm" className="font-bold min-h-11" isDisabled={!value.length} onPress={() => onChange([])}>
              Limpiar
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      {value.length > 0 && (
        <ul aria-label="Ciudades elegidas" className="list-none p-0 m-0 flex flex-wrap items-center gap-2">
          {value.map((city) => (
            <li key={city}>
              <span className="ws-chip-selected inline-flex items-center gap-1 h-9 max-md:h-11 pl-3 pr-1 text-xs font-bold">
                {city}
                <button
                  type="button"
                  onClick={() => remove(city)}
                  aria-label={`Quitar ${city}`}
                  className="grid place-items-center w-7 h-7 max-md:w-9 max-md:h-9 rounded-[4px] hover:bg-ws-paper-light/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ws-paper-light"
                >
                  <Close className="w-4 h-4" aria-hidden="true" />
                </button>
              </span>
            </li>
          ))}
          <li>
            <Button size="sm" variant="light" radius="sm" className="font-bold min-h-9 max-md:min-h-11 underline underline-offset-4" onPress={() => onChange([])}>
              Quitar todas
            </Button>
          </li>
        </ul>
      )}
    </div>
  );
};

export default CityMultiSelect;
