import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  updateProfile,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [permissionError, setPermissionError] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Fetch additional user data from Firestore
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            setUser(userDoc.data() as User);
          } else {
            // Fallback to Auth profile if Firestore doc doesn't exist
            setUser({
              id: firebaseUser.uid,
              name: firebaseUser.displayName || 'User',
              email: firebaseUser.email || '',
              role: UserRole.USER,
              avatar: firebaseUser.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(firebaseUser.displayName || 'U')}&background=0d9488&color=fff`
            });
          }
        } catch (e: any) {
          console.error("Firestore access error:", e);
          if (e.code === 'permission-denied') {
            setPermissionError(true);
          }
          // Fallback if Firestore is blocked by rules
          setUser({
            id: firebaseUser.uid,
            name: firebaseUser.displayName || 'User',
            email: firebaseUser.email || '',
            role: UserRole.USER,
            avatar: firebaseUser.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(firebaseUser.displayName || 'U')}&background=0d9488&color=fff`
          });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signup = async (name: string, email: string, password: string, role: UserRole) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;

    const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0d9488&color=fff`;

    // 1. Update Auth Profile (Always works regardless of Firestore rules)
    await updateProfile(firebaseUser, { 
      displayName: name,
      photoURL: avatarUrl
    });

    const newUser: User = {
      id: firebaseUser.uid,
      name,
      email,
      role,
      avatar: avatarUrl,
      profile: {
        age: 0,
        height: 0,
        weight: 0,
        gender: 'Other',
        bloodType: 'Unknown',
        allergies: []
      }
    };

    // 2. Save to Firestore (Might fail if rules are not set)
    try {
      await setDoc(doc(db, 'users', firebaseUser.uid), newUser);
      setUser(newUser);
    } catch (e: any) {
      if (e.code === 'permission-denied') {
        console.warn("Firestore write failed: Permission Denied. Please check your Firestore Rules.");
        // We still set the user locally so they can use the app, 
        // but data won't persist in Firestore until rules are fixed.
        setUser(newUser);
      } else {
        throw e;
      }
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isAuthenticated: !!user, loading }}>
      {permissionError && (
        <div className="bg-amber-50 border-b border-amber-200 p-3 text-center text-sm text-amber-800 fixed top-0 left-0 right-0 z-[100]">
          <span className="font-bold">Firebase Setup Required:</span> Please update your Firestore Security Rules in the Firebase Console to enable data storage.
        </div>
      )}
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
