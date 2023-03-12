export function removeEmptyObjectProperties(obj: object) {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, value]) => value !== "" && value != null)
  );
}
