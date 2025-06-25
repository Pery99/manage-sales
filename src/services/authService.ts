import { 
    GoogleAuthProvider, 
    signInWithPopup, 
    signOut,
    onAuthStateChanged,
    type User
} from 'firebase/auth';
import { auth } from '@/lib/firebase';

const provider = new GoogleAuthProvider();

export async function signInWithGoogle(): Promise<User | null> {
    if (!auth) {
        console.error("Firebase Auth is not initialized.");
        return null;
    }
    try {
        const result = await signInWithPopup(auth, provider);
        return result.user;
    } catch (error) {
        console.error("Error during Google sign-in:", error);
        return null;
    }
}

export async function signOutUser(): Promise<void> {
    if (!auth) {
        console.error("Firebase Auth is not initialized.");
        return;
    }
    try {
        await signOut(auth);
    } catch (error) {
        console.error("Error signing out:", error);
    }
}

export function onAuthChange(callback: (user: User | null) => void) {
    if (!auth) return () => {};
    return onAuthStateChanged(auth, callback);
}
