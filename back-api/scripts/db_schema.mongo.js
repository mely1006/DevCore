// MongoDB JSON Schema + Indexes setup for gasaunivers
// Run: mongosh --quiet --file back-api/scripts/db_schema.mongo.js

(function () {
  const dbName = 'gasaunivers';
  const database = db.getSiblingDB(dbName);

  function ensureCollection(name, schema) {
    const exists = database.getCollectionNames().includes(name);
    if (!exists) {
      database.createCollection(name, {
        validator: { $jsonSchema: schema },
        validationLevel: 'strict',
        validationAction: 'error',
      });
      print(`Created collection: ${name} with validator.`);
    } else {
      const res = database.runCommand({
        collMod: name,
        validator: { $jsonSchema: schema },
        validationLevel: 'strict',
        validationAction: 'error',
      });
      print(`Updated validator on collection: ${name}`);
      printjson(res);
    }
  }

  const userSchema = {
    bsonType: 'object',
    required: ['name', 'email', 'password', 'role', 'createdAt'],
    properties: {
      name: { bsonType: 'string', description: 'Nom complet' },
      email: { bsonType: 'string', pattern: '^.+@.+\\..+$', description: 'Adresse email' },
      password: { bsonType: 'string', description: 'Hash du mot de passe (bcrypt)' },
      role: { enum: ['directeur', 'formateur', 'etudiant'], description: 'Rôle utilisateur' },
      phone: { bsonType: ['string', 'null'], description: 'Téléphone (optionnel)' },
      promotion: { bsonType: ['objectId', 'null'], description: "Référence vers la promotion (ObjectId)" },
      createdAt: { bsonType: 'date', description: 'Date de création' },
    },
    additionalProperties: true,
  };

  const promotionSchema = {
    bsonType: 'object',
    required: ['label', 'year', 'createdAt'],
    properties: {
      label: { bsonType: 'string', minLength: 1, description: 'Libellé de la promotion' },
      year: { bsonType: 'int', minimum: 2000, maximum: 2100, description: 'Année (2000-2100)' },
      createdAt: { bsonType: 'date', description: 'Date de création' },
    },
    additionalProperties: true,
  };

  const workSchema = {
    bsonType: 'object',
    required: ['title', 'type', 'startDate', 'endDate', 'createdAt', 'createdBy'],
    properties: {
      title: { bsonType: 'string', minLength: 1, description: 'Titre du travail' },
      description: { bsonType: ['string', 'null'], description: 'Description' },
      type: { enum: ['individuel', 'collectif'], description: 'Type de travail' },
      startDate: { bsonType: 'date', description: 'Date de début' },
      endDate: { bsonType: 'date', description: 'Date de fin' },
      createdAt: { bsonType: 'date', description: 'Date de création' },
      createdBy: { bsonType: 'objectId', description: 'Référence du formateur' },
      promotion: { bsonType: ['objectId', 'null'], description: 'Promotion cible (optionnel)' },
      assignees: { bsonType: ['array'], items: { bsonType: 'objectId' }, description: 'Liste des étudiants assignés' },
      assignments: {
        bsonType: ['array'],
        description: 'Assignations par groupe ou individu avec dates',
        items: {
          bsonType: 'object',
          required: ['assignees', 'startDate', 'endDate'],
          properties: {
            assignees: { bsonType: ['array'], items: { bsonType: 'objectId' } },
            startDate: { bsonType: 'date' },
            endDate: { bsonType: 'date' },
            groupName: { bsonType: ['string', 'null'] },
            createdAt: { bsonType: 'date' },
          },
        },
      },
    },
    additionalProperties: true,
  };

  // Create/Update validators
  ensureCollection('users', userSchema);
  ensureCollection('promotions', promotionSchema);
  ensureCollection('works', workSchema);

  // Indexes
  database.users.createIndex({ email: 1 }, { unique: true });
  database.promotions.createIndex({ label: 1, year: 1 }, { unique: true });
  database.works.createIndex({ createdBy: 1, createdAt: -1 });

  // Summary
  print('--- Collections ---');
  printjson(database.getCollectionInfos());
  print('--- Indexes (users) ---');
  printjson(database.users.getIndexes());
  print('--- Indexes (promotions) ---');
  printjson(database.promotions.getIndexes());
  print(`Users count: ${database.users.countDocuments()}`);
  print(`Promotions count: ${database.promotions.countDocuments()}`);
})();
