// src/utils/mapUtils.ts
import L from "leaflet";
import { Position, EquipmentWithDetails } from "../interfaces/Types";

/**
 * Calcula o centro de um conjunto de posições
 */
export const calculateCenter = (positions: Position[]): L.LatLngExpression => {
  if (positions.length === 0) {
    // Coordenadas padrão (pode ser ajustado para uma localização relevante para sua operação)
    return [-23.5505, -46.6333]; // São Paulo, Brasil como padrão
  }

  const lat =
    positions.reduce((sum, pos) => sum + pos.latitude, 0) / positions.length;
  const lng =
    positions.reduce((sum, pos) => sum + pos.longitude, 0) / positions.length;

  return [lat, lng];
};

/**
 * Calcula os limites (bounds) para um conjunto de equipamentos
 */
export const calculateBounds = (
  equipment: EquipmentWithDetails[],
): L.LatLngBounds | null => {
  const positions = equipment
    .filter((e) => e.currentPosition)
    .map((e) => e.currentPosition!);

  if (positions.length === 0) {
    return null;
  }

  const bounds = L.latLngBounds([]);

  positions.forEach((pos) => {
    bounds.extend([pos.latitude, pos.longitude]);
  });

  return bounds;
};

/**
 * Calcula a distância entre duas posições em metros
 */
export const calculateDistance = (pos1: Position, pos2: Position): number => {
  const lat1 = pos1.latitude;
  const lon1 = pos1.longitude;
  const lat2 = pos2.latitude;
  const lon2 = pos2.longitude;

  // Usando a fórmula de Haversine
  const R = 6371000; // Raio da Terra em metros
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return distance;
};

/**
 * Converte graus para radianos
 */
const toRadians = (degrees: number): number => {
  return degrees * (Math.PI / 180);
};

/**
 * Gera uma cor para um marcador com base no estado
 */
export const getMarkerColor = (
  stateId: string,
  states: { id: string; color: string }[],
): string => {
  const state = states.find((s) => s.id === stateId);
  return state ? state.color : "#999999"; // Cor padrão caso não encontre o estado
};

/**
 * Formata um timestamp para exibição
 */
export const formatTimestamp = (timestamp: string): string => {
  return new Date(timestamp).toLocaleString();
};

/**
 * Calcula a duração entre dois timestamps em formato legível
 */
export const calculateDuration = (start: string, end?: string): string => {
  const startDate = new Date(start);
  const endDate = end ? new Date(end) : new Date();

  const diffMs = endDate.getTime() - startDate.getTime();
  const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  return `${diffHrs}h ${diffMins}m`;
};
