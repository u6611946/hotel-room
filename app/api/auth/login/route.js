import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

export async function POST(request) {
    try {
        const { email, password } = await request.json();

        const db = await getDatabase();
        
        // Find user by email
        const user = await db.collection('users').findOne({ email });

        if (!user) {
            return NextResponse.json(
                { error: 'Invalid email or password' },
                { status: 401 }
            );
        }

        // In production, you should hash passwords and compare hashes
        // For now, we'll do a simple comparison
        if (user.password !== password) {
            return NextResponse.json(
                { error: 'Invalid email or password' },
                { status: 401 }
            );
        }

        // Don't send password back to client
        const { password: _, ...userWithoutPassword } = user;

        return NextResponse.json({
            user: userWithoutPassword,
            message: 'Login successful'
        });

    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
