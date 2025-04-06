import { useMemo, useState } from "react";
import {
  Equipment,
  EquipmentModel,
  EquipmentState,
  EquipmentStateHistory,
} from "../../interfaces/Types";

interface Params {
  equipment: Equipment[];
  equipmentModels?: EquipmentModel[];
  equipmentStates: EquipmentState[];
  equipmentStateHistory: EquipmentStateHistory[];
}

export function useFilters({
  equipment,
  equipmentModels,
  equipmentStateHistory,
}: Params) {
  const [search, setSearch] = useState("");
  const [modelFilter, setModelFilter] = useState("");
  const [stateFilter, setStateFilter] = useState<string[]>([]);

  const filtered = useMemo(() => {
    return equipment.filter((eq) => {
      const matchesSearch = eq.name
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesModel =
        modelFilter === "" || eq.equipmentModelId === modelFilter;

      const latestState = equipmentStateHistory
        .find((h) => h.equipmentId === eq.id)
        ?.states.at(-1)?.equipmentStateId;
      const matchesState =
        stateFilter.length === 0 ||
        (latestState && stateFilter.includes(latestState));

      return matchesSearch && matchesModel && matchesState;
    });
  }, [
    equipment,
    equipmentStateHistory,
    equipmentModels,
    search,
    modelFilter,
    stateFilter,
  ]);

  return {
    filtered,
    filters: {
      search,
      setSearch,
      modelFilter,
      setModelFilter,
      stateFilter,
      setStateFilter,
    },
  };
}
