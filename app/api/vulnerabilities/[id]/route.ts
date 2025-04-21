import { prisma } from "../../../../lib/db/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Await params before destructuring
    const resolvedParams = await params;
    const id = resolvedParams.id;
    const body = await request.json();
    
    // Validate request body
    if (!body.status) {
      return NextResponse.json(
        { error: "Status is required" },
        { status: 400 }
      );
    }
    
    // Validate status value
    const validStatuses = ["Open", "In Progress", "Mitigated", "Closed"];
    if (!validStatuses.includes(body.status)) {
      return NextResponse.json(
        { error: "Invalid status value" },
        { status: 400 }
      );
    }

    // Update the vulnerability status
    const updatedVulnerability = await prisma.vulnerabilityAnalysis.update({
      where: { id },
      data: { status: body.status },
    });

    return NextResponse.json({ 
      success: true, 
      data: updatedVulnerability 
    });
  } catch (error) {
    console.error("Error updating vulnerability status:", error);
    return NextResponse.json(
      { error: "Failed to update vulnerability status" },
      { status: 500 }
    );
  }
} 