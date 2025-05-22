import { LosaAdminDB } from "./database";

export async function getFTPUser(username: string, password: string) {
  const ftpUser = await LosaAdminDB.selectFrom("ftp_user")
    .selectAll()
    .where("user", "=", username)
    .where("password", "=", password)
    .executeTakeFirst();

  if (!ftpUser) {
    throw new Error("Invalid username or password");
  }

  return ftpUser;
}

export async function getUserByPrefix(path: string) {
  const user = await LosaAdminDB.selectFrom("ftp_user")
    .where("user", "=", path)
    .select(["user", "rootDir"])
    .executeTakeFirst();

  return user;
}
