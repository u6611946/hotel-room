import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

export async function PUT(request) {
    try {
        const { firstName, lastName, email, phone, oldEmail } = await request.json();

        const db = await getDatabase();
        
        // Update user profile
        const result = await db.collection('users').updateOne(
            { email: oldEmail },
            {
                $set: {
                    firstName,
                    lastName,
                    email,
                    phone,
                    updatedAt: new Date().toISOString(),
                }
            }
        );

        if (result.matchedCount === 0) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        // If email changed, update bookings too
        if (email !== oldEmail) {
            await db.collection('bookings').updateMany(
                { email: oldEmail },
                { $set: { email } }
            );
        }

        // Get updated user
        const updatedUser = await db.collection('users').findOne({ email });
        const { password: _, ...userWithoutPassword } = updatedUser;

        return NextResponse.json({
            user: userWithoutPassword,
            message: 'Profile updated successfully'
        });

    } catch (error) {
        console.error('Update error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
