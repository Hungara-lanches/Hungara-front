import { getCookie } from "cookies-next";

export function getClientJWTCookie() {
  return getCookie("token");
}
