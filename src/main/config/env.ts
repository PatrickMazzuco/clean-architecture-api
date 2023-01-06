import dotenv from 'dotenv';

dotenv.config();

const buildMongoUrl = (): string => {
  const { MONGO_URL } = process.env;
  if (MONGO_URL) {
    return MONGO_URL;
  }

  const { MONGO_HOST, MONGO_PORT, MONGO_DB } = process.env;
  if (MONGO_HOST && MONGO_PORT && MONGO_DB) {
    return `mongodb://${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB}`;
  }

  return 'mongodb://localhost:27017/clean-api';
};

export default {
  mongoUrl: buildMongoUrl(),
  port: process.env.PORT ?? 3000,
  jwtSecret: process.env.JWT_SECRET ?? '175e748f-d460-4605-8312-4b81e9825ac5'
};
