export function getSessionId(): string {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem("plandrop-session-id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("plandrop-session-id", id);
  }
  return id;
}