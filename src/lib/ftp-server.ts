import { FtpSrv } from "ftp-srv";
import { getFTPUser } from "./db/query";
import path from "path";
import { existsSync, mkdirSync } from "fs";

export function FTPServer({ port }: { port: number }) {
  const ftpServer = new FtpSrv({
    url: `ftp://0.0.0.0:${port}`,
    anonymous: false,
  });

  ftpServer.on("login", async ({ username, password }, resolve, reject) => {
    try {
      const ftpUser = await getFTPUser(username, password);

      if (!ftpUser.active) {
        console.error("User is not active");
        return reject(new Error("User is not active"));
      }

      //check if rootDir exists and try to create it
      const rootDir = path.join(process.cwd(), ftpUser.rootDir!);
      if (!existsSync(rootDir)) {
        console.log("Creating root directory:", rootDir);
        try {
          await mkdirSync(rootDir, { recursive: true });
        } catch (err) {
          console.error("Error creating root directory:", err);
          return reject(new Error("Error creating root directory"));
        }
      }

      return resolve({
        root: path.join(process.cwd(), ftpUser.rootDir!),
      });
    } catch (error) {
      console.error("Login error:", error);
      return reject(new Error("Login error"));
    }
  });

  ftpServer.on("client-error", (error) => {
    console.error("Cllient server error:", error);
  });

  return ftpServer.listen().then(() => {
    console.log(`FTP server listening on port ${port}`);
  });
}

export default FTPServer;
