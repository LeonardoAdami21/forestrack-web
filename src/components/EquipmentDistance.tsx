// src/components/EquipmentDistance.tsx
import React from "react";
import { Position } from "../interfaces/Types";
import { calculateDistance } from "../utils/map.utils";

interface EquipmentDistanceProps {
  positionHistory: Position[];
}

const EquipmentDistance: React.FC<EquipmentDistanceProps> = ({
  positionHistory,
}) => {
  // Ordenar histórico de posições por timestamp
  const sortedPositions = [...positionHistory].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
  );

  // Calcular distância total percorrida
  let totalDistance = 0;

  for (let i = 1; i < sortedPositions.length; i++) {
    const currentPos = sortedPositions[i];
    const prevPos = sortedPositions[i - 1];

    const distance = calculateDistance(prevPos, currentPos);
    totalDistance += distance;
  }

  // Formatar para exibição em km se for grande, ou em metros se for pequena
  const formattedDistance =
    totalDistance >= 1000
      ? `${(totalDistance / 1000).toFixed(2)} km`
      : `${Math.round(totalDistance)} m`;

  return (
    <div className="mt-4 p-3 bg-gray-50 rounded">
      <h3 className="font-bold text-lg">Análise de Movimento</h3>
      <p>Distância total percorrida: {formattedDistance}</p>
      <p>Número de registros de posição: {sortedPositions.length}</p>
      {sortedPositions.length > 0 && (
        <>
          <p>
            Primeiro registro:{" "}
            {new Date(sortedPositions[0].timestamp).toLocaleString()}
          </p>
          <p>
            Último registro:{" "}
            {new Date(
              sortedPositions[sortedPositions.length - 1].timestamp,
            ).toLocaleString()}
          </p>
        </>
      )}
    </div>
  );
};

export default EquipmentDistance;
