/**
 * This file was generated by kysely-codegen.
 * Please do not edit it manually.
 */

import type { ColumnType } from "kysely";

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;

export interface ServiceSecurityKey {
  idx: Generated<number>;
  regDate: Date | null;
  token: string | null;
  type: string | null;
}

export interface FTPUser {
  idx: Generated<number>;
  user: string | null;
  password: string | null;
  rootDir: string | null;
  active: number | null;
}

export interface LosaAdmin {
  service_security_key: ServiceSecurityKey;
  ftp_user: FTPUser;
}
