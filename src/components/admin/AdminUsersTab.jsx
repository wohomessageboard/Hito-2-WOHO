import React, { useState, useMemo, useCallback } from 'react';
import { CardBody, Input, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip, User, Tooltip, Pagination } from '@heroui/react';
import SurfaceCard from '../ui/SurfaceCard';
import { Search, Eye, Edit, Trash2, Ban, CheckCircle2 } from 'lucide-react';
import { Link as RouterLink } from 'react-router-dom';

const userColumns = [
  { name: "USUARIO", uid: "name" },
  { name: "ROL", uid: "role" },
  { name: "ACCIONES", uid: "actions" },
];

const AdminUsersTab = ({ users, handleToggleBan, handleToggleRole, handleDeleteUser, currentUser }) => {
  const [filterValue, setFilterValue] = useState("");
  const [page, setPage] = useState(1);
  const rowsPerPage = 4;

  const filteredUsers = useMemo(() => {
    let currentUsers = [...users];
    if (filterValue) {
      currentUsers = currentUsers.filter((user) =>
        user.name.toLowerCase().includes(filterValue.toLowerCase())
      );
    }
    return currentUsers;
  }, [users, filterValue]);

  const pages = Math.ceil(filteredUsers.length / rowsPerPage) || 1;

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredUsers.slice(start, end);
  }, [page, filteredUsers, rowsPerPage]);

  const onSearchChange = useCallback((value) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const renderCell = useCallback((user, columnKey) => {
    switch (columnKey) {
      case "name":
        return (
          <User
            avatarProps={{radius: "lg", src: user.avatar, isBordered: true }}
            description={`ID: ${user.id}`}
            name={user.name}
          >
            {user.name}
          </User>
        );
      case "role":
        return (
          <div className="flex flex-col gap-1 items-start">
            {user.role === 'superadmin' ? (
              <Tooltip content="El rol de superadmin no se cambia desde esta tabla">
                <Chip
                  className="capitalize font-bold border-2 border-purple-400 text-purple-700"
                  color="secondary"
                  variant="flat"
                  size="sm"
                >
                  Superadmin
                </Chip>
              </Tooltip>
            ) : (
              <Chip
                className={`capitalize font-bold border-2 ${user.role === 'admin' ? "border-danger text-danger" : "border-gray-300 text-gray-700"}`}
                color={user.role === 'admin' ? "danger" : "default"}
                variant="flat"
                size="sm"
              >
                {user.role === 'admin' ? 'Admin' : 'Usuario'}
              </Chip>
            )}
            {!user.is_active && (
              <Chip size="sm" color="danger" variant="solid" className="font-bold text-xs uppercase" startContent={<Ban className="w-3 h-3 ml-1"/>}>
                Baneado
              </Chip>
            )}
          </div>
        );
      case "actions":
        return (
          <div className="relative flex items-center gap-2 justify-end">
            <Tooltip content="Ver perfil">
              <RouterLink
                to={`/profile/${user.id}`}
                aria-label={`Ver perfil de ${user.name}`}
                className="text-lg text-default-400 cursor-pointer active:opacity-50 hover:text-black transition-colors"
              >
                <Eye className="w-5 h-5"/>
              </RouterLink>
            </Tooltip>

            {user.role !== 'superadmin' && (
              <Tooltip content="Ascender / Degradar (Rol)">
                <button
                  type="button"
                  aria-label={`Cambiar rol de ${user.name}`}
                  className="text-lg text-default-400 cursor-pointer active:opacity-50 hover:text-blue-500 transition-colors"
                  onClick={() => handleToggleRole(user.id)}
                >
                  <Edit className="w-5 h-5"/>
                </button>
              </Tooltip>
            )}

            <Tooltip color={user.is_active ? "danger" : "success"} content={user.is_active ? "Banear (Soft Delete)" : "Restaurar Usuario"}>
              <button
                type="button"
                aria-label={user.is_active ? `Banear a ${user.name}` : `Restaurar a ${user.name}`}
                className={`text-lg cursor-pointer active:opacity-50 transition-opacity ${user.is_active ? 'text-danger hover:opacity-80' : 'text-success hover:opacity-80'}`}
                onClick={() => handleToggleBan(user.id)}
              >
                {user.is_active ? <Ban className="w-5 h-5"/> : <CheckCircle2 className="w-5 h-5"/>}
              </button>
            </Tooltip>


            {currentUser?.role === 'superadmin' && (
              <Tooltip color="danger" content="Borrado Total (Destructivo)">
                <button
                  type="button"
                  aria-label={`Eliminar definitivamente a ${user.name}`}
                  className="text-lg text-default-400 cursor-pointer active:opacity-50 hover:text-danger hover:bg-red-50 rounded-md transition-all"
                  onClick={() => {
                    if (window.confirm(`¿Estás SEGURO de eliminar DEFINITIVAMENTE a ${user.name}? Esta acción borrará sus favs y posts.`)) {
                      handleDeleteUser(user.id);
                    }
                  }}
                >
                  <Trash2 className="w-5 h-5"/>
                </button>
              </Tooltip>
            )}
          </div>
        );
      default:
        return user[columnKey];
    }
  }, [handleToggleBan, handleToggleRole, handleDeleteUser, currentUser]);

  return (
    <SurfaceCard className="mt-4">
      <CardBody className="p-0 overflow-hidden">
        <Table 
          aria-label="Tabla de usuarios dinámica con buscador" 
          removeWrapper 
          radius="none"
          topContent={
            <div className="p-4 border-b border-gray-200 bg-gray-50 flex flex-col md:flex-row gap-4 items-center justify-between">
              <Input
                isClearable
                classNames={{
                  base: "w-full sm:max-w-[44%]",
                  inputWrapper: "border border-gray-200 bg-white focus-within:bg-gray-100",
                }}
                placeholder="Buscar por nombre..."
                size="md"
                startContent={<Search className="text-default-400 w-4 h-4 shrink-0" />}
                value={filterValue}
                onClear={() => onSearchChange("")}
                onValueChange={onSearchChange}
              />
              <div className="flex w-full sm:w-auto items-center gap-3">
                <span className="text-default-400 text-sm font-bold">Total: {filteredUsers.length} usuarios</span>
              </div>
            </div>
          }
          bottomContent={
            <div className="flex w-full justify-center p-4 border-t border-gray-200 bg-gray-50">
              <Pagination
                isCompact
                showControls
                showShadow
                color="danger"
                page={page}
                total={pages}
                onChange={(page) => setPage(page)}
                classNames={{ cursor: "bg-woho-black text-white" }}
              />
            </div>
          }
          classNames={{
            th: "bg-gray-100 border-b border-gray-200 font-titulo font-black text-black uppercase text-sm"
          }}
        >
          <TableHeader columns={userColumns}>
            {(column) => (
              <TableColumn key={column.uid} align={column.uid === "actions" ? "end" : "start"}>
                {column.name}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody items={items}>
            {(item) => (
              <TableRow key={item.id} className="border-bottom border-gray-200 hover:bg-gray-50 transition-colors">
                {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardBody>
    </SurfaceCard>
  );
};

export default AdminUsersTab;
