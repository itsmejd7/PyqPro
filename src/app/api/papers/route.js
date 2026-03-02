import { NextResponse } from "next/server";
import { z } from "zod";
import { listPapers } from "@/server/repositories/pyq";
import { slugify } from "@/lib/slug";

const querySchema = z.object({
  branch: z.string().optional(),
  academicYear: z.enum(["FE", "SE", "TE", "BE"]).optional(),
  pattern: z.enum(["2012", "2015", "2019", "2024"]).optional(),
  subject: z.string().optional(),
  examType: z.enum(["INSEM", "ENDSEM"]).optional()
});

export async function GET(request) {
  try {
    const query = querySchema.parse(Object.fromEntries(request.nextUrl.searchParams));

    const papers = await listPapers({
      branchSlug: query.branch ? slugify(query.branch) : undefined,
      academicYear: query.academicYear,
      pattern: query.pattern,
      subjectSlug: query.subject ? slugify(query.subject) : undefined,
      examType: query.examType
    });

    return NextResponse.json({ count: papers.length, data: papers });
  } catch (error) {
    return NextResponse.json({ error: error.message || "Invalid query" }, { status: 400 });
  }
}
