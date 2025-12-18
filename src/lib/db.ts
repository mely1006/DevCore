import { openDB } from 'idb';
import type { DBSchema, IDBPDatabase } from 'idb';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'directeur' | 'formateur' | 'etudiant';
  status: 'active' | 'inactive';
  createdOn: string;
  password?: string;
  promotion?: string;
}

interface Promotion {
  id: string;
  year: string;
  students: number;
  spaces: number;
}

interface PedagogicalSpace {
  id: string;
  name: string;
  formateur: string;
  formateurId: string;
  promotion: string;
  students: number;
  description?: string;
  createdOn: string;
}

interface Enrollment {
  id: string;
  studentId: string;
  spaceId: string;
  enrolledOn: string;
}

interface UniversityCasaDB extends DBSchema {
  users: {
    key: string;
    value: User;
    indexes: { 'by-email': string; 'by-role': string };
  };
  promotions: {
    key: string;
    value: Promotion;
    indexes: { 'by-year': string };
  };
  pedagogicalSpaces: {
    key: string;
    value: PedagogicalSpace;
    indexes: { 'by-formateur': string; 'by-promotion': string };
  };
  enrollments: {
    key: string;
    value: Enrollment;
    indexes: { 'by-student': string; 'by-space': string };
  };
}

const DB_NAME = 'universite-casa-db';
const DB_VERSION = 1;

let dbInstance: IDBPDatabase<UniversityCasaDB> | null = null;

export async function initDB(): Promise<IDBPDatabase<UniversityCasaDB>> {
  if (dbInstance) {
    return dbInstance;
  }

  dbInstance = await openDB<UniversityCasaDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Users store
      if (!db.objectStoreNames.contains('users')) {
        const userStore = db.createObjectStore('users', { keyPath: 'id' });
        userStore.createIndex('by-email', 'email', { unique: true });
        userStore.createIndex('by-role', 'role');
      }

      // Promotions store
      if (!db.objectStoreNames.contains('promotions')) {
        const promoStore = db.createObjectStore('promotions', { keyPath: 'id' });
        promoStore.createIndex('by-year', 'year');
      }

      // Pedagogical spaces store
      if (!db.objectStoreNames.contains('pedagogicalSpaces')) {
        const spaceStore = db.createObjectStore('pedagogicalSpaces', { keyPath: 'id' });
        spaceStore.createIndex('by-formateur', 'formateurId');
        spaceStore.createIndex('by-promotion', 'promotion');
      }

      // Enrollments store
      if (!db.objectStoreNames.contains('enrollments')) {
        const enrollStore = db.createObjectStore('enrollments', { keyPath: 'id' });
        enrollStore.createIndex('by-student', 'studentId');
        enrollStore.createIndex('by-space', 'spaceId');
      }
    },
  });

  return dbInstance;
}


/** Seed database with initial demo data if empty */
export async function seedDatabase(): Promise<void> {
  const db = await initDB();
  const tx = db.transaction('users', 'readwrite');
  const userStore = tx.objectStore('users');
  const existing = await userStore.getAll();
  if (existing.length === 0) {
    const now = new Date().toLocaleDateString('fr-FR');
    const demoUsers: User[] = [
      {
        id: crypto.randomUUID(),
        name: 'Jean Dupont',
        email: 'jean.dupont@example.com',
        role: 'directeur',
        status: 'active',
        createdOn: now,
      },
      {
        id: crypto.randomUUID(),
        name: 'Alice Martin',
        email: 'alice.martin@example.com',
        role: 'formateur',
        status: 'active',
        createdOn: now,
      },
      {
        id: crypto.randomUUID(),
        name: 'Mohamed El Fassi',
        email: 'mohamed.elfassi@example.com',
        role: 'etudiant',
        status: 'inactive',
        createdOn: now,
      },
    ];
    for (const u of demoUsers) {
      await userStore.add(u);
    }
  }
  await tx.done;
}

export async function getAllUsers(): Promise<User[]> {
  const db = await initDB();
  return db.getAll('users');
}

export async function deleteUser(id: string): Promise<void> {
  const db = await initDB();
  await db.delete('users', id);
}

export async function addUser(user: User): Promise<void> {
  const db = await initDB();
  await db.add('users', user);
}
