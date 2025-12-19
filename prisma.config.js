require('dotenv').config();

module.exports = {
  prisma: {
    datasourceUrl: process.env.DATABASE_URL,
  },
};