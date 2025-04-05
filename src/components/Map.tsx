// src/components/Map.tsx
import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { EquipmentWithDetails } from "../interfaces/Types";
import EquipmentMarker from "./EquipmentMarker";
import { calculateBounds, calculateCenter } from "../utils/map.utils";

interface MapProps {
  equipment: EquipmentWithDetails[];
  selectedEquipment: string | null;
  onSelectEquipment: (id: string) => void;
}

const Map: React.FC<MapProps> = ({
  equipment,
  selectedEquipment,
  onSelectEquipment,
}) => {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  // Inicializar o mapa
  useEffect(() => {
    // ⬇️ Aqui você adiciona o check de equipment.length === 0
    if (!mapContainerRef.current || mapRef.current || equipment.length === 0)
      return;

    const positions = equipment
      .filter((e) => e.currentPosition)
      .map((e) => e.currentPosition!);

    const initialCenter = calculateCenter(positions);

    const map = L.map(mapContainerRef.current).setView(initialCenter, 10);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [equipment]);

  // Ajustar o mapa para mostrar todos os equipamentos
  useEffect(() => {
    if (!mapRef.current) return;

    // Se houver apenas um equipamento selecionado, centralizar nele
    if (selectedEquipment) {
      const selected = equipment.find((e) => e.id === selectedEquipment);
      if (selected && selected.currentPosition) {
        mapRef.current.setView(
          [
            selected.currentPosition.latitude,
            selected.currentPosition.longitude,
          ],
          14,
        );
        return;
      }
    }

    // Usar a função de utilidade para calcular os limites
    const bounds = calculateBounds(equipment);

    if (bounds && bounds.isValid() && equipment.length > 0) {
      mapRef.current.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [equipment, selectedEquipment]);

  return (
    <div ref={mapContainerRef} className="h-full w-full">
      {mapRef.current &&
        equipment.map(
          (equip) =>
            equip.currentPosition && (
              <EquipmentMarker
                key={equip.id}
                equipment={equip}
                map={mapRef.current!}
                isSelected={selectedEquipment === equip.id}
                onSelect={() => onSelectEquipment(equip.id)}
              />
            ),
        )}
    </div>
  );
};

export default Map;
