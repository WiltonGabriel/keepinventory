

export interface Block {
  id: string;
  name: string;
}

export interface Sector {
  id: string;
  name: string;
  abbreviation: string; // Should be 3 letters
  blockId: string;
}

export interface Room {
  id: string;
  name: string;
  sectorId: string;
}

export type AssetStatus = "Em Uso" | "Guardado" | "Desconhecido" | "Perdido";

export const assetStatusOptions: AssetStatus[] = ["Em Uso", "Guardado", "Desconhecido", "Perdido"];

export interface Asset {
  id: string;
  name: string;
  roomId: string;
  status: AssetStatus;
}

// Log para o histórico detalhado de um item específico (sub-coleção)
export interface LogEspecifico {
    id: string;
    timestamp: any; // Firestore Timestamp
    action: "Criado" | "Status Alterado" | "Movido" | "Nome Alterado";
    from: string;
    to: string;
    assetNameSnapshot: string; // Nome do patrimônio no momento do log
}

// Log para o feed de atividade global no dashboard (coleção principal)
export interface LogGeral {
    id: string;
    timestamp: any; // Firestore Timestamp
    acao: string; // Ex: "Patrimônio TIN001 criado."
}


export interface UserProfile {
    name: string;
    email: string;
    role: string;
}

export type Entity = Block | Sector | Room | Asset | LogGeral | LogEspecifico;
export type EntityType = 'blocos' | 'setores' | 'salas' | 'patrimonios' | 'log_geral' | 'log_especifico';
