import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import db from "@/lib/db";
import { z } from "zod";

const updateUserSchema = z.object({
  name: z.string().min(2).max(50).optional(),
});

export async function PUT(req: NextRequest) {
  try {
    // Get the current session to verify the user
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "You must be logged in to update your profile" },
        { status: 401 }
      );
    }

    // Parse the request body
    const body = await req.json();
    const validatedData = updateUserSchema.safeParse(body);
    
    if (!validatedData.success) {
      return NextResponse.json(
        { error: "Invalid data provided", details: validatedData.error.format() },
        { status: 400 }
      );
    }

    // Update the user in the database
    const updatedUser = await db.user.update({
      where: { email: session.user.email },
      data: {
        ...validatedData.data,
        updatedAt: new Date(),
      },
    });

    // Return the updated user (excluding sensitive information)
    return NextResponse.json({
      success: true,
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        image: updatedUser.image,
        role: updatedUser.role,
      },
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Failed to update user profile" },
      { status: 500 }
    );
  }
} 