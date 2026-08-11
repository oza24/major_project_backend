const fs = require("fs");
const path = require("path");

const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

const caPath = path.join(__dirname, "../../certs/ca.pem");

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        ca: fs.readFileSync(caPath, "utf8"),
        rejectUnauthorized: true
    }
});

const prisma = new PrismaClient({
    adapter
});

module.exports = prisma;