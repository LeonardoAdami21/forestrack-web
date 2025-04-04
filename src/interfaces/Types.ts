// src/types/index.ts

export interface Equipment {
  id: string;
  name: string;
  modelId: string;
}

export interface EquipmentModel {
  id: string;
  name: string;
  type: string;
}

export interface Position {
  id: string;
  equipmentId: string;
  latitude: number;
  longitude: number;
  timestamp: string;
}

export interface EquipmentState {
  id: string;
  name: string;
  color: string; // Cor para representação visual no mapa
}

export interface EquipmentStateHistory {
  id: string;
  equipmentId: string;
  stateId: string;
  timestamp: string;
}

// Tipos combinados para uso na aplicação
export interface EquipmentWithDetails {
  id: string;
  name: string;
  model: EquipmentModel;
  currentPosition?: Position;
  currentState?: {
    state: EquipmentState;
    since: string;
  };
}
// src/types/index.ts

export interface Equipment {
  id: string;
  name: string;
  modelId: string;
}

export interface EquipmentModel {
  id: string;
  name: string;
  type: string;
}

export interface Position {
  id: string;
  equipmentId: string;
  latitude: number;
  longitude: number;
  timestamp: string;
}

export interface EquipmentState {
  id: string;
  name: string;
  color: string; // Cor para representação visual no mapa
}

export interface EquipmentStateHistory {
  id: string;
  equipmentId: string;
  stateId: string;
  timestamp: string;
}

// Tipos combinados para uso na aplicação
export interface EquipmentWithDetails {
  id: string;
  name: string;
  model: EquipmentModel;
  currentPosition?: Position;
  currentState?: {
    state: EquipmentState;
    since: string;
  };
}
