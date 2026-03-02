import { NextResponse } from "next/server";
import { z } from "zod";
import { getBranchStructure, getYearStructure, listBranches } from "@/server/repositories/pyq";
import { slugify } from "@/lib/slug";

const querySchema = z.object({
  branch: z.string().optional(),
  academicYear: z.enum(["FE", "SE", "TE", "BE"]).optional()
});

export async function GET(request) {
  try {
    const query = querySchema.parse(Object.fromEntries(request.nextUrl.searchParams));
    const branchSlug = query.branch ? slugify(query.branch) : undefined;

    if (!branchSlug) {
      const branches = await listBranches();
      return NextResponse.json({ count: branches.length, data: branches });
    }

    if (!query.academicYear) {
      const years = await getBranchStructure(branchSlug);
      return NextResponse.json({ count: years.length, data: years });
    }

    const yearStructure = await getYearStructure(branchSlug, query.academicYear);
    if (!yearStructure) {
      return NextResponse.json({ error: "Structure not found" }, { status: 404 });
    }

    return NextResponse.json({ count: 1, data: yearStructure });
  } catch (error) {
    return NextResponse.json({ error: error.message || "Invalid query" }, { status: 400 });
  }
}
