export const pyqPapersCollectionName = "pyq_papers";
export const pyqStructureCollectionName = "pyq_structure";

const papersJsonSchema = {
  bsonType: "object",
  required: [
    "branch",
    "branchSlug",
    "academicYear",
    "pattern",
    "subject",
    "subjectSlug",
    "examType",
    "paperYear",
    "fileId"
  ],
  properties: {
    branch: { bsonType: "string" },
    branchSlug: { bsonType: "string" },
    academicYear: { enum: ["FE", "SE", "TE", "BE"] },
    pattern: { enum: ["2012", "2015", "2019", "2024"] },
    subject: { bsonType: "string" },
    subjectSlug: { bsonType: "string" },
    examType: { enum: ["INSEM", "ENDSEM"] },
    paperMonth: { bsonType: "string" },
    paperYear: {
      bsonType: "int",
      minimum: 2000,
      maximum: 2100
    },
    fileId: {
      bsonType: "string",
      pattern: "^[a-zA-Z0-9_-]{10,}$"
    },
    createdAt: { bsonType: "date" },
    updatedAt: { bsonType: "date" }
  }
};

const structureJsonSchema = {
  bsonType: "object",
  required: ["branch", "branchSlug", "academicYear", "patterns", "updatedAt"],
  properties: {
    branch: { bsonType: "string" },
    branchSlug: { bsonType: "string" },
    academicYear: { enum: ["FE", "SE", "TE", "BE"] },
    patterns: {
      bsonType: "array",
      items: {
        bsonType: "object",
        required: ["pattern", "paperCount", "subjects"],
        properties: {
          pattern: { enum: ["2012", "2015", "2019", "2024"] },
          paperCount: { bsonType: "int", minimum: 0 },
          subjects: {
            bsonType: "array",
            items: {
              bsonType: "object",
              required: ["subject", "subjectSlug", "paperCount"],
              properties: {
                subject: { bsonType: "string" },
                subjectSlug: { bsonType: "string" },
                paperCount: { bsonType: "int", minimum: 0 }
              }
            }
          }
        }
      }
    },
    updatedAt: { bsonType: "date" }
  }
};

async function ensureCollection(db, collectionName, schema) {
  const existing = await db.listCollections({ name: collectionName }).toArray();

  if (existing.length === 0) {
    await db.createCollection(collectionName, { validator: { $jsonSchema: schema } });
    return;
  }

  await db.command({
    collMod: collectionName,
    validator: { $jsonSchema: schema },
    validationLevel: "strict"
  });
}

export async function ensurePyqSchema(db) {
  await ensureCollection(db, pyqPapersCollectionName, papersJsonSchema);
  await ensureCollection(db, pyqStructureCollectionName, structureJsonSchema);

  await db.collection(pyqPapersCollectionName).createIndex(
    { branchSlug: 1, academicYear: 1, pattern: 1, subjectSlug: 1, examType: 1, paperYear: -1 },
    { name: "papers_lookup_idx" }
  );
  await db.collection(pyqPapersCollectionName).createIndex(
    { branchSlug: 1, academicYear: 1, pattern: 1, subjectSlug: 1, paperYear: -1, paperMonth: 1 },
    { name: "papers_subject_idx" }
  );
  await db.collection(pyqPapersCollectionName).createIndex(
    { fileId: 1 },
    { name: "file_id_unique_idx", unique: true }
  );

  await db.collection(pyqStructureCollectionName).createIndex(
    { branchSlug: 1, academicYear: 1 },
    { name: "structure_branch_year_unique_idx", unique: true }
  );
}
