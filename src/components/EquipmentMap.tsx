import { LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { useEquipments } from "../hooks/queries/useEquipmentData";
import { useFilters } from "../hooks/queries/useFilters";
import { SearchBar } from "./SearchBar";
import { SelectFilter } from "./SelectFilter";
import { CheckboxGroup } from "./CheckboxGroup";
import { useState } from "react";

const EquipmentMap = () => {
  const {
    equipment,
    equipmentPositionHistory,
    equipmentStates,
    equipmentStateHistory,
    ready,
  } = useEquipments();

  const {
    filtered,
    filters: {
      search,
      setSearch,
      modelFilter,
      setModelFilter,
      stateFilter,
      setStateFilter,
    },
  } = useFilters({
    equipment,
    equipmentStates,
    equipmentStateHistory,
  });

  const [selectedEquipmentId, setSelectedEquipmentId] = useState<string | null>(null);
  
  if (selectedEquipmentId) {
    const selectedEquipment = equipment.find((eq) => eq.id === selectedEquipmentId);
    if (selectedEquipment) {
      // Do something with the selected equipment
      console.log("Selected Equipment:", selectedEquipment);
    }
  }
  //const [filteredEquipment, setFilteredEquipment] = useState(equipment);
  if (!ready) return <p>Carregando...</p>;

  const getLatestPosition = (equipmentId: string) => {
    const history = equipmentPositionHistory.find(
      (p) => p.equipmentId === equipmentId,
    );
    if (!history) return null;
    const latest = history.positions.at(-1);
    return latest ? ([latest.lat, latest.lon] as LatLngExpression) : null;
  };

  const getLatestState = (equipmentId: string) => {
    const history = equipmentStateHistory.find(
      (s) => s.equipmentId === equipmentId,
    );
    if (!history) return null;
    const latest = history.states.at(-1);
    if (!latest) return null;
    const state = equipmentStates.find((e) => e.id === latest.equipmentStateId);
    return state?.name ?? "Desconhecido";
  };

  return (
    <MapContainer center={[-19.0, -45.9]} zoom={8} className="h-screen w-full">
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {filtered.map((eq) => {
        const pos = getLatestPosition(eq.id);
        const state = getLatestState(eq.id);
        if (!pos) return null;

        return (
          <Marker
            key={eq.id}
            position={pos}
            eventHandlers={{
              click: () => setSelectedEquipmentId(eq.id),
            }}
          >
            <Popup>
              <strong>{eq.name}</strong>
              <br />
              Estado atual: {state}
            </Popup>
          </Marker>
        );
      })}

      {equipment.map((eq) => {
        const pos = getLatestPosition(eq.id);
        const state = getLatestState(eq.id);
        if (!pos) return null;
        return (
          <Marker key={eq.id} position={pos}>
            <Popup>
              <strong>{eq.name}</strong>
              <br />
              Estado atual: {state}
            </Popup>
          </Marker>
        );
      })}
      <div className="p-4 bg-white shadow rounded-md space-y-2 z-[999] absolute top-4 left-4 w-80">
        <SearchBar value={search} onChange={setSearch} />
        <SelectFilter
          options={equipment.map((eq) => ({
            id: eq.id,
            name: eq.name,
          }))}
          value={modelFilter}
          onChange={setModelFilter}
        />
        <CheckboxGroup
          options={equipmentStates.map((state) => ({
            id: state.id,
            name: state.name,
            color: state.color,
          }))}
          selected={stateFilter}
          onChange={setStateFilter}
        />
      </div>
    </MapContainer>
  );
};

export default EquipmentMap;
