
"use client";

import { useState, useMemo } from "react";
import { Asset, Room, Sector, Block, AssetStatus } from "@/lib/types";
import { PageHeader } from "@/components/page-header";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { AssetForm } from "./asset-form";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, doc, getDocs, query, where, limit } from "firebase/firestore";
import { addDocumentNonBlocking, deleteDocumentNonBlocking, updateDocumentNonBlocking } from "@/firebase/non-blocking-updates";

export default function AssetsPage() {
  const firestore = useFirestore();
  const assetsCollection = useMemoFirebase(() => collection(firestore, "assets"), [firestore]);
  const roomsCollection = useMemoFirebase(() => collection(firestore, "rooms"), [firestore]);
  const sectorsCollection = useMemoFirebase(() => collection(firestore, "sectors"), [firestore]);
  const blocksCollection = useMemoFirebase(() => collection(firestore, "blocks"), [firestore]);

  const { data: assets, isLoading: isLoadingAssets } = useCollection<Asset>(assetsCollection);
  const { data: rooms, isLoading: isLoadingRooms } = useCollection<Room>(roomsCollection);
  const { data: sectors, isLoading: isLoadingSectors } = useCollection<Sector>(sectorsCollection);
  const { data: blocks, isLoading: isLoadingBlocks } = useCollection<Block>(blocksCollection);

  const [searchQuery, setSearchQuery] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState<Asset | undefined>(undefined);
  const { toast } = useToast();

  const handleAdd = () => {
    setEditingAsset(undefined);
    setIsFormOpen(true);
  };

  const handleEdit = (asset: Asset) => {
    setEditingAsset(asset);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (!firestore) return;
    deleteDocumentNonBlocking(doc(firestore, "assets", id));
    toast({ title: "Patrimônio removido", description: "O item foi removido com sucesso." });
  };

  const generateNewAssetId = async (sectorId: string) => {
    if (!firestore || !sectors) return null;

    const sector = sectors.find(s => s.id === sectorId);
    if (!sector || sector.abbreviation.length !== 3) {
      toast({ variant: "destructive", title: "Erro de Setor", description: "O setor selecionado não possui uma sigla válida de 3 letras." });
      return null;
    }
    const prefix = sector.abbreviation.toUpperCase();

    // Query to find the last asset with this prefix
    const assetsWithPrefixQuery = query(
      collection(firestore, "assets"),
      where("id", ">=", prefix),
      where("id", "<", prefix + 'z'),
      limit(1000) // Adjust limit as needed, but this is a safeguard
    );

    const querySnapshot = await getDocs(assetsWithPrefixQuery);
    let maxNumber = 0;
    querySnapshot.forEach(doc => {
      const docId = doc.id;
      if (docId.startsWith(prefix)) {
        const numberPart = parseInt(docId.substring(prefix.length), 10);
        if (!isNaN(numberPart) && numberPart > maxNumber) {
          maxNumber = numberPart;
        }
      }
    });

    const newNumber = maxNumber + 1;
    const newId = `${prefix}${newNumber.toString().padStart(3, '0')}`;
    return newId;
  }

  const handleFormSubmit = async (values: Omit<Asset, 'id' | 'roomId'> & { roomId: string; status: AssetStatus; }) => {
    if (!firestore || !sectors) return;

    if (editingAsset) {
      updateDocumentNonBlocking(doc(firestore, "assets", editingAsset.id), {
        ...values
      });
      toast({ title: "Patrimônio atualizado", description: "As informações do item foram salvas." });
    } else {
      const newId = await generateNewAssetId(sectors.find(s => s.id === rooms?.find(r => r.id === values.roomId)?.sectorId)?.id || "");
      if (!newId) {
        toast({ variant: "destructive", title: "Falha ao gerar ID", description: "Não foi possível gerar um novo ID para o patrimônio." });
        return;
      }
      const newAsset = { id: newId, ...values };
      // Note: addDocumentNonBlocking doesn't allow specifying an ID. We must use setDoc.
      // Since we are setting a new document, we don't need to worry about the non-blocking error handling as much for permission errors on create.
      await addDocumentNonBlocking(collection(firestore, "assets"), { name: values.name, roomId: values.roomId, status: values.status, id: newId });

      toast({ title: "Patrimônio adicionado", description: `Um novo item (${newId}) foi criado com sucesso.` });
    }
    setIsFormOpen(false);
    setEditingAsset(undefined);
  };

  const getFullLocation = (roomId: string) => {
    const room = rooms?.find(r => r.id === roomId);
    if (!room) return 'N/A';
    const sector = sectors?.find(s => s.id === room.sectorId);
    if (!sector) return room.name;
    const block = blocks?.find(b => b.id === sector.blockId);
    return `${block?.name || 'N/A'} / ${sector.name} / ${room.name}`;
  };

  const filteredAssets = useMemo(() => {
    if (!assets) return [];
    return assets.filter((asset) =>
      asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      getFullLocation(asset.roomId).toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [assets, searchQuery, rooms, sectors, blocks]);

  const getStatusVariant = (status: AssetStatus) => {
    switch (status) {
      case "Em Uso":
        return "default";
      case "Guardado":
        return "secondary";
      case "Perdido":
        return "destructive";
      case "Desconhecido":
      default:
        return "outline";
    }
  };

  const isLoading = isLoadingAssets || isLoadingRooms || isLoadingSectors || isLoadingBlocks;

  const columns = [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }: { row: { original: Asset } }) => <span className="font-mono text-xs">{row.original.id}</span>,
    },
    {
      accessorKey: "name",
      header: "Nome",
      cell: ({ row }: { row: { original: Asset } }) => row.original.name,
    },
     {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }: { row: { original: Asset } }) => (
        <Badge variant={getStatusVariant(row.original.status)}>{row.original.status}</Badge>
      ),
    },
    {
      accessorKey: "location",
      header: "Localização",
      cell: ({ row }: { row: { original: Asset } }) => getFullLocation(row.original.roomId),
    },
    {
      accessorKey: "actions",
      header: "Ações",
      cell: ({ row }: { row: { original: Asset } }) => (
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={() => handleEdit(row.original)}>
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
                  Esta ação não pode ser desfeita. Isso excluirá permanentemente o item de patrimônio.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={() => handleDelete(row.original.id)}>
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
        title="Patrimônios"
        addLabel="Cadastrar Patrimônio"
        onAdd={handleAdd}
        onSearch={setSearchQuery}
        searchPlaceholder="Pesquisar patrimônios..."
      />

      <Dialog open={isFormOpen} onOpenChange={(open) => { setIsFormOpen(open); if(!open) setEditingAsset(undefined); }}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingAsset ? "Editar Patrimônio" : "Cadastrar Patrimônio"}</DialogTitle>
          </DialogHeader>
          <AssetForm
            onSubmit={handleFormSubmit}
            defaultValues={editingAsset}
            blocks={blocks || []}
            allSectors={sectors || []}
            allRooms={rooms || []}
          />
        </DialogContent>
      </Dialog>
      
      <DataTable
        columns={columns}
        data={filteredAssets}
        emptyStateMessage={isLoading ? "Carregando..." : "Nenhum patrimônio encontrado."}
      />
    </div>
  );
}
