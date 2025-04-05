// src/App.tsx
import React, { useState } from "react";
import { useEquipmentData } from "./hooks/queries/useEquipmentData";
import Map from "./components/Map";
import Sidebar from "./components/Sidebar";
import EquipmentStateHistory from "./components/EquipmentStateHistory";

const App: React.FC = () => {
  const {
    loading,
    equipmentWithDetails,
    selectedEquipment,
    setSelectedEquipment,
    getEquipmentStateHistory,
  } = useEquipmentData();

  const [showHistory, setShowHistory] = useState(false);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-lg">Carregando dados...</p>
        </div>
      </div>
    );
  }

  const selectedEquipmentData = selectedEquipment
    ? equipmentWithDetails.find((e) => e.id === selectedEquipment)
    : null;

  const stateHistory = selectedEquipment
    ? getEquipmentStateHistory(selectedEquipment)
    : [];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Barra lateral (30% da largura) */}
      <div className="w-1/4 h-full">
        <Sidebar
          equipment={equipmentWithDetails}
          selectedEquipment={selectedEquipment}
          onSelectEquipment={(id) => {
            setSelectedEquipment(id);
            setShowHistory(true);
          }}
        />
      </div>

      {/* Área do mapa */}
      <div className="flex-1 h-full relative">
        <Map
          equipment={equipmentWithDetails}
          selectedEquipment={selectedEquipment}
          onSelectEquipment={(id) => {
            setSelectedEquipment(id);
            setShowHistory(true);
          }}
        />

        {/* Painel de histórico de estados (visível quando um equipamento é selecionado) */}
        {showHistory && selectedEquipmentData && (
          <div className="absolute top-4 right-4 w-80 max-h-full overflow-hidden">
            <EquipmentStateHistory
              equipment={selectedEquipmentData}
              stateHistory={stateHistory}
              onClose={() => setShowHistory(false)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
