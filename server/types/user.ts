export interface UserData {
  uid: string;
  login: string;
  email: string;
  createdAt: number;
  lastLoginAt: number;
  nickname?: string;
  password?: string;
  method: "default" | "google" | "github";
}

export interface UserDataFull {
  user: UserData;
  theme: "dark" | "light";
  avatar?: string;
}
