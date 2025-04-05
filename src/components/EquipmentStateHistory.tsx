// src/components/EquipmentStateHistory.tsx
import React from "react";
import { EquipmentWithDetails } from "../interfaces/Types";
import { formatTimestamp, calculateDuration } from "../utils/map.utils";

interface HistoryItem {
  id: string;
  state: {
    id: string;
    name: string;
    color: string;
  };
  timestamp: string;
}

interface EquipmentStateHistoryProps {
  equipment: EquipmentWithDetails | null;
  stateHistory: HistoryItem[];
  onClose: () => void;
}

const EquipmentStateHistory: React.FC<EquipmentStateHistoryProps> = ({
  equipment,
  stateHistory,
  onClose,
}) => {
  if (!equipment) return null;

  return (
    <div className="bg-white rounded shadow p-4 max-h-screen overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">
          Histórico de Estados: {equipment.name}
        </h2>
        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded">
          X
        </button>
      </div>

      <div className="mb-4">
        <p>
          <strong>Modelo:</strong> {equipment.model.name}
        </p>
        <p>
          <strong>Tipo:</strong> {equipment.model.type}
        </p>
        <p>
          <strong>Estado atual:</strong>{" "}
          <span
            className="font-bold"
            style={{ color: equipment.currentState?.state.color }}
          >
            {equipment.currentState?.state.name || "Desconhecido"}
          </span>
        </p>
      </div>

      <div className="border-t pt-4">
        <h3 className="font-bold mb-2">Histórico:</h3>
        <ul className="space-y-4">
          {stateHistory.map((item, index) => {
            const nextItem = stateHistory[index + 1];

            // Usar as funções de utilidade para formatação
            const formattedTime = formatTimestamp(item.timestamp);
            const duration = calculateDuration(
              item.timestamp,
              nextItem?.timestamp,
            );

            return (
              <li key={item.id} className="border-b pb-3">
                <div className="flex items-center">
                  <div
                    className="w-4 h-4 rounded-full mr-2"
                    style={{ backgroundColor: item.state.color }}
                  />
                  <span className="font-bold">{item.state.name}</span>
                </div>
                <div className="text-sm text-gray-600 ml-6">
                  <p>Início: {formattedTime}</p>
                  <p>Duração: {duration}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default EquipmentStateHistory;
