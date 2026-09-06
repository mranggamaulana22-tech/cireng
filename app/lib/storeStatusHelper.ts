export type StoreStatusData = {
  status: string; // "AUTO" | "OPEN" | "CLOSED"
  operating_open_time: string;
  operating_close_time: string;
};

function parseTimeToMinutes(time: string): number {
  const parts = time.split(".");
  const hour = parseInt(parts[0], 10) || 0;
  const minute = parseInt(parts[1], 10) || 0;
  return hour * 60 + minute;
}

export function computeIsOpen(data: StoreStatusData): boolean {
  if (data.status === "OPEN") return true;
  if (data.status === "CLOSED") return false;

  // Mode AUTO: hitung dari jam sekarang
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const openMinutes = parseTimeToMinutes(data.operating_open_time);
  const closeMinutes = parseTimeToMinutes(data.operating_close_time);

  return currentMinutes >= openMinutes && currentMinutes < closeMinutes;
}