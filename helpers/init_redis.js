import redis from "redis";

const client = redis.createClient({
  url: "redis://127.0.0.1:6379",
});

// Handling connection events
client.on("connect", () => {
  console.log("Client is connected to the server");
});

client.on("ready", () => {
  console.log("Client connected to Redis and ready to use");
});

client.on("error", (error) => {
  console.error("Redis error:", error.message);
});

client.on("end", () => {
  console.log("Client disconnected from Redis");
});

// Handle termination signals
process.on("SIGINT", async () => {
  await client.quit();
  process.exit(0);
});

export default client;
