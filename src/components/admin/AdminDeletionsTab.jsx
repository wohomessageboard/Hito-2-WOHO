import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@heroui/react';
import api from '../../config/api';
import EmptyState from '../ui/EmptyState';

const day = (iso) => new Date(iso).toLocaleDateString('es', { day: 'numeric', month: 'long', year: 'numeric' });
const daysLeft = (iso) => Math.ceil((new Date(iso).getTime() - Date.now()) / 864e5);

const STATUS = {
  pending: 'Pendiente',
  completed: 'Eliminada',
  cancelled: 'Cancelada por la persona',
};

// Sección propia del panel: solicitudes de eliminación de cuenta. Cada una tiene un plazo
// (5 días); al ejecutarla se borra la cuenta, sus avisos y sus fotos, y la solicitud queda
// como constancia sin nombre ni correo.
const AdminDeletionsTab = ({ onPendingCountChange }) => {
  const [status, setStatus] = useState('pending');
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const res = await api.get('/admin/deletion-requests', { params: { status } });
      setItems(res.data.items);
      onPendingCountChange?.(res.data.pending_count);
    } catch (err) {
      setError(err.response?.data?.error || 'No pudimos cargar las solicitudes.');
    } finally {
      setIsLoading(false);
    }
  }, [status, onPendingCountChange]);

  useEffect(() => { load(); }, [load]);

  const execute = async (item) => {
    if (!window.confirm(`¿Eliminar definitivamente la cuenta de ${item.user_name || 'esta persona'} (${item.user_email || ''}), con sus avisos y fotos? No se puede deshacer.`)) return;
    try {
      await api.post(`/admin/deletion-requests/${item.id}/execute`);
      await load();
    } catch (err) {
      alert(err.response?.data?.error || 'No se pudo eliminar la cuenta.');
    }
  };

  return (
    <div className="space-y-6">
      <p className="font-cuerpo text-ws-ink/85 max-w-2xl">
        Personas que pidieron borrar su cuenta. Se comprometió un plazo de <strong>5 días</strong>: ejecuta cada solicitud antes de que venza.
      </p>

      <div role="group" aria-label="Estado" className="flex gap-2 flex-wrap">
        {[['pending', 'Pendientes'], ['completed', 'Eliminadas'], ['cancelled', 'Canceladas']].map(([key, label]) => (
          <button key={key} type="button" aria-pressed={status === key} onClick={() => setStatus(key)}
            className={`min-h-11 px-4 font-bold ${status === key ? 'ws-chip-selected' : 'ws-chip-idle'}`}>
            {label}
          </button>
        ))}
      </div>

      {error && <p role="alert" className="bg-ws-tomato/15 rounded-[6px] p-3 font-bold">{error}</p>}
      {isLoading && <p role="status" className="ws-mono">Cargando…</p>}

      {!isLoading && !error && items.length === 0 && (
        <EmptyState stamp="AL DÍA" title="Sin solicitudes">No hay solicitudes en este estado.</EmptyState>
      )}

      <ul className="grid gap-4 list-none p-0 m-0">
        {items.map((item) => {
          const left = daysLeft(item.due_at);
          const overdue = item.status === 'pending' && left < 0;
          const urgent = item.status === 'pending' && left <= 1;
          return (
            <li key={item.id} className="ws-surface p-5 flex flex-col md:flex-row md:items-center gap-4">
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`ws-tag ${item.status === 'pending' ? 'ws-tag-tomato' : 'ws-tag-ink'}`}>{STATUS[item.status]}</span>
                  {item.status === 'pending' && (
                    <span className={`ws-mono px-2 py-1 rounded-[4px] ${overdue ? 'bg-ws-tomato text-ws-paper-light' : urgent ? 'bg-ws-mustard' : 'bg-ws-paper-deep'}`}>
                      {overdue ? `Vencida hace ${Math.abs(left)} día(s)` : left === 0 ? 'Vence hoy' : `Quedan ${left} día(s)`}
                    </span>
                  )}
                </div>
                <p className="font-bold text-lg">{item.user_name || 'Cuenta eliminada'}</p>
                {item.user_email && <p className="ws-mono text-ws-ink/80" style={{ textTransform: 'none', letterSpacing: 0 }}>{item.user_email}</p>}
                <p className="ws-mono text-ws-ink/70">
                  Pedida el {day(item.requested_at)} · plazo {day(item.due_at)}{item.completed_at ? ` · resuelta el ${day(item.completed_at)}` : ''}
                </p>
              </div>
              {item.status === 'pending' && (
                <Button radius="sm" className="ws-btn bg-ws-tomato text-ws-paper-light h-11 px-5 shrink-0" onPress={() => execute(item)}>
                  Eliminar cuenta ahora
                </Button>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default AdminDeletionsTab;
