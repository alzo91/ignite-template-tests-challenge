import { ConnectionOptions } from "tls";
import { Connection, createConnection, getConnectionOptions } from "typeorm";

//(async () => await createConnection())();
// host = "192.168.15.2"
export default async (host = "database"): Promise<Connection> => {
  const defaultOptions = await getConnectionOptions();
  Object.assign(defaultOptions, { host: host });
  return createConnection(defaultOptions);
};
