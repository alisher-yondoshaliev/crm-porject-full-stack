import 'dotenv/config';

import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

async function main() {
    const databaseUrl = process.env.DATABASE_URL;
    const fullName = process.env.SUPERADMIN_FULL_NAME || 'System Super Admin';
    const email = process.env.SUPERADMIN_EMAIL;
    const password = process.env.SUPERADMIN_PASSWORD;
    const position = process.env.SUPERADMIN_POSITION || 'System Owner';

    if (!databaseUrl) {
        throw new Error('DATABASE_URL is not set');
    }

    if (!email || !password) {
        throw new Error('SUPERADMIN_EMAIL and SUPERADMIN_PASSWORD must be set');
    }

    const adapter = new PrismaPg({ connectionString: databaseUrl });
    const prisma = new PrismaClient({ adapter });

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const superAdmin = await prisma.user.upsert({
            where: { email },
            update: {
                fullName,
                password: hashedPassword,
                position,
                role: Role.SUPERADMIN,
            },
            create: {
                fullName,
                email,
                password: hashedPassword,
                position,
                hire_date: new Date(),
                role: Role.SUPERADMIN,
            },
        });

        console.log('SUPERADMIN seeded successfully:', {
            id: superAdmin.id,
            email: superAdmin.email,
            role: superAdmin.role,
        });
    } finally {
        await prisma.$disconnect();
    }
}

main().catch((error) => {
    console.error('Seed failed:', error);
    process.exit(1);
});