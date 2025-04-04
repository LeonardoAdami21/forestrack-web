// src/hooks/useEquipmentData.ts
import { useState, useEffect } from "react";
import {
  Equipment,
  EquipmentModel,
  Position,
  EquipmentState,
  EquipmentStateHistory,
  EquipmentWithDetails,
} from "../../interfaces/Types";
import axios from "axios";

export const useEquipmentData = () => {
  const [loading, setLoading] = useState(true);
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [equipmentModels, setEquipmentModels] = useState<EquipmentModel[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [states, setStates] = useState<EquipmentState[]>([]);
  const [stateHistory, setStateHistory] = useState<EquipmentStateHistory[]>([]);
  const [equipmentWithDetails, setEquipmentWithDetails] = useState<
    EquipmentWithDetails[]
  >([]);
  const [selectedEquipment, setSelectedEquipment] = useState<string | null>(
    null,
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          equipmentData,
          equipmentModelData,
          positionHistoryData,
          equipmentStateData,
          equipmentStateHistoryData,
        ] = await Promise.all([
          axios
            .get("/data/equipment.json")
            .then((res) => res.data)
            .catch((err) => {
              console.error("Erro ao carregar dados de equipamentos:", err);
              return [];
            }),
          axios
            .get("/data/equipmentModel.json")
            .then((res) => res.data)
            .catch((err) => {
              console.error(
                "Erro ao carregar dados de modelos de equipamentos:",
                err,
              );
              return [];
            }),
          axios
            .get("/data/equipmentPositionHistory.json")
            .then((res) => res.data)
            .catch((err) => {
              console.error("Erro ao carregar dados de posições:", err);
              return [];
            }),
          axios
            .get("/data/equipmentState.json")
            .then((res) => res.data)
            .catch((err) => {
              console.error("Erro ao carregar dados de estados:", err);
              return [];
            }),
          axios
            .get("/data/equipmentStateHistory.json")
            .then((res) => res.data)
            .catch((err) => {
              console.error(
                "Erro ao carregar dados de histórico de estados:",
                err,
              );
              return [];
            }),
        ]);

        setEquipment(equipmentData);
        setEquipmentModels(equipmentModelData);
        setPositions(positionHistoryData);
        setStates(equipmentStateData);
        setStateHistory(equipmentStateHistoryData);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Processar os dados para obter as informações combinadas de cada equipamento
  useEffect(() => {
    if (loading) return;

    const processedEquipment = equipment.map((equip) => {
      // Encontrar o modelo do equipamento
      const model = equipmentModels.find((model) => model.id === equip.modelId);

      // Encontrar a posição mais recente do equipamento
      const equipmentPositions = positions
        .filter((pos) => pos.equipmentId === equip.id)
        .sort(
          (a, b) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
        );

      const currentPosition =
        equipmentPositions.length > 0 ? equipmentPositions[0] : undefined;

      // Encontrar o histórico de estados do equipamento
      const equipmentStateHistoryEntries = stateHistory
        .filter((history) => history.equipmentId === equip.id)
        .sort(
          (a, b) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
        );

      // Estado atual
      const currentStateHistory =
        equipmentStateHistoryEntries.length > 0
          ? equipmentStateHistoryEntries[0]
          : undefined;

      const currentState = currentStateHistory
        ? {
            state: states.find(
              (state) => state.id === currentStateHistory.stateId,
            )!,
            since: currentStateHistory.timestamp,
          }
        : undefined;

      return {
        ...equip,
        model: model!,
        currentPosition,
        currentState,
      };
    });

    setEquipmentWithDetails(processedEquipment);
  }, [equipment, equipmentModels, positions, states, stateHistory, loading]);

  // Função para obter o histórico de estados de um equipamento específico
  const getEquipmentStateHistory = (equipmentId: string) => {
    if (loading) return [];

    const equipmentStateHistoryEntries = stateHistory
      .filter((history) => history.equipmentId === equipmentId)
      .sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
      );

    return equipmentStateHistoryEntries.map((historyEntry) => {
      const state = states.find((s) => s.id === historyEntry.stateId);
      return {
        id: historyEntry.id,
        state: state!,
        timestamp: historyEntry.timestamp,
      };
    });
  };

  return {
    loading,
    equipmentWithDetails,
    selectedEquipment,
    setSelectedEquipment,
    getEquipmentStateHistory,
  };
};
