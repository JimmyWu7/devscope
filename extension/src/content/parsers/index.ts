import { parseLinkedIn } from "./linkedin";
import { parseHandshake } from "./handshake";

export function detectAndParse() {
  const hostname = window.location.hostname;

  if (hostname.includes("linkedin.com")) {
    return parseLinkedIn();
  }

  if (hostname.includes("joinhandshake.com")) {
    return parseHandshake();
  }

  return null;
}
