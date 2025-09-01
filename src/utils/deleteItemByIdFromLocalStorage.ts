// Elimina un objeto por id dentro de un array almacenado en localStorage bajo una key dada
export function deleteItemByIdFromLocalStorage<T extends { id: number }>(
  key: string,
  id: number,
) {
  const data = localStorage.getItem(key);
  if (!data) return;
  try {
    const arr: T[] = JSON.parse(data);
    if (!Array.isArray(arr)) return;
    const filtered = arr.filter((item) => item.id !== id);
    localStorage.setItem(key, JSON.stringify(filtered));
  } catch (e) {
    // opcional: manejar error
    console.error("Error deleting item from localStorage", e);
  }
}
