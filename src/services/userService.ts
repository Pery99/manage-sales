'use server';

import { db } from '@/lib/firebase';
import type { UserProfile } from '@/types';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
    if (!db) {
        console.warn("Firestore not initialized, cannot get user profile.");
        return null;
    }
    const userDocRef = doc(db, 'users', userId);
    const docSnap = await getDoc(userDocRef);
    if (docSnap.exists()) {
        const data = docSnap.data();
        return {
            id: docSnap.id,
            businessName: data.businessName,
            businessPhoneNumber: data.businessPhoneNumber,
        };
    }
    return null;
}

export async function updateUserProfile(userId: string, data: { businessName: string, businessPhoneNumber: string }): Promise<void> {
    if (!db) {
        throw new Error("Firestore is not initialized. Cannot update user profile.");
    }
    const userDocRef = doc(db, 'users', userId);
    await setDoc(userDocRef, { ...data, updatedAt: serverTimestamp() }, { merge: true });
}
