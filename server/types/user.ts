export interface UserData {
  uid: string;
  login: string;
  email: string;
  createdAt: number;
  lastLoginAt: number;
  showLastLogin: boolean;
  avatar?: string;
  nickname?: string;
  password?: string;
  method: "default" | "google" | "github";
  fullname?: {
    lastname?: string;
    name?: string;
    surname?: string;
  };
}

export interface UserDataFull {
  user: UserData;
  theme: "dark" | "light";
}
