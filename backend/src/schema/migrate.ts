import * as fs from 'fs';
import * as path from 'path';
import { getSession, closeDriver } from '../config/database.js';

async function runMigrations() {
  const session = getSession();
  try {
    const constraintsPath = path.join(process.cwd(), 'src', 'schema', 'constraints.cypher');
    const cypherContent = fs.readFileSync(constraintsPath, 'utf8');
    const statements = cypherContent
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('//'));

    for (const statement of statements) {
      try {
        await session.run(statement);
        console.log(`✅ Executed: ${statement}`);
      } catch (error) {
        console.error(`❌ Failed to execute: ${statement}`, error);
      }
    }
    console.log('Migrations completed successfully.');
  } finally {
    await session.close();
    await closeDriver();
  }
}

runMigrations().catch(console.error);
