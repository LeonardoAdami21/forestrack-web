import { useEffect, useState } from "react";
import {
  Equipment,
  EquipmentModel,
  EquipmentPositionHistory,
  EquipmentState,
  EquipmentStateHistory,
} from "../../interfaces/Types";
import equipment from "../../data/equipment.json";
import equipmentModels from "../../data/equipmentModel.json";
import equipmentPositions from "../../data/equipmentPositionHistory.json";
import equipmentStates from "../../data/equipmentState.json";
import equipmentStateHistory from "../../data/equipmentStateHistory.json";

export function useEquipments() {
  const [ready, setReady] = useState(false);

  const [data, setData] = useState({
    equipment: equipment as Equipment[],
    equipmentModels: equipmentModels as EquipmentModel[],
    equipmentStates: equipmentStates as EquipmentState[],
    equipmentPositionHistory: equipmentPositions as EquipmentPositionHistory[],
    equipmentStateHistory: equipmentStateHistory as EquipmentStateHistory[],
  });

  useEffect(() => {
    // Simulate an API call
    if (ready) return;
    // Simulate a delay
    const timeout = setTimeout(() => {
      setReady(true);
    }, 1000);
    return () => clearTimeout(timeout);
  }, [ready]);

  useEffect(() => {
    // Simulate an API call
    const timeout = setTimeout(() => {
      setData({
        equipment: equipment as Equipment[],
        equipmentModels: equipmentModels as EquipmentModel[],
        equipmentStates: equipmentStates as EquipmentState[],
        equipmentPositionHistory: equipmentPositions as EquipmentPositionHistory[],
        equipmentStateHistory: equipmentStateHistory as EquipmentStateHistory[],
      });
      setReady(true);
    })

    // Cleanup function to clear the timeout
    return () => clearTimeout(timeout);
  }, [ready]);

  return { ...data, ready };
}
