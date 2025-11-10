
"use client";

import { useMemo } from "react";
import { Block, Sector, Room, Asset, Movement } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Archive, Building, DoorOpen, Building2, BarChart3, CheckCircle, AlertTriangle, ArrowRight, Edit3, PlusCircle } from "lucide-react";
import { useUser, useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, query, orderBy, limit } from "firebase/firestore";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";

type Stats = {
  assetCount: number;
  activeAssetCount: number;
  lostAssetCount: number;
};

export default function DashboardPage() {
    const firestore = useFirestore();
    const { user } = useUser();

    const assetsCollection = useMemoFirebase(() => firestore ? collection(firestore, 'assets') : null, [firestore]);
    const roomsCollection = useMemoFirebase(() => firestore ? collection(firestore, 'rooms') : null, [firestore]);
    const sectorsCollection = useMemoFirebase(() => firestore ? collection(firestore, 'sectors') : null, [firestore]);
    const blocksCollection = useMemoFirebase(() => firestore ? collection(firestore, 'blocks') : null, [firestore]);

    const movementsQuery = useMemoFirebase(
      () =>
        firestore
          ? query(
              collection(firestore, "movements"),
              orderBy("timestamp", "desc"),
              limit(10)
            )
          : null,
      [firestore]
    );

    const { data: assets } = useCollection<Asset>(assetsCollection);
    const { data: rooms } = useCollection<Room>(roomsCollection);
    const { data: sectors } = useCollection<Sector>(sectorsCollection);
    const { data: blocks } = useCollection<Block>(blocksCollection);
    const { data: recentMovements, isLoading: isLoadingMovements } = useCollection<Movement>(movementsQuery);


  const stats: Stats = useMemo(() => {
    const assetCount = assets?.length || 0;
    const activeAssetCount = assets?.filter(a => a.status === 'Em Uso').length || 0;
    const lostAssetCount = assets?.filter(a => a.status === 'Perdido').length || 0;
    return { assetCount, activeAssetCount, lostAssetCount };
    }, [assets]);


  const getSectorsForBlock = (blockId: string) => {
    return sectors?.filter(s => s.blockId === blockId) || [];
  };
  const getRoomsForSector = (sectorId: string) => {
    return rooms?.filter(r => r.sectorId === sectorId) || [];
  };
  const getAssetsForRoom = (roomId: string) => {
    return assets?.filter(a => a.roomId === roomId) || [];
  };

  const getActionIcon = (action: Movement["action"]) => {
    switch(action) {
      case 'Criado':
        return <PlusCircle className="h-4 w-4 text-green-500" />;
      case 'Status Alterado':
        return <Edit3 className="h-4 w-4 text-blue-500" />;
      case 'Movido':
        return <ArrowRight className="h-4 w-4 text-orange-500" />;
      case 'Nome Alterado':
        return <Edit3 className="h-4 w-4 text-purple-500" />;
      default:
        return null;
    }
  }

  const renderMovementDetails = (movement: Movement) => {
    const assetName = <span className="font-bold">{`"${movement.assetName}"`}</span>;
    switch (movement.action) {
      case "Criado":
        return <>Patrimônio {assetName} foi criado.</>;
      case "Status Alterado":
        return (
          <>
            Status do {assetName} alterado de <Badge variant="outline">{movement.from}</Badge> para <Badge variant="outline">{movement.to}</Badge>.
          </>
        );
      case "Movido":
        return (
          <>
            {assetName} movido de <Badge variant="secondary">{movement.from}</Badge> para <Badge variant="secondary">{movement.to}</Badge>.
          </>
        );
      case "Nome Alterado":
        return (
            <>
                Nome do patrimônio alterado de <span className="font-semibold">{movement.from}</span> para <span className="font-semibold">{movement.to}</span>.
            </>
        );
      default:
        return "Ação desconhecida.";
    }
  };


  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-3xl font-bold tracking-tight">
        {user ? `Olá, ${user.displayName || user.email?.split('@')[0]}!` : "Tela inicial"}
      </h1>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="hierarchy">Explorar Hierarquia</TabsTrigger>
          <TabsTrigger value="charts">Gráficos</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Patrimônios</CardTitle>
                <Archive className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                <div className="text-2xl font-bold">{stats.assetCount}</div>
                <p className="text-xs text-muted-foreground">Itens cadastrados no sistema</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Itens Ativos</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                <div className="text-2xl font-bold">{stats.activeAssetCount}</div>
                <p className="text-xs text-muted-foreground">Itens com status "Em Uso"</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Itens Perdidos</CardTitle>
                <AlertTriangle className="h-4 w-4 text-destructive" />
                </CardHeader>
                <CardContent>
                <div className="text-2xl font-bold">{stats.lostAssetCount}</div>
                <p className="text-xs text-muted-foreground">Itens com status "Perdido"</p>
                </CardContent>
            </Card>
          </div>
            <Card>
              <CardHeader>
                  <CardTitle>Últimas Movimentações</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-72 w-full">
                  <div className="p-4">
                      {isLoadingMovements && <p>Carregando histórico...</p>}
                      {!isLoadingMovements && recentMovements && recentMovements.length === 0 && (
                          <p className="text-muted-foreground">Nenhuma movimentação encontrada.</p>
                      )}
                      {!isLoadingMovements && recentMovements && recentMovements.length > 0 && (
                          <ul className="space-y-4">
                              {recentMovements.map((movement) => (
                                  <li key={movement.id} className="flex items-start gap-4">
                                      <div className="flex-shrink-0 pt-1">{getActionIcon(movement.action)}</div>
                                      <div className="flex-grow">
                                          <p className="text-sm">{renderMovementDetails(movement)}</p>
                                          <p className="text-xs text-muted-foreground">
                                              {movement.timestamp ? format(movement.timestamp.toDate(), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR }) : 'Data desconhecida'}
                                          </p>
                                      </div>
                                  </li>
                              ))}
                          </ul>
                      )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
        </TabsContent>

        <TabsContent value="hierarchy">
          <Card>
            <CardHeader>
              <CardTitle>Hierarquia do Inventário</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="multiple" className="w-full">
                {blocks?.map((block) => (
                  <AccordionItem value={`block-${block.id}`} key={block.id}>
                    <AccordionTrigger className="font-medium text-lg">
                      <div className="flex items-center gap-2">
                        <Building className="h-5 w-5 text-primary" /> {block.name}
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pl-6">
                      <Accordion type="multiple" className="w-full">
                        {getSectorsForBlock(block.id).map((sector) => (
                          <AccordionItem value={`sector-${sector.id}`} key={sector.id}>
                            <AccordionTrigger className="font-medium">
                              <div className="flex items-center gap-2">
                                <Building2 className="h-5 w-5 text-secondary"/> {sector.name}
                              </div>
                            </AccordionTrigger>
                            <AccordionContent className="pl-6">
                              <Accordion type="multiple" className="w-full">
                                {getRoomsForSector(sector.id).map((room) => (
                                  <AccordionItem value={`room-${room.id}`} key={room.id}>
                                    <AccordionTrigger>
                                    <div className="flex items-center gap-2">
                                      <DoorOpen className="h-5 w-5 text-accent"/> {room.name}
                                    </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="pl-8">
                                      <ul className="space-y-2">
                                        {getAssetsForRoom(room.id).map((asset) => (
                                          <li key={asset.id} className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Archive className="h-4 w-4"/>
                                            {asset.name} ({asset.id})
                                          </li>
                                        ))}
                                        {getAssetsForRoom(room.id).length === 0 && <p className="text-sm text-muted-foreground">Nenhum patrimônio nesta sala.</p>}
                                      </ul>
                                    </AccordionContent>
                                  </AccordionItem>
                                ))}
                                {getRoomsForSector(sector.id).length === 0 && <p className="pt-4 text-sm text-muted-foreground">Nenhuma sala neste setor.</p>}
                              </Accordion>
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                        {getSectorsForBlock(block.id).length === 0 && <p className="pt-4 text-sm text-muted-foreground">Nenhum setor neste bloco.</p>}
                      </Accordion>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="charts">
             <Card className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm min-h-[300px]">
                <CardContent className="flex flex-col items-center gap-4 p-6 text-center">
                <BarChart3 className="h-16 w-16 text-muted-foreground" />
                <h3 className="text-2xl font-bold tracking-tight">
                    Gráficos em Breve
                </h3>
                <p className="text-sm text-muted-foreground">
                    Esta área exibirá gráficos e visualizações sobre o inventário.
                </p>
                </CardContent>
            </Card>
        </TabsContent>

      </Tabs>

    </div>
  );
}
