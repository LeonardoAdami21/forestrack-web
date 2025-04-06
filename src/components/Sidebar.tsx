import {
  Equipment,
  EquipmentModel,
  EquipmentState,
  EquipmentStateHistory,
} from "../interfaces/Types";
import { formatDate } from "../utils/map.utils";
import {
  calculateProductivity,
  calculateTotalEarnings,
} from "../utils/map.utils";

interface Props {
  equipment: Equipment;
  model: EquipmentModel;
  stateHistory: EquipmentStateHistory;
  states: EquipmentState[];
  onClose: () => void;
  hourlyEarnings: number;
}

export const EquipmentSidebar = ({
  equipment,
  model,
  stateHistory,
  states,
  onClose,
}: Props) => {
  const productivity = calculateProductivity(stateHistory, states);
  const totalEarnings = calculateTotalEarnings(stateHistory, model, states);

  return (
    <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-lg p-4 overflow-y-auto z-50">
      <button onClick={onClose} className="text-sm text-red-500 float-right">
        Fechar
      </button>
      <h2 className="text-xl font-bold mb-2">{equipment.name}</h2>
      <p className="text-sm text-gray-500 mb-4">{model.name}</p>

      <h3 className="text-md font-semibold mt-4">Histórico de Estados</h3>
      <ul className="text-sm text-gray-700 space-y-1 mt-2">
        {stateHistory.states.map((s, idx) => {
          const state = states.find((e) => e.id === s.equipmentStateId);
          return (
            <li key={idx} className="flex justify-between">
              <span>{formatDate(s.date)}</span>
              <span style={{ color: state?.color }}>{state?.name}</span>
            </li>
          );
        })}
      </ul>

      <div className="mt-6">
        <h3 className="font-bold text-sm">Produtividade:</h3>
        <p className="text-green-700">{productivity.toFixed(1)}%</p>

        <h3 className="font-bold text-sm mt-2">Ganho total:</h3>
        <p className="text-blue-700">R$ {totalEarnings.toFixed(2)}</p>
      </div>
    </div>
  );
};
