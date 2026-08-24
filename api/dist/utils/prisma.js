import { PrismaClient } from "@prisma/client";
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
    throw new Error("DATABASE URL is not defined");
}
const adapter = new PrismaPg({
    connectionString
});
const prisma = new PrismaClient({
    adapter
});
export default prisma;
//# sourceMappingURL=prisma.js.map