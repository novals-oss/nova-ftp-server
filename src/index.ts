import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { Hono } from "hono";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import FTPServer from "./lib/ftp-server";
import { getUserByPrefix } from "./lib/db/query";
import path from "path";
import fs from "fs/promises";

const app = new Hono();
app.use("*", logger());
app.use("*", prettyJSON());

app.use("/patch/*", async (c, next) => {
  const requestPath = c.req.path;
  const segments = requestPath.split("/");

  const userPrefix = segments[2];

  const user = await getUserByPrefix(userPrefix);
  if (!user) {
    return c.text("User not found", 404);
  }

  try {
    const dynamicStatic = serveStatic({
      root: user.rootDir!,
      rewriteRequestPath(path) {
        const newPath = path.split("/").slice(3).join("/");
        return "/" + newPath;
      },
    });

    return dynamicStatic(c, next);
  } catch (e) {
    return c.text("File not found", 404);
  }
});

const server = serve(
  {
    fetch: app.fetch,
    port: 5000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);

    const ftpServer = FTPServer({
      port: Number(process.env.FTP_PORT) || 21,
    });
  }
);

process.on("SIGINT", () => {
  server.close();
  process.exit(0);
});
process.on("SIGTERM", () => {
  server.close((err) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    process.exit(0);
  });
});
