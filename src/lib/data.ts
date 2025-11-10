
"use client";

import { Block, Sector, Room, Asset, Entity, EntityType, AssetStatus } from './types';

const KEYS = {
  BLOCKS: 'inventory_blocks',
  SECTORS: 'inventory_sectors',
  ROOMS: 'inventory_rooms',
  ASSETS: 'inventory_assets',
};

// --- Generic Functions ---
const getFromStorage = <T>(key: string): T[] => {
  if (typeof window === 'undefined') return [];
  const data = window.localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};

const saveToStorage = <T>(key: string, data: T[]): void => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(key, JSON.stringify(data));
};

const generateId = (prefix: string): string => {
  return `${prefix.replace(/-/g, '')}${Date.now()}${Math.random().toString(36).substr(2, 9)}`;
};

// --- Seed Data ---
const seedData = () => {
  const blocks: Block[] = [
    { id: 'block-a', name: 'Bloco A' },
    { id: 'block-b', name: 'Bloco B' },
    { id: 'block-c', name: 'Bloco C' },
    { id: 'block-d', name: 'Bloco D' },
  ];
  saveToStorage(KEYS.BLOCKS, blocks);

  const sectors: Sector[] = [
    // Bloco A - Administrativo & Acadêmico
    { id: 'sector-ti', name: 'Tecnologia da Informação', abbreviation: 'TIN', blockId: 'block-a' },
    { id: 'sector-rh', name: 'Recursos Humanos', abbreviation: 'RHS', blockId: 'block-a' },
    { id: 'sector-fin', name: 'Financeiro', abbreviation: 'FIN', blockId: 'block-a' },
    { id: 'sector-acad-a', name: 'Acadêmico Geral A', abbreviation: 'ACA', blockId: 'block-a' },

    // Bloco B - Acadêmico
    { id: 'sector-humanas', name: 'Ciências Humanas', abbreviation: 'HUM', blockId: 'block-b' },
    { id: 'sector-exatas', name: 'Ciências Exatas', abbreviation: 'EXA', blockId: 'block-b' },
    { id: 'sector-acad-b', name: 'Acadêmico Geral B', abbreviation: 'ACB', blockId: 'block-b' },


    // Bloco C - Laboratórios & Acadêmico
    { id: 'sector-labinfo', name: 'Laboratórios de Informática', abbreviation: 'LAB', blockId: 'block-c' },
    { id: 'sector-labsaude', name: 'Laboratórios de Saúde', abbreviation: 'SAU', blockId: 'block-c' },
    { id: 'sector-acad-c', name: 'Acadêmico Geral C', abbreviation: 'ACC', blockId: 'block-c' },

    // Bloco D - Acadêmico
    { id: 'sector-saude-d', name: 'Ciências da Saúde D', abbreviation: 'SAD', blockId: 'block-d' },
    { id: 'sector-sociais', name: 'Ciências Sociais Aplicadas', abbreviation: 'SOC', blockId: 'block-d' },
  ];
  saveToStorage(KEYS.SECTORS, sectors);

  const rooms: Room[] = [
    // Bloco A
    { id: 'room-a101', name: 'Sala 101', sectorId: 'sector-ti' },
    { id: 'room-a102', name: 'Data Center', sectorId: 'sector-ti' },
    { id: 'room-a103', name: 'Sala de Reuniões RH', sectorId: 'sector-rh' },
    { id: 'room-a104', name: 'Tesouraria', sectorId: 'sector-fin' },
    { id: 'room-a201', name: 'Sala de Aula A201', sectorId: 'sector-acad-a' },
    { id: 'room-a202', name: 'Sala de Aula A202', sectorId: 'sector-acad-a' },

    // Bloco B
    { id: 'room-b101', name: 'Sala B101', sectorId: 'sector-humanas' },
    { id: 'room-b102', name: 'Sala B102', sectorId: 'sector-humanas' },
    { id: 'room-b201', name: 'Sala B201', sectorId: 'sector-exatas' },
    { id: 'room-b202', name: 'Sala B202', sectorId: 'sector-acad-b' },
    
    // Bloco C
    { id: 'room-c101', name: 'Lab Infor 01', sectorId: 'sector-labinfo' },
    { id: 'room-c102', name: 'Lab Infor 02', sectorId: 'sector-labinfo' },
    { id: 'room-c103', name: 'Lab Infor 03', sectorId: 'sector-labinfo' },
    { id: 'room-c104', name: 'Lab Infor 04', sectorId: 'sector-labinfo' },
    { id: 'room-c105', name: 'Lab Infor 05', sectorId: 'sector-labinfo' },
    { id: 'room-c201', name: 'Lab Anatomia', sectorId: 'sector-labsaude' },
    { id: 'room-c202', name: 'Lab Química', sectorId: 'sector-labsaude' },
    { id: 'room-c301', name: 'Sala C301', sectorId: 'sector-acad-c' },

    // Bloco D
    { id: 'room-d101', name: 'Sala D101', sectorId: 'sector-saude-d' },
    { id: 'room-d102', name: 'Sala D102', sectorId: 'sector-saude-d' },
    { id: 'room-d201', name: 'Sala D201', sectorId: 'sector-sociais' },
    { id: 'room-d202', name: 'Sala D202', sectorId: 'sector-sociais' },
  ];
  saveToStorage(KEYS.ROOMS, rooms);

  const assets: Asset[] = [
      // Bloco A - TI
      { id: 'TIN001', name: 'Servidor Dell PowerEdge R740', roomId: 'room-a102', status: 'Em Uso' },
      { id: 'TIN002', name: 'Switch Cisco Catalyst 9300', roomId: 'room-a102', status: 'Em Uso' },
      { id: 'TIN003', name: 'Monitor Dell UltraSharp 27"', roomId: 'room-a101', status: 'Em Uso' },
      // Bloco A - RH
      { id: 'RHS001', name: 'Impressora HP LaserJet Pro', roomId: 'room-a103', status: 'Guardado' },
      // Bloco A - Financeiro
      { id: 'FIN001', name: 'Calculadora de Mesa Pro', roomId: 'room-a104', status: 'Em Uso' },
      // Bloco A - Acadêmico
      { id: 'ACA001', name: 'Projetor Multimídia Epson', roomId: 'room-a201', status: 'Em Uso' },
      { id: 'ACA002', name: 'Lousa Branca 2x1m', roomId: 'room-a202', status: 'Em Uso' },

      // Bloco C - Laboratório de Informática
      { id: 'LAB001', name: 'Computador Desktop i7/16GB', roomId: 'room-c101', status: 'Em Uso' },
      { id: 'LAB002', name: 'Computador Desktop i7/16GB', roomId: 'room-c101', status: 'Em Uso' },
      { id: 'LAB003', name: 'Monitor Gamer 144Hz', roomId: 'room-c102', status: 'Desconhecido' },
      { id: 'LAB004', name: 'Roteador Wireless TP-Link', roomId: 'room-c103', status: 'Em Uso' },
      { id: 'LAB005', name: 'Cadeira Gamer', roomId: 'room-c104', status: 'Perdido' },

      // Bloco C - Laboratório de Saúde
      { id: 'SAU001', name: 'Esqueleto Humano Anatomia', roomId: 'room-c201', status: 'Guardado' },
      { id: 'SAU002', name: 'Microscópio Óptico Binocular', roomId: 'room-c202', status: 'Guardado' },

      // Bloco D - Social
      { id: 'SOC001', name: 'Cadeira Universitária Acolchoada', roomId: 'room-d201', status: 'Em Uso' },
      { id: 'SOC002', name: 'Cadeira Universitária Acolchoada', roomId: 'room-d201', status: 'Em Uso' },
  ];
  saveToStorage(KEYS.ASSETS, assets);
};

export const inventoryService = {
  // --- Initialization ---
  initialize: () => {
    if (typeof window === 'undefined') return;
    if (!window.localStorage.getItem(KEYS.BLOCKS)) {
      seedData();
    }
  },

  // --- Generic Getters ---
  getAll: (entityType: EntityType) => getFromStorage<Entity>(KEYS[entityType.toUpperCase() as keyof typeof KEYS]),
  getById: (entityType: EntityType, id: string): Entity | undefined => {
    const items = getFromStorage<Entity>(KEYS[entityType.toUpperCase() as keyof typeof KEYS]);
    return items.find(item => item.id === id);
  },
  
  // --- Generic Mutators ---
  add: (entityType: EntityType, item: Omit<Entity, 'id'>): Entity | undefined => {
    const items = getFromStorage<Entity>(KEYS[entityType.toUpperCase() as keyof typeof KEYS]);
    let newItem: Entity;
    if (entityType === 'assets') {
      const assetData = item as Omit<Asset, 'id'>;
      const room = inventoryService.getById('rooms', assetData.roomId) as Room;
       if (!room) {
        console.error(`Error: Room with id "${assetData.roomId}" not found when adding asset.`);
        return undefined;
      }
      const sector = inventoryService.getById('sectors', room.sectorId) as Sector;
       if (!sector) {
        console.error(`Error: Sector with id "${room.sectorId}" not found when adding asset.`);
        return undefined;
      }

      // New ID generation logic
      const allAssets = inventoryService.getAll('assets') as Asset[];
      const assetsInSector = allAssets.filter(asset => {
        const assetRoom = inventoryService.getById('rooms', asset.roomId) as Room;
        return assetRoom && assetRoom.sectorId === sector.id;
      });

      const existingNumbers = assetsInSector
        .map(asset => parseInt(asset.id.replace(sector.abbreviation, ''), 10))
        .filter(num => !isNaN(num));
      
      const nextNumber = existingNumbers.length > 0 ? Math.max(...existingNumbers) + 1 : 1;
      const newId = `${sector.abbreviation}${nextNumber.toString().padStart(3, '0')}`;

      newItem = { ...assetData, id: newId, status: assetData.status || "Em Uso" } as Asset;
    } else {
       const prefix = entityType.slice(0, -1);
       newItem = { ...item, id: generateId(prefix) } as Entity;
    }
    const newItems = [...items, newItem];
    saveToStorage(KEYS[entityType.toUpperCase() as keyof typeof KEYS], newItems);
    return newItem;
  },
  update: (entityType: EntityType, updatedItem: Entity): Entity => {
    const items = getFromStorage<Entity>(KEYS[entityType.toUpperCase() as keyof typeof KEYS]);
    const newItems = items.map(item => (item.id === updatedItem.id ? updatedItem : item));
    saveToStorage(KEYS[entityType.toUpperCase() as keyof typeof KEYS], newItems);
    return updatedItem;
  },
  delete: (entityType: EntityType, id: string): void => {
    const items = getFromStorage<Entity>(KEYS[entityType.toUpperCase() as keyof typeof KEYS]);
    const newItems = items.filter(item => item.id !== id);
    saveToStorage(KEYS[entityType.toUpperCase() as keyof typeof KEYS], newItems);

    // Hierarchical delete
    if (entityType === 'blocks') {
      const sectorsToDelete = inventoryService.getSectorsByBlockId(id);
      sectorsToDelete.forEach(sector => inventoryService.delete('sectors', sector.id));
    } else if (entityType === 'sectors') {
      const roomsToDelete = inventoryService.getRoomsBySectorId(id);
      roomsToDelete.forEach(room => inventoryService.delete('rooms', room.id));
    } else if (entityType === 'rooms') {
      const assetsToDelete = inventoryService.getAssetsByRoomId(id);
      assetsToDelete.forEach(asset => inventoryService.delete('assets', asset.id));
    }
  },

  // --- Specific Getters for relationships ---
  getSectorsByBlockId: (blockId: string): Sector[] => {
    const allSectors = getFromStorage<Sector>(KEYS.SECTORS);
    return allSectors.filter(sector => sector.blockId === blockId);
  },
  getRoomsBySectorId: (sectorId: string): Room[] => {
    const allRooms = getFromStorage<Room>(KEYS.ROOMS);
    return allRooms.filter(room => room.sectorId === sectorId);
  },
  getAssetsByRoomId: (roomId: string): Asset[] => {
    const allAssets = getFromStorage<Asset>(KEYS.ASSETS);
    return allAssets.filter(asset => asset.roomId === roomId);
  },

  // --- Statistics ---
  getStats: () => {
     if (typeof window === 'undefined') return { assetCount: 0, activeAssetCount: 0, roomCount: 0, sectorCount: 0 };
     const assets = getFromStorage<Asset>(KEYS.ASSETS);
     const rooms = getFromStorage<Room>(KEYS.ROOMS);
     const sectors = getFromStorage<Sector>(KEYS.SECTORS);
     const activeAssetCount = assets.filter(a => a.status === 'Em Uso').length;
     return {
        assetCount: assets.length,
        activeAssetCount: activeAssetCount,
        roomCount: rooms.length,
        sectorCount: sectors.length
     }
  }
};

    