import * as tedious from "tedious";
import * as tarn from "tarn";
import { Kysely, MssqlDialect } from "kysely";
import type { LosaAdmin } from "./types/LosaAdmin";

const dialect = new MssqlDialect({
  tarn: {
    ...tarn,
    options: {
      min: 0,
      max: 10,
    },
  },
  tedious: {
    ...tedious,
    connectionFactory: () =>
      new tedious.Connection({
        authentication: {
          options: {
            password: process.env.DB_PASSWORD,
            userName: process.env.DB_USER,
          },
          type: "default",
        },
        options: {
          database: process.env.DB_NAME,
          port: Number(process.env.DB_PORT),
          trustServerCertificate: true,
        },
        server: process.env.DB_HOST!,
      }),
  },
});

// Database interface is passed to Kysely's constructor, and from now on, Kysely
// knows your database structure.
// Dialect is passed to Kysely's constructor, and from now on, Kysely knows how
// to communicate with your database.
export const LosaAdminDB = new Kysely<LosaAdmin>({
  dialect,
});
