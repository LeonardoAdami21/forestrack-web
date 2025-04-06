import {
  EquipmentModel,
  EquipmentState,
  EquipmentStateHistory,
} from "../interfaces/Types";

export const calculateProductivity = (
  history: EquipmentStateHistory,
  states: EquipmentState[],
): number => {
  const totalHours = history.states.length;
  const operatingState = states.find(
    (s) => s.name.toLowerCase() === "operando",
  );
  if (!operatingState) return 0;
  const operatingHours = history.states.filter(
    (s) => s.equipmentStateId === operatingState.id,
  ).length;
  return (operatingHours / totalHours) * 100;
};

export const calculateTotalEarnings = (
  history: EquipmentStateHistory,
  model: EquipmentModel,
  states: EquipmentState[],
): number => {
  return history.states.reduce((total, s) => {
    const earning = model.hourlyEarnings.find(
      (e) => e.equipmentStateId === s.equipmentStateId,
    );
    const state = states.find((e) => e.id === s.equipmentStateId);
    if (!earning || !state) return total;
    const stateDate = new Date(s.date);
    const nextStateDate = new Date(
      history.states[history.states.indexOf(s) + 1]?.date ?? new Date(),
    );
    const hours = (nextStateDate.getTime() - stateDate.getTime()) / 3600000;
    const earningValue = earning.value * hours;
    const stateEarnings =
      earningValue * (state.name.toLowerCase() === "operando" ? 1 : 0);
    return total + stateEarnings;
  }, 0);
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("pt-BR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};
export const formatDateToISO = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toISOString();
};
export const formatDateToISOWithoutTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toISOString().split("T")[0];
};
export const formatDateToISOWithTime = (dateString: string): string => {
  const date = new Date(dateString);
  return (
    date.toISOString().split("T")[0] +
    " " +
    date.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    })
  );
};
