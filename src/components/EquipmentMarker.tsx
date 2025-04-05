// src/components/EquipmentMarker.tsx
import React, { useEffect, useState } from "react";
import L from "leaflet";
import { EquipmentWithDetails } from "../interfaces/Types";
import { formatTimestamp } from "../utils/map.utils";

interface EquipmentMarkerProps {
  equipment: EquipmentWithDetails;
  map: L.Map;
  isSelected: boolean;
  onSelect: () => void;
}

const EquipmentMarker: React.FC<EquipmentMarkerProps> = ({
  equipment,
  map,
  isSelected,
  onSelect,
}) => {
  const [marker, setMarker] = useState<L.Marker | null>(null);

  useEffect(() => {
    if (!equipment.currentPosition) return;

    // Criar um novo marcador
    const position = L.latLng(
      equipment.currentPosition.latitude,
      equipment.currentPosition.longitude,
    );

    // Definir o ícone do marcador com base no estado e seleção
    const stateColor = equipment.currentState?.state.color || "#999999";
    const iconSize = isSelected ? 30 : 25;

    const icon = L.divIcon({
      className: "custom-div-icon",
      html: `
        <div style="
          background-color: ${stateColor}; 
          width: ${iconSize}px; 
          height: ${iconSize}px; 
          border-radius: 50%; 
          display: flex; 
          align-items: center; 
          justify-content: center;
          border: 2px solid ${isSelected ? "#FFFFFF" : stateColor};
          box-shadow: 0 0 ${isSelected ? "8px 4px" : "0"} ${stateColor};
        ">
          <span style="
            color: white; 
            font-weight: bold; 
            font-size: ${isSelected ? "14px" : "12px"};
            text-shadow: 1px 1px 1px rgba(0,0,0,0.5);
          ">
            ${equipment.name.charAt(0)}
          </span>
        </div>
      `,
      iconSize: [iconSize, iconSize],
      iconAnchor: [iconSize / 2, iconSize / 2],
    });

    const newMarker = L.marker(position, { icon }).addTo(map);

    // Usar formatTimestamp para formatar a data no popup
    const formattedTimestamp = equipment.currentState?.since
      ? formatTimestamp(equipment.currentState.since)
      : "Desconhecido";

    // Adicionar popup com informações do equipamento
    const popup = L.popup({
      closeButton: false,
      offset: [0, -10],
      className: "custom-popup",
    }).setContent(`
      <div>
        <h3 class="font-bold">${equipment.name}</h3>
        <p><strong>Modelo:</strong> ${equipment.model.name}</p>
        <p><strong>Tipo:</strong> ${equipment.model.type}</p>
        <p><strong>Estado:</strong> <span style="color:${stateColor}">
          ${equipment.currentState?.state.name || "Desconhecido"}
        </span></p>
        <p><strong>Desde:</strong> ${formattedTimestamp}</p>
        <button class="px-2 py-1 mt-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Ver Histórico
        </button>
      </div>
    `);

    // Mostrar popup ao passar o mouse
    newMarker.bindPopup(popup);
    newMarker.on("mouseover", () => {
      newMarker.openPopup();
    });

    // Adicionar evento de clique para selecionar o equipamento
    newMarker.on("click", () => {
      onSelect();
    });

    setMarker(newMarker);

    // Limpar o marcador ao desmontar
    return () => {
      if (newMarker) {
        newMarker.removeFrom(map);
      }
    };
  }, [equipment, map, isSelected, onSelect]);

  // Atualizar a posição do marcador se mudar
  useEffect(() => {
    if (marker && equipment.currentPosition) {
      marker.setLatLng(
        L.latLng(
          equipment.currentPosition.latitude,
          equipment.currentPosition.longitude,
        ),
      );
    }
  }, [marker, equipment.currentPosition]);

  return null; // Este componente não renderiza nada diretamente no DOM
};

export default EquipmentMarker;
