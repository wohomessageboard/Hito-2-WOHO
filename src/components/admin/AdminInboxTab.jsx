import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@heroui/react';
import api from '../../config/api';
import EmptyState from '../ui/EmptyState';

const REASONS = {
  spam: 'Spam o publicidad',
  estafa: 'Posible estafa',
  ofensivo: 'Contenido ofensivo',
  falso: 'Información falsa',
  otro: 'Otro motivo',
};
const RESOLUTIONS = { handled: 'Atendido', dismissed: 'Descartado', replied: 'Respondido', post_deleted: 'Aviso eliminado' };

const when = (iso) => new Date(iso).toLocaleString('es', { dateStyle: 'medium', timeStyle: 'short' });

const AdminInboxTab = ({ onOpenCountChange }) => {
  const [status, setStatus] = useState('open');
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const res = await api.get('/admin/inbox', { params: { status } });
      setItems(res.data.items);
      onOpenCountChange?.(res.data.open_count);
    } catch (err) {
      setError(err.response?.data?.error || 'No pudimos cargar la bandeja.');
    } finally {
      setIsLoading(false);
    }
  }, [status, onOpenCountChange]);

  useEffect(() => { load(); }, [load]);

  const resolve = async (id, resolution) => {
    try {
      await api.put(`/admin/inbox/${id}/resolve`, { resolution });
      await load();
    } catch (err) {
      alert(err.response?.data?.error || 'No se pudo actualizar el mensaje.');
    }
  };

  // Elimina el aviso (con sus fotos); el servidor deja resueltos sus reportes.
  const deletePost = async (item) => {
    if (!window.confirm(`¿Eliminar definitivamente el aviso "${item.post_title}"? Se borran también sus fotos.`)) return;
    try {
      await api.delete(`/admin/posts/${item.post_id}`);
      await load();
    } catch (err) {
      alert(err.response?.data?.error || 'No se pudo eliminar el aviso.');
    }
  };

  return (
    <div className="space-y-6">
      <div role="group" aria-label="Estado" className="flex gap-2">
        {[['open', 'Pendientes'], ['resolved', 'Resueltos']].map(([key, label]) => (
          <button
            key={key}
            type="button"
            aria-pressed={status === key}
            onClick={() => setStatus(key)}
            className={`min-h-11 px-4 font-bold ${status === key ? 'ws-chip-selected' : 'ws-chip-idle'}`}
          >
            {label}
          </button>
        ))}
      </div>

      {error && <p role="alert" className="bg-ws-tomato/15 rounded-[6px] p-3 font-bold">{error}</p>}
      {isLoading && <p role="status" className="ws-mono">Cargando…</p>}

      {!isLoading && !error && items.length === 0 && (
        <EmptyState stamp={status === 'open' ? 'AL DÍA' : 'SIN HISTORIAL'} title={status === 'open' ? 'Bandeja al día' : 'Nada resuelto aún'}>
          {status === 'open' ? 'No hay reportes ni mensajes pendientes.' : 'Cuando atiendas mensajes aparecerán aquí.'}
        </EmptyState>
      )}

      <ul className="grid gap-4 list-none p-0 m-0">
        {items.map((item) => (
          <li key={item.id} className="ws-surface p-5 flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-2 justify-between">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`ws-tag ${item.kind === 'report' ? 'ws-tag-tomato' : 'ws-tag-blue'}`}>
                  {item.kind === 'report' ? 'Reporte' : 'Contacto'}
                </span>
                {item.kind === 'report' && <span className="font-bold">{REASONS[item.reason] || item.reason}</span>}
              </div>
              <span className="ws-mono text-ws-ink/70">{when(item.created_at)}</span>
            </div>

            {item.kind === 'report' && (
              <p className="font-cuerpo">
                Aviso:{' '}
                {item.post_id
                  ? <Link to={`/post/${item.post_id}`} className="font-bold underline underline-offset-4">{item.post_title}</Link>
                  : <span className="font-bold">{item.post_title} <span className="ws-mono">(eliminado)</span></span>}
              </p>
            )}

            {item.message && <p className="font-cuerpo whitespace-pre-wrap bg-ws-paper-deep rounded-[6px] p-3">{item.message}</p>}

            <p className="font-cuerpo text-sm text-ws-ink/80">
              {item.kind === 'report' ? 'Reportado por' : 'De'}: <strong>{item.name || 'Anónimo'}</strong>{item.email ? ` · ${item.email}` : ''}
            </p>

            {item.status === 'open' ? (
              <div className="flex flex-wrap gap-2 pt-1">
                {item.kind === 'report' && item.post_id && (
                  <Button radius="sm" className="ws-btn ws-btn-tomato h-11 px-4" onPress={() => deletePost(item)}>Eliminar aviso</Button>
                )}
                {item.kind === 'contact' && item.email && (
                  <Button as="a" href={`mailto:${item.email}?subject=${encodeURIComponent('Respuesta de WOHO')}`} radius="sm" className="ws-btn ws-btn-ink h-11 px-4"
                    onPress={() => resolve(item.id, 'replied')}>
                    Responder por correo
                  </Button>
                )}
                <Button radius="sm" className="ws-pill ws-pill-line h-11 px-4" onPress={() => resolve(item.id, item.kind === 'report' ? 'dismissed' : 'handled')}>
                  {item.kind === 'report' ? 'Descartar reporte' : 'Marcar como atendido'}
                </Button>
              </div>
            ) : (
              <p className="ws-mono text-ws-ink/70">
                {RESOLUTIONS[item.resolution] || 'Resuelto'}{item.resolved_at ? ` · ${when(item.resolved_at)}` : ''}
              </p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminInboxTab;
