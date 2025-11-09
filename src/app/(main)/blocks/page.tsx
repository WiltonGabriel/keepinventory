"use client";

import { useEffect, useState, useMemo } from "react";
import { inventoryService } from "@/lib/data";
import { Block } from "@/lib/types";
import { PageHeader } from "@/components/page-header";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { BlockForm } from "./block-form";
import { useToast } from "@/hooks/use-toast";

export default function BlocksPage() {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBlock, setEditingBlock] = useState<Block | undefined>(undefined);
  const { toast } = useToast();

  const loadBlocks = () => {
    const allBlocks = inventoryService.getAll("blocks") as Block[];
    setBlocks(allBlocks);
  };

  useEffect(() => {
    loadBlocks();
  }, []);

  const handleAdd = () => {
    setEditingBlock(undefined);
    setIsFormOpen(true);
  };

  const handleEdit = (block: Block) => {
    setEditingBlock(block);
    setIsFormOpen(true);
  };
  
  const handleDelete = (id: string) => {
    inventoryService.delete("blocks", id);
    loadBlocks();
    toast({ title: "Bloco removido", description: "O bloco e seus itens associados foram removidos." });
  };

  const handleFormSubmit = (values: { name: string }) => {
    if (editingBlock) {
      inventoryService.update("blocks", { ...editingBlock, ...values });
      toast({ title: "Bloco atualizado", description: "As informações do bloco foram salvas." });
    } else {
      inventoryService.add("blocks", values);
      toast({ title: "Bloco adicionado", description: "Um novo bloco foi criado com sucesso." });
    }
    loadBlocks();
    setIsFormOpen(false);
    setEditingBlock(undefined);
  };

  const filteredBlocks = useMemo(() => {
    return blocks.filter((block) =>
      block.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [blocks, searchQuery]);

  const columns = [
    {
      accessorKey: "name",
      header: "Nome",
      cell: (item: Block) => item.name,
    },
    {
      accessorKey: "actions",
      header: "Ações",
      cell: (item: Block) => (
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={() => handleEdit(item)}>
            <Edit className="h-4 w-4" />
          </Button>
           <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="icon">
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta ação não pode ser desfeita. Isso excluirá permanentemente o bloco e todos os setores, salas e patrimônios associados a ele.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={() => handleDelete(item.id)}>
                  Excluir
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Blocos"
        addLabel="Cadastrar Bloco"
        onAdd={handleAdd}
        onSearch={setSearchQuery}
        searchPlaceholder="Pesquisar blocos..."
      />

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingBlock ? "Editar Bloco" : "Cadastrar Bloco"}</DialogTitle>
          </DialogHeader>
          <BlockForm onSubmit={handleFormSubmit} defaultValues={editingBlock} />
        </DialogContent>
      </Dialog>
      
      <DataTable
        columns={columns}
        data={filteredBlocks}
        emptyStateMessage="Nenhum bloco encontrado."
      />
    </div>
  );
}
