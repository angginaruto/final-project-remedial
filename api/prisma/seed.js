import bcript from "bcrypt";
import prisma from "../src/utils/prisma.js";
const main = async () => {
    const password = await bcript.hash("admin123", 10);
    const admin = await prisma.user.upsert({
        where: {
            email: "admin123@email.com"
        },
        update: {},
        create: {
            name: "Admin",
            email: "admin@mail.com",
            password: password,
            role: "ADMIN"
        }
    });
    console.log("adminn created!", admin.email);
    await prisma.category.createMany({
        data: [
            { name: "Makanan" },
            { name: "Minuman" },
            { name: "Snack" }
        ]
    });
};
main().catch((error) => {
    console.error(error);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map