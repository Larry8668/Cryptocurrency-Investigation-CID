import axios from "axios";

export const localRedisClient = {
  get: async (key) => {
    try {
      console.log("Local get request recieved -> ", key);
      const response = await axios.get(`http://localhost:5000/cache/${key}`);
      console.log("Local response ->", response.data.value)
      return response.data.value;
    } catch (error) {
      console.error("Error fetching from local Redis server", error);
      return null;
    }
  },
  set: async (key, value, options) => {
    try {
      console.log("Local set request recieved -> ", key);
      const ttl = options.expirationTtl || 3600; // default to 1 hour TTL
      await axios.post("http://localhost:5000/cache", { key, value, ttl });
    } catch (error) {
      console.error("Error setting in local Redis server", error);
    }
  },
};
