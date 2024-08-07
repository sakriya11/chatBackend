import * as dotenv from "dotenv";

dotenv.config();

const config = {
  app: {
    port: process.env.PORT,
    host: process.env.HOST,
    url: process.env.URL,
  },
  db:{
    mongoURL:process.env.MONGO_URL
  },
  jwt: {
    secret: process.env.JWT_SECRET || "hellochangethissecretonenv",
    issuer: process.env.JWT_ISSUER || "Backend",
    token_ttl: process.env.JWT_TOKEN_TTL || "1d",
    token_ttl_seconds:
      Number(process.env.JWT_TOKEN_TTL_SECONDS) || 24 * 60 * 60,
  },
};

export default config;