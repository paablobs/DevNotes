// Genera un id único simple basado en timestamp y un random
export function generateId() {
  return Date.now() + Math.floor(Math.random() * 1000000);
}
