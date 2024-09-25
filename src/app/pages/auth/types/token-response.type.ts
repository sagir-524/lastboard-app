import { User } from "./user.type";

export type TokenResponse = {
  type: "bearer";
  token: string;
  refreshToken: string;
  user: User;
};
