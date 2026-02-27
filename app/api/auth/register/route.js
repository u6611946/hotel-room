import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

export async function POST(request) {
    try {
        const { firstName, lastName, email, phone, password } = await request.json();

        const db = await getDatabase();
        
        // Check if user already exists
        const existingUser = await db.collection('users').findOne({ email });

        if (existingUser) {
            return NextResponse.json(
                { error: 'User with this email already exists' },
                { status: 400 }
            );
        }

        // In production, you should hash the password before storing
        // For now, storing as plain text (NOT RECOMMENDED for production)
        const newUser = {
            firstName,
            lastName,
            email,
            phone,
            password,
            createdAt: new Date().toISOString(),
        };

        const result = await db.collection('users').insertOne(newUser);

        // Don't send password back to client
        const { password: _, ...userWithoutPassword } = newUser;

        return NextResponse.json({
            user: userWithoutPassword,
            message: 'Registration successful'
        }, { status: 201 });

    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
