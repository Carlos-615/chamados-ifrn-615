export function formatDateBR(dateString) {
  if (!dateString) return "—";
  const parts = dateString.split("-");
  if (parts.length === 3) {
    const [year, month, day] = parts;
    return `${day}/${month}/${year}`;
  }
  try {
    const d = new Date(dateString);
    if (!isNaN(d.getTime())) {
      return d.toLocaleDateString("pt-BR", { timeZone: "UTC" });
    }
  } catch {
    // fallback
  }
  return dateString;
}

export function getTodayISODate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
