import Redis from "ioredis";


const redis = new Redis({
  host: process.env.REDIS_HOST || "localhost", // use environment variable or default to localhost
  port: process.env.REDIS_PORT,                                                       // port goes in its own field
  password: process.env.REDIS_PASSWORD,                                                           
});

if (process.env.NODE_ENV === 'development') {
  redis.on("connect", () => {
    console.log("✅ Redis connected");
  });
  redis.on("error", err => {
    console.error("❌ Redis error:", err);
  });
}
 
export default redis;