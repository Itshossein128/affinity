import neo4j, { Driver, Session } from 'neo4j-driver';
import * as dotenv from 'dotenv';
import path from 'path';

// Load .env from the project root (parent of backend/)
dotenv.config({ path: path.resolve(process.cwd(), '../.env') });
dotenv.config(); // Also try CWD for flexibility

let driver: Driver;

export function getDriver(): Driver {
  if (!driver) {
    const uri = process.env.NEO4J_URI || 'bolt://localhost:7687';
    const user = process.env.NEO4J_USER || 'neo4j';
    const password = process.env.NEO4J_PASSWORD || 'password';
    
    driver = neo4j.driver(uri, neo4j.auth.basic(user, password));
  }
  return driver;
}

export function getSession(): Session {
  return getDriver().session();
}

export async function closeDriver(): Promise<void> {
  if (driver) {
    await driver.close();
  }
}
