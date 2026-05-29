import axios from "axios";
import type {
  User,
  CreateUserDto,
  SignInDto,
  Character,
  CreateCharacterDto,
  UpdateCharacterDto,
  ComputedStats,
  Spell,
  CreateSpellDto,
  UpdateSpellDto,
  TemplateResult,
  CasterTemplate,
} from "../types";
import { QueryClient } from "@tanstack/react-query";
import { AUTH_KEY } from "../hooks/auth/useCurrentUser";

const http = axios.create({ baseURL: "/api", withCredentials: true });

// ---

export function setupInterceptors(qc: QueryClient) {
  http.interceptors.response.use(
    (res) => res,
    (err) => {
      if (err.response?.status === 401) {
        qc.setQueryData(AUTH_KEY, null);
        qc.clear();
      }
      return Promise.reject(err);
    }
  );
}

// ── Auth ──────────────────────────────────────────────────────────────────────

export const authApi = {
  signUp: (dto: CreateUserDto) =>
    http.post<User>("/auth/signup", dto).then((r) => r.data),

  signIn: (dto: SignInDto) =>
    http.post<User>("/auth/signin", dto).then((r) => r.data),

  signOut: () => http.post("/auth/signout"),

  whoAmI: () => http.get<User>("/auth/whoami").then((r) => r.data),
};

// ── Characters ────────────────────────────────────────────────────────────────

export const charactersApi = {
  list: () => http.get<Character[]>("/characters").then((r) => r.data),

  get: (id: number) =>
    http.get<Character>(`/characters/${id}`).then((r) => r.data),

  computed: (id: number) =>
    http.get<ComputedStats>(`/characters/${id}/computed`).then((r) => r.data),

  create: (dto: CreateCharacterDto) =>
    http.post<Character>("/characters/create", dto).then((r) => r.data),

  update: (id: number, dto: UpdateCharacterDto) =>
    http.put<Character>(`/characters/update/${id}`, dto).then((r) => r.data),

  remove: (id: number) => http.delete(`/characters/delete/${id}`),

  duplicate: (id: number, name: string) =>
    http
      .post<Character>(`/characters/${id}/duplicate`, { name })
      .then((r) => r.data),

  shortRest: (id: number) =>
    http.post<Character>(`/characters/${id}/rest/short`).then((r) => r.data),

  longRest: (id: number) =>
    http.post<Character>(`/characters/${id}/rest/long`).then((r) => r.data),
};

// ── Spells ────────────────────────────────────────────────────────────────────

export const spellsApi = {
  list: () => http.get<Spell[]>("/spells").then((r) => r.data),

  get: (id: number) => http.get<Spell>(`/spells/${id}`).then((r) => r.data),

  create: (dto: CreateSpellDto) =>
    http.post<Spell>("/spells/create", dto).then((r) => r.data),

  update: (id: number, dto: UpdateSpellDto) =>
    http.put<Spell>(`/spells/update/${id}`, dto).then((r) => r.data),

  remove: (id: number) => http.delete(`/spells/delete/${id}`),

  replaceAll: (spells: CreateSpellDto[]) =>
    http.post<Spell[]>("/spells/replaceAll", { spells }).then((r) => r.data),

  template: (casterType: CasterTemplate, charLevel: number) =>
    http
      .post<TemplateResult>("/spells/template", { casterType, charLevel })
      .then((r) => r.data),
};

// ── Users ─────────────────────────────────────────────────────────────────────

export interface UpdateUserDto {
  username?: string;
  email?: string;
  password?: string;
}

export const userApi = {
  me: () => http.get<User>("/users/me").then((r) => r.data),
  update: (dto: UpdateUserDto) =>
    http.put<User>("/users/me", dto).then((r) => r.data),
};
