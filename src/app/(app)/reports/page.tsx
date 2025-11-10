'use client';

import { useState } from 'react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, where, Timestamp } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, CalendarIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Block, Sector, Room, Asset, LogGeral } from '@/lib/types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { getDocs } from 'firebase/firestore';

export default function ReportsPage() {
  const firestore = useFirestore();
  const { toast } = useToast();

  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();

  // Hooks to get all necessary data
  const assetsCollection = useMemoFirebase(() => (firestore ? collection(firestore, 'patrimonios') : null), [firestore]);
  const roomsCollection = useMemoFirebase(() => (firestore ? collection(firestore, 'salas') : null), [firestore]);
  const sectorsCollection = useMemoFirebase(() => (firestore ? collection(firestore, 'setores') : null), [firestore]);
  const blocksCollection = useMemoFirebase(() => (firestore ? collection(firestore, 'blocos') : null), [firestore]);
  // We remove the useCollection for logs as we'll fetch them on-demand
  // const generalLogQuery = useMemoFirebase(() => (firestore ? query(collection(firestore, 'log_geral'), orderBy('timestamp', 'desc')) : null), [firestore]);

  const { data: assets, isLoading: loadingAssets } = useCollection<Asset>(assetsCollection);
  const { data: rooms, isLoading: loadingRooms } = useCollection<Room>(roomsCollection);
  const { data: sectors, isLoading: loadingSectors } = useCollection<Sector>(sectorsCollection);
  const { data: blocks, isLoading: loadingBlocks } = useCollection<Block>(blocksCollection);
  // const { data: logs, isLoading: loadingLogs } = useCollection<LogGeral>(generalLogQuery);
  const [loadingLogs, setLoadingLogs] = useState(false);

  const isLoading = loadingAssets || loadingRooms || loadingSectors || loadingBlocks;

  const escapeCsvField = (field: string | null | undefined): string => {
    if (field === null || field === undefined) {
      return '""';
    }
    const stringField = String(field);
    if (/[",\n\r]/.test(stringField)) {
      return `"${stringField.replace(/"/g, '""')}"`;
    }
    return `"${stringField}"`;
  };

  const downloadCsv = (content: string, filename: string) => {
    const blob = new Blob([`\uFEFF${content}`], { type: 'text/csv;charset=utf-8;' }); // BOM for Excel
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleExportInventory = () => {
    if (!assets || !rooms || !sectors || !blocks) {
      toast({ variant: 'destructive', title: 'Erro', description: 'Os dados ainda não foram carregados.' });
      return;
    }

    const roomMap = new Map(rooms.map((r) => [r.id, r]));
    const sectorMap = new Map(sectors.map((s) => [s.id, s]));
    const blockMap = new Map(blocks.map((b) => [b.id, b]));

    const csvHeader = ['ID', 'Nome', 'Status', 'Sala', 'Setor', 'Bloco'].join(',');

    const csvRows = assets.map((asset) => {
      const room = roomMap.get(asset.roomId);
      const sector = room ? sectorMap.get(room.sectorId) : undefined;
      const block = sector ? blockMap.get(sector.blockId) : undefined;

      const row = [
        escapeCsvField(asset.id),
        escapeCsvField(asset.name),
        escapeCsvField(asset.status),
        escapeCsvField(room?.name),
        escapeCsvField(sector?.name),
        escapeCsvField(block?.name),
      ];
      return row.join(',');
    });

    const csvContent = [csvHeader, ...csvRows].join('\n');
    downloadCsv(csvContent, `inventario_completo_${new Date().toISOString().split('T')[0]}.csv`);

    toast({ title: 'Sucesso!', description: 'O relatório de inventário foi gerado.' });
  };

  const handleExportActivityLog = async () => {
    if (!firestore) return;
    setLoadingLogs(true);
    
    try {
      // Base query
      let q = query(collection(firestore, 'log_geral'), orderBy('timestamp', 'desc'));

      // Apply date filters if they exist
      if (startDate) {
        q = query(q, where('timestamp', '>=', Timestamp.fromDate(startDate)));
      }
      if (endDate) {
        // To make the range inclusive, set the time to the end of the day
        const endOfDay = new Date(endDate);
        endOfDay.setHours(23, 59, 59, 999);
        q = query(q, where('timestamp', '<=', Timestamp.fromDate(endOfDay)));
      }

      const querySnapshot = await getDocs(q);
      const logs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as LogGeral[];

      if (logs.length === 0) {
        toast({ title: 'Nenhum resultado', description: 'Nenhum log de atividade encontrado para o período selecionado.' });
        return;
      }

      const csvHeader = ['Data', 'Ação'].join(',');

      const csvRows = logs.map((log) => {
        const formattedDate = log.timestamp
          ? format(log.timestamp.toDate(), 'dd/MM/yyyy HH:mm:ss', { locale: ptBR })
          : 'Data desconhecida';

        const row = [escapeCsvField(formattedDate), escapeCsvField(log.acao)];
        return row.join(',');
      });

      const csvContent = [csvHeader, ...csvRows].join('\n');
      downloadCsv(csvContent, `log_atividades_${new Date().toISOString().split('T')[0]}.csv`);

      toast({ title: 'Sucesso!', description: 'O log de atividades foi gerado.' });
    } catch (error) {
      console.error("Error exporting activity log:", error);
      toast({ variant: 'destructive', title: 'Erro', description: 'Não foi possível exportar o log de atividades.' });
    } finally {
      setLoadingLogs(false);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-3xl font-bold tracking-tight">Relatórios</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Inventory Reports */}
        <Card>
          <CardHeader>
            <CardTitle>Relatórios de Inventário</CardTitle>
            <CardDescription>Exporte os dados completos do seu inventário para análise externa.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={handleExportInventory}
              disabled={isLoading || !assets || assets.length === 0}
              className="w-full"
            >
              <Download className="mr-2 h-4 w-4" />
              Exportar Inventário Completo (.csv)
            </Button>
            {isLoading && <p className="text-sm text-muted-foreground mt-2 text-center">Carregando dados do inventário...</p>}
            {!isLoading && (!assets || assets.length === 0) && (
              <p className="text-sm text-muted-foreground mt-2 text-center">Nenhum item no inventário para exportar.</p>
            )}
          </CardContent>
        </Card>

        {/* Activity Reports */}
        <Card>
          <CardHeader>
            <CardTitle>Relatórios de Atividade</CardTitle>
            <CardDescription>Exporte o histórico de todas as ações realizadas no sistema, opcionalmente filtrando por período.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={'outline'}
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !startDate && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, 'PPP', { locale: ptBR }) : <span>Data de Início</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
                </PopoverContent>
              </Popover>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={'outline'}
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !endDate && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, 'PPP', { locale: ptBR }) : <span>Data de Fim</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
            <Button onClick={handleExportActivityLog} disabled={loadingLogs} className="w-full">
              <Download className="mr-2 h-4 w-4" />
              {loadingLogs ? 'Gerando Relatório...' : 'Exportar Log de Atividade (.csv)'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
