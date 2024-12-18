import { User } from "@prisma/client";
import { AxiosError, AxiosResponse } from "axios";

export interface ResOk<T = undefined> {
  status: number;
  message: string;
  data: T;
}

export interface ResErr extends AxiosError {
  response?: AxiosResponse<ResOk>;
}

export interface AuthResponse extends User {
  accessToken: string;
}
