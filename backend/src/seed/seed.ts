import { v4 as uuidv4 } from 'uuid';
import { getSession, closeDriver } from '../config/database.js';

async function seed() {
  const session = getSession();
  try {
    const tx = session.beginTransaction();
    
    console.log('🧹 Clearing existing data...');
    await tx.run('MATCH (n) DETACH DELETE n');

    console.log('🌱 Seeding Concepts...');
    const concepts = [
      // Categories
      { id: uuidv4(), canonicalId: 'wd:Q638', name: 'Music', type: 'Category' },
      { id: uuidv4(), canonicalId: 'wd:Q11424', name: 'Film & Series', type: 'Category' },
      { id: uuidv4(), canonicalId: 'wd:Q571', name: 'Books & Literature', type: 'Category' },
      { id: uuidv4(), canonicalId: 'wd:Q7889', name: 'Video Games', type: 'Category' },
      { id: uuidv4(), canonicalId: 'wd:Q11016', name: 'Technology', type: 'Category' },
      
      // Music Genres
      { id: uuidv4(), canonicalId: 'wd:Q11399', name: 'Rock', type: 'Genre' },
      { id: uuidv4(), canonicalId: 'wd:Q37073', name: 'Pop', type: 'Genre' },
      { id: uuidv4(), canonicalId: 'wd:Q6010', name: 'Rap/Hip-Hop', type: 'Genre' },
      { id: uuidv4(), canonicalId: 'wd:Q8341', name: 'Jazz', type: 'Genre' },
      { id: uuidv4(), canonicalId: 'wd:Q9778', name: 'Electronic', type: 'Genre' },
      { id: uuidv4(), canonicalId: 'wd:Q1154539', name: 'R&B', type: 'Genre' },
      { id: uuidv4(), canonicalId: 'wd:Q9730', name: 'Classical', type: 'Genre' },
      { id: uuidv4(), canonicalId: 'wd:Q38848', name: 'Metal', type: 'Genre' },
      
      // Film Genres
      { id: uuidv4(), canonicalId: 'wd:Q188473', name: 'Action', type: 'Genre' },
      { id: uuidv4(), canonicalId: 'wd:Q130232', name: 'Drama', type: 'Genre' },
      { id: uuidv4(), canonicalId: 'wd:Q40831', name: 'Comedy', type: 'Genre' },
      { id: uuidv4(), canonicalId: 'wd:Q471839', name: 'Sci-Fi', type: 'Genre' },
      { id: uuidv4(), canonicalId: 'wd:Q200092', name: 'Horror', type: 'Genre' },
      { id: uuidv4(), canonicalId: 'wd:Q93204', name: 'Documentary', type: 'Genre' },
      { id: uuidv4(), canonicalId: 'wd:Q202866', name: 'Animation', type: 'Genre' },
      
      // Book Genres
      { id: uuidv4(), canonicalId: 'wd:Q8253', name: 'Fiction', type: 'Genre' },
      { id: uuidv4(), canonicalId: 'wd:Q213051', name: 'Non-Fiction', type: 'Genre' },
      { id: uuidv4(), canonicalId: 'wd:Q132311', name: 'Fantasy', type: 'Genre' },
      { id: uuidv4(), canonicalId: 'wd:Q186424', name: 'Mystery', type: 'Genre' },
      { id: uuidv4(), canonicalId: 'wd:Q24925', name: 'Science Fiction', type: 'Genre' },

      // Artists
      { id: uuidv4(), canonicalId: 'wd:Q5608', name: 'Eminem', type: 'Artist' },
      { id: uuidv4(), canonicalId: 'wd:Q44191', name: 'Radiohead', type: 'Artist' },
      { id: uuidv4(), canonicalId: 'wd:Q1299', name: 'The Beatles', type: 'Artist' },
      { id: uuidv4(), canonicalId: 'wd:Q2274279', name: 'Kendrick Lamar', type: 'Artist' },
      { id: uuidv4(), canonicalId: 'wd:Q2306', name: 'Pink Floyd', type: 'Artist' },
      { id: uuidv4(), canonicalId: 'wd:Q187941', name: 'Daft Punk', type: 'Artist' },
      { id: uuidv4(), canonicalId: 'wd:Q93341', name: 'Miles Davis', type: 'Artist' },
      { id: uuidv4(), canonicalId: 'wd:Q255', name: 'Beethoven', type: 'Artist' },
      { id: uuidv4(), canonicalId: 'wd:Q15920', name: 'Metallica', type: 'Artist' },
      { id: uuidv4(), canonicalId: 'wd:Q47100846', name: 'Billie Eilish', type: 'Artist' },

      // Movies
      { id: uuidv4(), canonicalId: 'wd:Q172241', name: 'The Shawshank Redemption', type: 'Movie' },
      { id: uuidv4(), canonicalId: 'wd:Q25188', name: 'Inception', type: 'Movie' },
      { id: uuidv4(), canonicalId: 'wd:Q47703', name: 'The Godfather', type: 'Movie' },
      { id: uuidv4(), canonicalId: 'wd:Q104123', name: 'Pulp Fiction', type: 'Movie' },
      { id: uuidv4(), canonicalId: 'wd:Q13417189', name: 'Interstellar', type: 'Movie' },
      { id: uuidv4(), canonicalId: 'wd:Q83495', name: 'The Matrix', type: 'Movie' },
      { id: uuidv4(), canonicalId: 'wd:Q155438', name: 'Spirited Away', type: 'Movie' },
      { id: uuidv4(), canonicalId: 'wd:Q61896510', name: 'Parasite', type: 'Movie' },
      { id: uuidv4(), canonicalId: 'wd:Q163872', name: 'The Dark Knight', type: 'Movie' },
      { id: uuidv4(), canonicalId: 'wd:Q208592', name: '8 Mile', type: 'Movie' },

      // Books
      { id: uuidv4(), canonicalId: 'wd:Q208460', name: '1984', type: 'Book' },
      { id: uuidv4(), canonicalId: 'wd:Q15228', name: 'The Lord of the Rings', type: 'Book' },
      { id: uuidv4(), canonicalId: 'wd:Q21100042', name: 'Sapiens', type: 'Book' },
      { id: uuidv4(), canonicalId: 'wd:Q190192', name: 'Dune', type: 'Book' },
      { id: uuidv4(), canonicalId: 'wd:Q25169', name: "The Hitchhiker's Guide", type: 'Book' }
    ];

    for (const c of concepts) {
      await tx.run(
        'MERGE (n:Concept {canonicalId: $canonicalId}) SET n.id = $id, n.name = $name, n.type = $type',
        c
      );
    }

    console.log('🔗 Linking Concepts...');
    const relations = [
      // Music Genre to Category
      ['wd:Q11399', 'wd:Q638', 'SUB_CLASS_OF'],
      ['wd:Q37073', 'wd:Q638', 'SUB_CLASS_OF'],
      ['wd:Q6010', 'wd:Q638', 'SUB_CLASS_OF'],
      ['wd:Q8341', 'wd:Q638', 'SUB_CLASS_OF'],
      ['wd:Q9778', 'wd:Q638', 'SUB_CLASS_OF'],
      ['wd:Q1154539', 'wd:Q638', 'SUB_CLASS_OF'],
      ['wd:Q9730', 'wd:Q638', 'SUB_CLASS_OF'],
      ['wd:Q38848', 'wd:Q638', 'SUB_CLASS_OF'],

      // Film Genre to Category
      ['wd:Q188473', 'wd:Q11424', 'SUB_CLASS_OF'],
      ['wd:Q130232', 'wd:Q11424', 'SUB_CLASS_OF'],
      ['wd:Q40831', 'wd:Q11424', 'SUB_CLASS_OF'],
      ['wd:Q471839', 'wd:Q11424', 'SUB_CLASS_OF'],
      ['wd:Q200092', 'wd:Q11424', 'SUB_CLASS_OF'],
      ['wd:Q93204', 'wd:Q11424', 'SUB_CLASS_OF'],
      ['wd:Q202866', 'wd:Q11424', 'SUB_CLASS_OF'],

      // Book Genre to Category
      ['wd:Q8253', 'wd:Q571', 'SUB_CLASS_OF'],
      ['wd:Q213051', 'wd:Q571', 'SUB_CLASS_OF'],
      ['wd:Q132311', 'wd:Q571', 'SUB_CLASS_OF'],
      ['wd:Q186424', 'wd:Q571', 'SUB_CLASS_OF'],
      ['wd:Q24925', 'wd:Q571', 'SUB_CLASS_OF'],

      // Artists to Genres/Categories
      ['wd:Q5608', 'wd:Q6010', 'RELATED_TO'], // Eminem -> Rap
      ['wd:Q5608', 'wd:Q11424', 'RELATED_TO'], // Eminem -> Film & Series
      ['wd:Q44191', 'wd:Q11399', 'RELATED_TO'], // Radiohead -> Rock
      ['wd:Q44191', 'wd:Q9778', 'RELATED_TO'], // Radiohead -> Electronic
      ['wd:Q1299', 'wd:Q11399', 'RELATED_TO'], // The Beatles -> Rock
      ['wd:Q1299', 'wd:Q37073', 'RELATED_TO'], // The Beatles -> Pop
      ['wd:Q2274279', 'wd:Q6010', 'RELATED_TO'], // Kendrick Lamar -> Rap
      ['wd:Q2306', 'wd:Q11399', 'RELATED_TO'], // Pink Floyd -> Rock
      ['wd:Q187941', 'wd:Q9778', 'RELATED_TO'], // Daft Punk -> Electronic
      ['wd:Q93341', 'wd:Q8341', 'RELATED_TO'], // Miles Davis -> Jazz
      ['wd:Q255', 'wd:Q9730', 'RELATED_TO'], // Beethoven -> Classical
      ['wd:Q15920', 'wd:Q38848', 'RELATED_TO'], // Metallica -> Metal
      ['wd:Q47100846', 'wd:Q37073', 'RELATED_TO'], // Billie Eilish -> Pop
      ['wd:Q47100846', 'wd:Q9778', 'RELATED_TO'], // Billie Eilish -> Electronic

      // Movies to Genres/Entities
      ['wd:Q172241', 'wd:Q130232', 'RELATED_TO'], // The Shawshank Redemption -> Drama
      ['wd:Q25188', 'wd:Q471839', 'RELATED_TO'], // Inception -> Sci-Fi
      ['wd:Q25188', 'wd:Q188473', 'RELATED_TO'], // Inception -> Action
      ['wd:Q47703', 'wd:Q130232', 'RELATED_TO'], // The Godfather -> Drama
      ['wd:Q104123', 'wd:Q130232', 'RELATED_TO'], // Pulp Fiction -> Drama
      ['wd:Q104123', 'wd:Q40831', 'RELATED_TO'], // Pulp Fiction -> Comedy
      ['wd:Q13417189', 'wd:Q471839', 'RELATED_TO'], // Interstellar -> Sci-Fi
      ['wd:Q13417189', 'wd:Q130232', 'RELATED_TO'], // Interstellar -> Drama
      ['wd:Q83495', 'wd:Q471839', 'RELATED_TO'], // The Matrix -> Sci-Fi
      ['wd:Q83495', 'wd:Q188473', 'RELATED_TO'], // The Matrix -> Action
      ['wd:Q155438', 'wd:Q202866', 'RELATED_TO'], // Spirited Away -> Animation
      ['wd:Q61896510', 'wd:Q130232', 'RELATED_TO'], // Parasite -> Drama
      ['wd:Q163872', 'wd:Q188473', 'RELATED_TO'], // The Dark Knight -> Action
      ['wd:Q163872', 'wd:Q130232', 'RELATED_TO'], // The Dark Knight -> Drama
      ['wd:Q208592', 'wd:Q130232', 'RELATED_TO'], // 8 Mile -> Drama
      ['wd:Q208592', 'wd:Q5608', 'RELATED_TO'], // 8 Mile -> Eminem

      // Books to Genres
      ['wd:Q208460', 'wd:Q8253', 'RELATED_TO'], // 1984 -> Fiction
      ['wd:Q208460', 'wd:Q24925', 'RELATED_TO'], // 1984 -> Science Fiction
      ['wd:Q15228', 'wd:Q8253', 'RELATED_TO'], // The Lord of the Rings -> Fiction
      ['wd:Q15228', 'wd:Q132311', 'RELATED_TO'], // The Lord of the Rings -> Fantasy
      ['wd:Q21100042', 'wd:Q213051', 'RELATED_TO'], // Sapiens -> Non-Fiction
      ['wd:Q190192', 'wd:Q24925', 'RELATED_TO'], // Dune -> Science Fiction
      ['wd:Q190192', 'wd:Q8253', 'RELATED_TO'], // Dune -> Fiction
      ['wd:Q25169', 'wd:Q24925', 'RELATED_TO'], // The Hitchhiker's Guide -> Science Fiction
      ['wd:Q25169', 'wd:Q40831', 'RELATED_TO'] // The Hitchhiker's Guide -> Comedy
    ];

    for (const [sourceId, targetId, relationType] of relations) {
      await tx.run(
        `MATCH (a:Concept {canonicalId: $sourceId})
         MATCH (b:Concept {canonicalId: $targetId})
         MERGE (a)-[:${relationType}]->(b)`,
        { sourceId, targetId }
      );
    }

    console.log('👤 Seeding Users...');
    const users = [
      { id: uuidv4(), username: 'alice', displayName: 'Alice', createdAt: new Date().toISOString() },
      { id: uuidv4(), username: 'bob', displayName: 'Bob', createdAt: new Date().toISOString() }
    ];
    for (const u of users) {
      await tx.run(
        'MERGE (u:User {username: $username}) SET u.id = $id, u.displayName = $displayName, u.createdAt = $createdAt',
        u
      );
    }

    console.log('🤝 Creating User Interests...');
    const interests = [
      // Alice
      { username: 'alice', canonicalId: 'wd:Q5608', weight: 0.9 }, // Eminem
      { username: 'alice', canonicalId: 'wd:Q44191', weight: 0.7 }, // Radiohead
      { username: 'alice', canonicalId: 'wd:Q25188', weight: 0.85 }, // Inception
      { username: 'alice', canonicalId: 'wd:Q208460', weight: 0.6 }, // 1984
      { username: 'alice', canonicalId: 'wd:Q6010', weight: 0.8 }, // Rap
      { username: 'alice', canonicalId: 'wd:Q11399', weight: 0.65 }, // Rock
      // Bob
      { username: 'bob', canonicalId: 'wd:Q5608', weight: 0.85 }, // Eminem
      { username: 'bob', canonicalId: 'wd:Q2274279', weight: 0.9 }, // Kendrick Lamar
      { username: 'bob', canonicalId: 'wd:Q83495', weight: 0.8 }, // The Matrix
      { username: 'bob', canonicalId: 'wd:Q25188', weight: 0.7 }, // Inception
      { username: 'bob', canonicalId: 'wd:Q6010', weight: 0.95 }, // Rap
      { username: 'bob', canonicalId: 'wd:Q471839', weight: 0.8 } // Sci-Fi
    ];

    for (const { username, canonicalId, weight } of interests) {
      await tx.run(
        `MATCH (u:User {username: $username})
         MATCH (c:Concept {canonicalId: $canonicalId})
         MERGE (u)-[r:INTERESTED_IN]->(c)
         SET r.weight = $weight, r.addedAt = $addedAt`,
        { username, canonicalId, weight, addedAt: new Date().toISOString() }
      );
    }

    await tx.commit();
    console.log('✅ Seed successful!');
  } catch (error) {
    console.error('❌ Seed failed:', error);
  } finally {
    await session.close();
    await closeDriver();
  }
}

seed();
