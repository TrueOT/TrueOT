import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import db from '@/lib/db';

export async function DELETE() {
  try {
    // Get the current session
    const session = await getServerSession(authOptions);

    // Check if user is authenticated
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // Delete all related data first due to foreign key constraints
    // This depends on the cascade delete settings in your schema
    // If cascade delete is not set up, you'll need to delete related records manually

    // Delete the user
    await db.user.delete({
      where: { id: userId },
    });

    return NextResponse.json(
      { success: true, message: 'Account deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting account:', error);
    return NextResponse.json(
      { error: 'Failed to delete account' },
      { status: 500 }
    );
  }
} 