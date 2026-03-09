import { apiFetch } from "./index";

export async function getMe() {
  const self = await apiFetch.get("/users/me");
  return self;
}
