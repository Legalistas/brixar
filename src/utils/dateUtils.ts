// utils/dateUtils.ts

export const getStartOfDay = (date: Date): Date => {
  const localDate = new Date(date);
  localDate.setHours(0, 0, 0, 0);
  return localDate;
};

export const getEndOfDay = (startOfDay: Date): Date => {
  const localEndDate = new Date(startOfDay);
  localEndDate.setHours(23, 59, 59, 999);
  return localEndDate;
};

export const getStartOfWeek = (date: Date): Date => {
  const startOfWeek = new Date(date);
  startOfWeek.setHours(0, 0, 0, 0);
  startOfWeek.setDate(date.getDate() - date.getDay());
  return startOfWeek;
};

export const getEndOfWeek = (startOfWeek: Date): Date => {
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);
  return endOfWeek;
};
