import React, { useState, useMemo, useCallback } from 'react';
import { Card, CardBody, Input, Button, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip, Tooltip, Pagination } from '@heroui/react';
import { Search, Trash2, Pin, PinOff } from 'lucide-react';

const postColumns = [
  { name: "AVISO", uid: "title" },
  { name: "DESTINO", uid: "location" },
  { name: "PINEADO", uid: "is_pinned" },
  { name: "ACCIONES", uid: "actions" },
];

const AdminPostsTab = ({ posts, handleTogglePin, handleDeletePost, countries, currentUser }) => {
  const [filterValue, setFilterValue] = useState("");
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;

  const filteredPosts = useMemo(() => {

    let currentPosts = posts.filter(post => post.is_pinned === true);

    if (Boolean(filterValue)) {
      currentPosts = currentPosts.filter((post) =>
        post.title.toLowerCase().includes(filterValue.toLowerCase())
      );
    }
    return currentPosts;
  }, [posts, filterValue]);

  const pages = Math.ceil(filteredPosts.length / rowsPerPage) || 1;

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredPosts.slice(start, end);
  }, [page, filteredPosts, rowsPerPage]);

  const onSearchChange = useCallback((value) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const renderCell = useCallback((post, columnKey) => {
    switch (columnKey) {
      case "title":
        return (
          <div className="flex flex-col">
            <span className="font-bold text-lg">{post.title}</span>
            <span className="text-default-400 text-xs">ID Dueño: {post.user_id}</span>
          </div>
        );
      case "location":
        const country = countries.find(c => c.id.toString() === post.country_id?.toString());
        return (
          <div className="flex items-center gap-1 font-bold">
            {country ? `${country.flag} ${country.name}` : "Global"}
          </div>
        );
      case "is_pinned":
        return (
          <Chip
            size="sm"
            color={post.is_pinned ? "warning" : "default"}
            variant="flat"
            className="font-bold uppercase tracking-widest text-xs border-[1px]"
            startContent={post.is_pinned ? <Pin className="w-3 h-3 ml-1"/> : null}
          >
            {post.is_pinned ? "Destacado" : "Normal"}
          </Chip>
        );
      case "actions":
        if (currentUser?.role !== 'superadmin') {
          return <span className="text-default-400 text-xs font-bold w-full text-right block">Solo SuperAdmin</span>;
        }

        return (
          <div className="relative flex items-center gap-2 justify-end">
            
            <Tooltip color={post.is_pinned ? "default" : "warning"} content={post.is_pinned ? "Quitar Pin" : "Pinnear Aviso"}>
              <span 
                className={`text-lg cursor-pointer active:opacity-50 transition-colors ${post.is_pinned ? 'text-gray-400 hover:text-danger' : 'text-default-400 hover:text-warning'}`}
                onClick={() => handleTogglePin(post.id)}
              >
                {post.is_pinned ? <PinOff className="w-5 h-5"/> : <Pin className="w-5 h-5"/>}
              </span>
            </Tooltip>
            
            
            <Tooltip color="danger" content="Borrar Aviso">
              <span 
                className="text-lg text-danger cursor-pointer active:opacity-50 hover:opacity-80 transition-opacity"
                onClick={() => handleDeletePost(post.id)}
              >
                <Trash2 className="w-5 h-5"/>
              </span>
            </Tooltip>
          </div>
        );
      default:
        return post[columnKey];
    }
  }, [handleTogglePin, handleDeletePost, countries, currentUser]);

  return (
    <Card className="mt-4 border-[2px] border-black rounded-xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
      <CardBody className="p-0 overflow-hidden">
        <Table 
          aria-label="Tabla de moderación de Posts" 
          removeWrapper 
          radius="none"
          topContent={
            <div className="p-4 border-b-[2px] border-black bg-gray-50 flex flex-col md:flex-row gap-4 items-center justify-between">
              <Input
                isClearable
                classNames={{
                  base: "w-full sm:max-w-[44%]",
                  inputWrapper: "border-[2px] border-black bg-white focus-within:bg-gray-100",
                }}
                placeholder="Buscar aviso por título..."
                size="md"
                startContent={<Search className="text-default-400 w-4 h-4 shrink-0" />}
                value={filterValue}
                onClear={() => onSearchChange("")}
                onValueChange={onSearchChange}
              />
              <div className="flex w-full sm:w-auto items-center gap-3">
                <span className="text-default-400 text-sm font-bold">Total: {filteredPosts.length} avisos destacados</span>
              </div>
            </div>
          }
          bottomContent={
            <div className="flex w-full justify-center p-4 border-t-[2px] border-black bg-gray-50">
              <Pagination
                isCompact
                showControls
                showShadow
                color="danger"
                page={page}
                total={pages}
                onChange={(page) => setPage(page)}
                classNames={{ cursor: "bg-black border-[2px] border-black text-white" }}
              />
            </div>
          }
          classNames={{
            th: "bg-gray-100 border-b-[2px] border-black font-titulo font-black text-black uppercase text-sm"
          }}
        >
          <TableHeader columns={postColumns}>
            {(column) => (
              <TableColumn key={column.uid} align={column.uid === "actions" ? "end" : "start"}>
                {column.name}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody items={items} emptyContent="Aún no tienes Avisos Destacados. Entra a un Aviso y haz clic en Pinnear.">
            {(item) => (
              <TableRow key={item.id} className="border-bottom border-gray-200 hover:bg-gray-50 transition-colors">
                {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardBody>
    </Card>
  );
};

export default AdminPostsTab;
