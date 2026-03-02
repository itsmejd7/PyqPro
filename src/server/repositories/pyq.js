import { getDb } from "@/server/db/mongodb";
import { pyqPapersCollectionName, pyqStructureCollectionName } from "@/server/db/schemas/pyq-paper.schema";

const yearOrder = ["FE", "SE", "TE", "BE"];

function structureProjection() {
  return { _id: 0, branch: 1, branchSlug: 1, academicYear: 1, patterns: 1 };
}

export async function listBranches() {
  const db = await getDb();
  const branches = await db
    .collection(pyqStructureCollectionName)
    .aggregate([
      { $sort: { branch: 1, academicYear: 1 } },
      {
        $group: {
          _id: "$branchSlug",
          branch: { $first: "$branch" },
          branchSlug: { $first: "$branchSlug" },
          years: { $push: "$academicYear" }
        }
      },
      { $project: { _id: 0, branch: 1, branchSlug: 1, years: 1 } },
      { $sort: { branch: 1 } }
    ])
    .toArray();

  return branches.map((branch) => ({
    ...branch,
    years: [...branch.years].sort((a, b) => yearOrder.indexOf(a) - yearOrder.indexOf(b))
  }));
}

export async function getBranchStructure(branchSlug) {
  const db = await getDb();
  const records = await db
    .collection(pyqStructureCollectionName)
    .find({ branchSlug }, { projection: structureProjection() })
    .sort({ academicYear: 1 })
    .toArray();

  return records.sort((a, b) => yearOrder.indexOf(a.academicYear) - yearOrder.indexOf(b.academicYear));
}

export async function getYearStructure(branchSlug, academicYear) {
  const db = await getDb();
  return db
    .collection(pyqStructureCollectionName)
    .findOne({ branchSlug, academicYear }, { projection: structureProjection() });
}

export async function listPapers(filters) {
  const query = {};
  if (filters.branchSlug) query.branchSlug = filters.branchSlug;
  if (filters.academicYear) query.academicYear = filters.academicYear;
  if (filters.pattern) query.pattern = filters.pattern;
  if (filters.subjectSlug) query.subjectSlug = filters.subjectSlug;
  if (filters.examType) query.examType = filters.examType;

  const db = await getDb();
  return db
    .collection(pyqPapersCollectionName)
    .find(query, {
      projection: {
        _id: 0,
        branch: 1,
        branchSlug: 1,
        academicYear: 1,
        pattern: 1,
        subject: 1,
        subjectSlug: 1,
        examType: 1,
        paperMonth: 1,
        paperYear: 1,
        fileId: 1
      }
    })
    .sort({ paperYear: -1, paperMonth: 1, examType: 1 })
    .toArray();
}

export async function listSubjectPaths() {
  const db = await getDb();
  return db
    .collection(pyqStructureCollectionName)
    .aggregate([
      {
        $project: {
          _id: 0,
          branchSlug: 1,
          academicYear: 1,
          patterns: 1
        }
      },
      { $unwind: "$patterns" },
      { $unwind: "$patterns.subjects" },
      {
        $project: {
          branchSlug: 1,
          academicYear: 1,
          pattern: "$patterns.pattern",
          subjectSlug: "$patterns.subjects.subjectSlug"
        }
      }
    ])
    .toArray();
}
