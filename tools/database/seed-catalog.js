const fs = require("node:fs");
const path = require("node:path");
const { pathToFileURL } = require("node:url");
const { MongoClient } = require("mongodb");

const REQUIRED_COLUMNS = [
  "branch",
  "academicYear",
  "pattern",
  "subject",
  "examType",
  "paperMonth",
  "paperYear",
  "fileId"
];

const VALID_ACADEMIC_YEARS = new Set(["FE", "SE", "TE", "BE"]);
const ACADEMIC_YEAR_ORDER = ["FE", "SE", "TE", "BE"];
const VALID_PATTERNS = ["2012", "2015", "2019", "2024"];
const VALID_EXAM_TYPES = new Set(["INSEM", "ENDSEM"]);
const FILE_ID_PATTERN = /^[a-zA-Z0-9_-]{10,}$/;

function loadDotEnv() {
  const envPath = path.resolve(process.cwd(), ".env");
  if (!fs.existsSync(envPath)) return;

  const lines = fs.readFileSync(envPath, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const sep = trimmed.indexOf("=");
    if (sep === -1) continue;

    const key = trimmed.slice(0, sep).trim();
    const rawValue = trimmed.slice(sep + 1).trim();
    const value = rawValue.replace(/^['"]|['"]$/g, "");

    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

function slugify(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeText(value) {
  return String(value || "").trim().replace(/\s+/g, " ");
}

function stripPdfExtension(value) {
  return String(value || "").replace(/\.pdf$/i, "");
}

function normalizePattern(value) {
  const clean = normalizeText(value);
  const match = clean.match(/\b(2012|2015|2019|2024)\b/);
  return match ? match[1] : clean;
}

function parseFileNameMetadata(fileNameInput) {
  const cleanName = stripPdfExtension(normalizeText(fileNameInput));
  if (!cleanName) return { paperMonth: "", paperYear: null, examType: "" };

  const yearMatch = cleanName.match(/(20\d{2})/);
  const paperYear = yearMatch ? Number.parseInt(yearMatch[1], 10) : null;
  const paperMonth = cleanName
    .replace(/20\d{2}/g, "")
    .replace(/[_-]+/g, " ")
    .trim();

  const lower = cleanName.toLowerCase();
  const isEndsem = /(may|jun|nov|dec)/.test(lower);
  const examType = isEndsem ? "ENDSEM" : "INSEM";

  return { paperMonth, paperYear, examType };
}

function looksLikeHeaderRow(raw) {
  const branch = normalizeText(raw.branch).toLowerCase();
  const academicYear = normalizeText(raw.academicYear).toLowerCase();
  const year = normalizeText(raw.year).toLowerCase();
  const pattern = normalizeText(raw.pattern).toLowerCase();
  const subject = normalizeText(raw.subject).toLowerCase();

  return (
    branch === "branch" &&
    pattern === "pattern" &&
    subject === "subject" &&
    (academicYear === "academicyear" || academicYear === "year" || year === "year")
  );
}

function extractFileId(input) {
  const value = normalizeText(input);
  if (FILE_ID_PATTERN.test(value)) return value;

  const patterns = [/\/file\/d\/([a-zA-Z0-9_-]{10,})/, /[?&]id=([a-zA-Z0-9_-]{10,})/, /\/d\/([a-zA-Z0-9_-]{10,})/];
  for (const pattern of patterns) {
    const match = value.match(pattern);
    if (match) return match[1];
  }
  return "";
}

function splitCsvLine(line) {
  const columns = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];

    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === "," && !inQuotes) {
      columns.push(current);
      current = "";
      continue;
    }

    current += char;
  }

  columns.push(current);
  return columns;
}

function parseCsv(content) {
  const lines = content.split(/\r?\n/).filter((line) => line.trim().length > 0);
  if (lines.length === 0) return [];

  const headers = splitCsvLine(lines[0]).map((header) => normalizeText(header));
  for (const column of REQUIRED_COLUMNS) {
    if (!headers.includes(column)) {
      throw new Error(`Missing required CSV column: ${column}`);
    }
  }

  const rows = [];
  for (let i = 1; i < lines.length; i += 1) {
    const values = splitCsvLine(lines[i]);
    const row = {};
    for (let j = 0; j < headers.length; j += 1) {
      row[headers[j]] = values[j] || "";
    }
    rows.push(row);
  }
  return rows;
}

function normalizeRow(raw, index) {
  if (looksLikeHeaderRow(raw)) {
    return null;
  }

  const branch = normalizeText(raw.branch);
  const academicYear = normalizeText(raw.academicYear || raw.year).toUpperCase();
  const pattern = normalizePattern(raw.pattern);
  const subject = normalizeText(raw.subject);

  let examType = normalizeText(raw.examType).toUpperCase();
  let paperMonth = normalizeText(raw.paperMonth);
  let paperYear = Number.parseInt(normalizeText(raw.paperYear), 10);
  let fileId = extractFileId(raw.fileId);

  const looksLikeLegacySixColumn =
    !fileId &&
    Number.isNaN(paperYear) &&
    FILE_ID_PATTERN.test(normalizeText(raw.paperMonth)) &&
    /\.pdf$/i.test(normalizeText(raw.examType));

  if (looksLikeLegacySixColumn) {
    const fromFileName = parseFileNameMetadata(raw.examType);
    examType = fromFileName.examType;
    paperMonth = fromFileName.paperMonth;
    paperYear = fromFileName.paperYear;
    fileId = extractFileId(raw.paperMonth);
  }

  if (!fileId && raw.fileId) {
    fileId = extractFileId(raw.fileId);
  }

  if (!branch) throw new Error(`Row ${index + 2}: branch is required`);
  if (!VALID_ACADEMIC_YEARS.has(academicYear)) throw new Error(`Row ${index + 2}: invalid academicYear "${raw.academicYear}"`);
  if (!VALID_PATTERNS.includes(pattern)) throw new Error(`Row ${index + 2}: invalid pattern "${raw.pattern}"`);
  if (!subject) throw new Error(`Row ${index + 2}: subject is required`);
  if (!VALID_EXAM_TYPES.has(examType)) throw new Error(`Row ${index + 2}: invalid examType "${raw.examType}"`);
  if (!Number.isInteger(paperYear) || paperYear < 2000 || paperYear > 2100) {
    throw new Error(`Row ${index + 2}: invalid paperYear "${raw.paperYear}"`);
  }
  if (!FILE_ID_PATTERN.test(fileId)) throw new Error(`Row ${index + 2}: invalid fileId "${raw.fileId}"`);

  return {
    branch,
    branchSlug: slugify(branch),
    academicYear,
    pattern,
    subject,
    subjectSlug: slugify(subject),
    examType,
    paperMonth,
    paperYear,
    fileId
  };
}

function buildStructureDocs(rows) {
  const byBranchYear = new Map();

  for (const row of rows) {
    const branchYearKey = `${row.branchSlug}::${row.academicYear}`;
    if (!byBranchYear.has(branchYearKey)) {
      const patternMap = new Map();
      for (const pattern of VALID_PATTERNS) {
        patternMap.set(pattern, new Map());
      }

      byBranchYear.set(branchYearKey, {
        branch: row.branch,
        branchSlug: row.branchSlug,
        academicYear: row.academicYear,
        patternMap
      });
    }

    const bucket = byBranchYear.get(branchYearKey);
    const subjectMap = bucket.patternMap.get(row.pattern);
    const subjectKey = row.subjectSlug;
    const existing = subjectMap.get(subjectKey);

    if (!existing) {
      subjectMap.set(subjectKey, {
        subject: row.subject,
        subjectSlug: row.subjectSlug,
        paperCount: 1
      });
    } else {
      existing.paperCount += 1;
    }
  }

  const now = new Date();
  return Array.from(byBranchYear.values())
    .sort(
      (a, b) =>
        a.branch.localeCompare(b.branch) ||
        ACADEMIC_YEAR_ORDER.indexOf(a.academicYear) - ACADEMIC_YEAR_ORDER.indexOf(b.academicYear)
    )
    .map((entry) => {
      const patterns = VALID_PATTERNS.map((pattern) => {
        const subjects = Array.from(entry.patternMap.get(pattern).values()).sort((a, b) => a.subject.localeCompare(b.subject));
        const paperCount = subjects.reduce((sum, subject) => sum + subject.paperCount, 0);
        return { pattern, paperCount, subjects };
      });

      return {
        branch: entry.branch,
        branchSlug: entry.branchSlug,
        academicYear: entry.academicYear,
        patterns,
        updatedAt: now
      };
    });
}

async function loadRows(inputPath) {
  const resolvedPath = path.resolve(process.cwd(), inputPath);
  if (!fs.existsSync(resolvedPath)) {
    throw new Error(`Catalog file not found: ${resolvedPath}`);
  }

  const ext = path.extname(resolvedPath).toLowerCase();
  const raw = fs.readFileSync(resolvedPath, "utf8");

  if (ext === ".json") {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) throw new Error("JSON catalog must be an array of rows");
    return parsed;
  }

  if (ext === ".csv") {
    return parseCsv(raw);
  }

  throw new Error("Unsupported catalog format. Use .csv or .json");
}

async function seed() {
  loadDotEnv();

  const inputPath = process.argv[2] || "data/catalog/master-catalog.csv";
  const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017";
  const dbName = process.env.MONGODB_DB_NAME || "pyqpro";

  const rawRows = await loadRows(inputPath);
  const normalized = [];
  const skipped = [];

  rawRows.forEach((row, index) => {
    try {
      const parsed = normalizeRow(row, index);
      if (parsed) normalized.push(parsed);
    } catch (error) {
      skipped.push(error.message || `Row ${index + 2}: invalid row`);
    }
  });

  const uniqueByFileId = new Map();
  for (const row of normalized) {
    if (!uniqueByFileId.has(row.fileId)) uniqueByFileId.set(row.fileId, row);
  }
  const dedupedRows = Array.from(uniqueByFileId.values());

  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(dbName);

  const schemaModuleUrl = pathToFileURL(path.resolve(process.cwd(), "src/server/db/schemas/pyq-paper.schema.js")).href;
  const schemaModule = await import(schemaModuleUrl);
  await schemaModule.ensurePyqSchema(db);

  const papersCollection = db.collection(schemaModule.pyqPapersCollectionName);
  const structureCollection = db.collection(schemaModule.pyqStructureCollectionName);

  const now = new Date();
  if (dedupedRows.length > 0) {
    const operations = dedupedRows.map((row) => ({
      updateOne: {
        filter: { fileId: row.fileId },
        update: {
          $set: { ...row, updatedAt: now },
          $setOnInsert: { createdAt: now }
        },
        upsert: true
      }
    }));

    await papersCollection.bulkWrite(operations, { ordered: false });
    await papersCollection.deleteMany({ fileId: { $nin: dedupedRows.map((row) => row.fileId) } });
  } else {
    await papersCollection.deleteMany({});
  }

  const structureDocs = buildStructureDocs(dedupedRows);
  await structureCollection.deleteMany({});
  if (structureDocs.length > 0) {
    await structureCollection.insertMany(structureDocs, { ordered: false });
  }

  await client.close();

  console.log(
    JSON.stringify(
      {
        inputPath,
        totalRows: rawRows.length,
        skippedRows: skipped.length,
        skippedSample: skipped.slice(0, 10),
        uniqueRows: dedupedRows.length,
        structureDocs: structureDocs.length
      },
      null,
      2
    )
  );
}

seed().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
