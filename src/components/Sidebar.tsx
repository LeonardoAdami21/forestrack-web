// src/components/Sidebar.tsx
import React from "react";
import { EquipmentWithDetails } from "../interfaces/Types";

interface SidebarProps {
  equipment: EquipmentWithDetails[];
  selectedEquipment: string | null;
  onSelectEquipment: (id: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  equipment,
  selectedEquipment,
  onSelectEquipment,
}) => {
  // Agrupar equipamentos por tipo
  const groupedByType = equipment.reduce(
    (groups, equip) => {
      const type = equip.model.type;
      if (!groups[type]) {
        groups[type] = [];
      }
      groups[type].push(equip);
      return groups;
    },
    {} as Record<string, EquipmentWithDetails[]>,
  );

  return (
    <div className="bg-white h-full overflow-y-auto shadow-md p-4">
      <h2 className="text-xl font-bold mb-4">Equipamentos</h2>

      {Object.entries(groupedByType).map(([type, equipList]) => (
        <div key={type} className="mb-4">
          <h3 className="font-bold text-gray-700 mb-2">{type}</h3>
          <ul className="space-y-2">
            {equipList.map((equip) => (
              <li
                key={equip.id}
                className={`
                  p-2 rounded cursor-pointer transition-colors
                  ${
                    selectedEquipment === equip.id
                      ? "bg-blue-100 border-l-4 border-blue-500"
                      : "hover:bg-gray-100"
                  }
                `}
                onClick={() => onSelectEquipment(equip.id)}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{equip.name}</span>
                  {equip.currentState && (
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{
                        backgroundColor: equip.currentState.state.color,
                      }}
                      title={equip.currentState.state.name}
                    />
                  )}
                </div>
                <div className="text-sm text-gray-600">{equip.model.name}</div>
                {equip.currentState && (
                  <div
                    className="text-xs mt-1"
                    style={{ color: equip.currentState.state.color }}
                  >
                    {equip.currentState.state.name}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default Sidebar;
