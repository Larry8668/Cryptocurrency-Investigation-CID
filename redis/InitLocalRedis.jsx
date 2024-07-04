import { createClient } from "redis";

const localRedisClient = createClient({
  socket: {
    host: import.meta.env.VITE_REDIS_HOST,
    port: import.meta.env.VITE_REDIS_PORT,
  },
});

localRedisClient.on("error", (err) => console.log("Redis Client Error", err));

(async () => {
  try {
    await localRedisClient.connect();
    console.log("Connected to local Redis");
  } catch (err) {
    console.error("Failed to connect to local Redis:", err);
  }
})();

export { localRedisClient };
