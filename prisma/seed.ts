/**
 * Database seed script
 * Run with: npx prisma db seed
 */

import { db } from '../src/lib/db';

async function main() {
  // Create a sample anonymous user for testing
  const sampleUser = await db.user.upsert({
    where: { sessionId: 'demo-session-123' },
    update: { updatedAt: new Date() },
    create: {
      sessionId: 'demo-session-123',
      isAnonymous: true,
      username: 'demo_user'
    }
  });

  console.log('Seeded user:', sampleUser);

  // You can add more seed data here:
  // - Sample processing jobs
  // - Sample newsletter subscription
  // - etc.
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });