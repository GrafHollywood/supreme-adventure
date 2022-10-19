export const environment = {
  production: false,
  mongodb: process.env.DATABASE_CONNECTION,
  jwtSecret: process.env.JWT_SECRET,
};
