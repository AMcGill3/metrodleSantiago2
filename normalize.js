export function normalize(str) {
  if (!str) {
    return "";
  }
  return str
    .normalize("NFD")
    .replace(/(?<=[aeiouAEIOU])\u0301/g, "")
    .normalize("NFC")
    .toLowerCase()
    .replace(/\s+/g, "");
}
