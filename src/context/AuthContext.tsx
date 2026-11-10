import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut,
  updateProfile
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc, 
  collection, 
  getDocs, 
  serverTimestamp 
} from 'firebase/firestore';
import { auth, db, testFirestoreConnection } from '../lib/firebase';
import { handleFirestoreError, OperationType } from '../lib/errorHandler';
import { UserProfile, UserRole } from '../types';
import { INITIAL_RECIPES, INITIAL_ARTICLES, INITIAL_REVIEWS } from '../data/initialData';

// Bootstrapped Admin Emails
const ADMIN_EMAILS = [
  'philopateerosama2004@gmail.com',
  'philopateerosama1926@gmail.com',
  'amanyraafat@gmail.com',
  'admin@eatsmart.com'
];

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  isAdmin: boolean;
  loading: boolean;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  signupWithEmail: (email: string, pass: string, name: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  updateUserData: (data: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  // Test connection on mount
  useEffect(() => {
    testFirestoreConnection();
  }, []);

  // Seed default collections if empty (safe initialization)
  const seedDefaultDataIfEmpty = async (userUid: string, adminStatus: boolean) => {
    if (!adminStatus) return; // Only admin triggers seed
    try {
      const recipesSnap = await getDocs(collection(db, 'recipes'));
      if (recipesSnap.empty) {
        for (const recipe of INITIAL_RECIPES) {
          const newDocRef = doc(collection(db, 'recipes'));
          await setDoc(newDocRef, {
            ...recipe,
            id: newDocRef.id,
            authorId: userUid,
            createdAt: new Date().toISOString()
          });
        }
      }

      const articlesSnap = await getDocs(collection(db, 'articles'));
      if (articlesSnap.empty) {
        for (const article of INITIAL_ARTICLES) {
          const newDocRef = doc(collection(db, 'articles'));
          await setDoc(newDocRef, {
            ...article,
            id: newDocRef.id,
            createdAt: new Date().toISOString()
          });
        }
      } else {
        // Upgrade legacy article images to appropriate medical/hydration photos
        articlesSnap.forEach(async (d) => {
          const data = d.data();
          if (data.imageUrl && data.imageUrl.includes('/assets/')) {
            const title = data.title || '';
            let newUrl = 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&auto=format&fit=crop&q=80';
            if (title.includes('GLP-1') || title.includes('حقن')) {
              newUrl = 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop&q=80';
            } else if (title.includes('الماء') || title.includes('الترطيب')) {
              newUrl = 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?w=800&auto=format&fit=crop&q=80';
            }
            try {
              await setDoc(doc(db, 'articles', d.id), { imageUrl: newUrl }, { merge: true });
            } catch (err) {
              console.warn('Article image migration skipped:', err);
            }
          }
        });
      }

      const reviewsSnap = await getDocs(collection(db, 'reviews'));
      if (reviewsSnap.empty) {
        for (const review of INITIAL_REVIEWS) {
          const newDocRef = doc(collection(db, 'reviews'));
          await setDoc(newDocRef, {
            ...review,
            id: newDocRef.id,
            createdAt: new Date().toISOString()
          });
        }
      }
    } catch (err) {
      console.warn('Seeding initial data skipped or failed:', err);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const emailLower = (currentUser.email || '').toLowerCase().trim();
          const shouldBeAdmin = ADMIN_EMAILS.includes(emailLower);

          // Check if admin doc exists or needs creation
          const adminDocRef = doc(db, 'admins', currentUser.uid);
          let userIsAdmin = false;
          try {
            const adminDoc = await getDoc(adminDocRef);
            if (adminDoc.exists() || shouldBeAdmin) {
              userIsAdmin = true;
              if (!adminDoc.exists() && shouldBeAdmin) {
                await setDoc(adminDocRef, {
                  uid: currentUser.uid,
                  email: currentUser.email,
                  createdAt: new Date().toISOString()
                });
              }
            }
          } catch {
            userIsAdmin = shouldBeAdmin;
          }

          setIsAdmin(userIsAdmin);

          // Fetch user profile from /users/{uid}
          const userDocRef = doc(db, 'users', currentUser.uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            const profile = userDoc.data() as UserProfile;
            // update role if admin status synced
            if (userIsAdmin && profile.role !== 'admin') {
              profile.role = 'admin';
              await setDoc(userDocRef, { role: 'admin' }, { merge: true });
            }
            setUserProfile(profile);
          } else {
            // Create initial profile
            const newProfile: UserProfile = {
              id: currentUser.uid,
              name: currentUser.displayName || (currentUser.email ? currentUser.email.split('@')[0] : 'مشترك جديد'),
              email: currentUser.email || '',
              role: userIsAdmin ? 'admin' : 'user',
              photoURL: currentUser.photoURL || undefined,
              createdAt: new Date().toISOString()
            };
            await setDoc(userDocRef, newProfile);
            setUserProfile(newProfile);
          }

          // Trigger seed if admin
          seedDefaultDataIfEmpty(currentUser.uid, userIsAdmin);
        } catch (error) {
          console.error('Error fetching/syncing user profile:', error);
        }
      } else {
        setUserProfile(null);
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithEmail = async (email: string, pass: string) => {
    try {
      const cleanEmail = email.trim().toLowerCase();
      if (!cleanEmail) {
        throw new Error('يرجى إدخال البريد الإلكتروني');
      }
      if (!pass || pass.length < 6) {
        throw new Error('كلمة المرور يجب أن لا تقل عن 6 أحرف أو أرقام');
      }
      await signInWithEmailAndPassword(auth, cleanEmail, pass);
    } catch (error: any) {
      handleAuthError(error);
    }
  };

  const signupWithEmail = async (email: string, pass: string, name: string) => {
    try {
      const cleanEmail = email.trim().toLowerCase();
      if (!name.trim()) {
        throw new Error('يرجى إدخال الاسم بالكامل');
      }
      if (!cleanEmail) {
        throw new Error('يرجى إدخال البريد الإلكتروني');
      }
      if (!pass || pass.length < 6) {
        throw new Error('كلمة المرور يجب أن لا تقل عن 6 أحرف أو أرقام');
      }

      const res = await createUserWithEmailAndPassword(auth, cleanEmail, pass);
      if (res.user) {
        try {
          await updateProfile(res.user, { displayName: name.trim() });
        } catch (e) {
          console.warn('Profile name update skipped:', e);
        }

        const shouldBeAdmin = ADMIN_EMAILS.includes(cleanEmail);

        const newProfile: UserProfile = {
          id: res.user.uid,
          name: name.trim(),
          email: res.user.email || cleanEmail,
          role: shouldBeAdmin ? 'admin' : 'user',
          createdAt: new Date().toISOString()
        };

        setUserProfile(newProfile);
        setIsAdmin(shouldBeAdmin);

        // Safe Firestore write
        try {
          if (shouldBeAdmin) {
            await setDoc(doc(db, 'admins', res.user.uid), {
              uid: res.user.uid,
              email: cleanEmail,
              createdAt: new Date().toISOString()
            });
          }
          await setDoc(doc(db, 'users', res.user.uid), newProfile);
        } catch (dbErr) {
          console.warn('Firestore profile write deferred:', dbErr);
        }
      }
    } catch (error: any) {
      handleAuthError(error);
    }
  };

  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      const res = await signInWithPopup(auth, provider);
      if (res.user) {
        const emailLower = (res.user.email || '').toLowerCase().trim();
        const shouldBeAdmin = ADMIN_EMAILS.includes(emailLower);

        const newProfile: UserProfile = {
          id: res.user.uid,
          name: res.user.displayName || 'مشترك جديد',
          email: res.user.email || '',
          role: shouldBeAdmin ? 'admin' : 'user',
          photoURL: res.user.photoURL || undefined,
          createdAt: new Date().toISOString()
        };

        setUserProfile(newProfile);
        setIsAdmin(shouldBeAdmin);

        // Safe Firestore sync
        try {
          if (shouldBeAdmin) {
            await setDoc(doc(db, 'admins', res.user.uid), {
              uid: res.user.uid,
              email: emailLower,
              createdAt: new Date().toISOString()
            });
          }

          const userDocRef = doc(db, 'users', res.user.uid);
          const userDoc = await getDoc(userDocRef);
          if (!userDoc.exists()) {
            await setDoc(userDocRef, newProfile);
          }
        } catch (e) {
          console.warn('Firestore google profile sync deferred:', e);
        }
      }
    } catch (error: any) {
      if (error?.code !== 'auth/popup-closed-by-user') {
        handleAuthError(error);
      }
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setUserProfile(null);
    setIsAdmin(false);
  };

  const updateUserData = async (data: Partial<UserProfile>) => {
    if (!user) return;
    try {
      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(userDocRef, data, { merge: true });
      setUserProfile((prev) => (prev ? { ...prev, ...data } : null));
    } catch (error) {
      console.warn('Profile update error:', error);
    }
  };

  const handleAuthError = (error: any) => {
    console.error('Firebase Auth Error:', error);
    const code = error?.code || '';
    const currentHost = typeof window !== 'undefined' ? window.location.hostname : '';
    let msg = error?.message || 'حدث خطأ أثناء تسجيل الدخول، يرجى المحاولة مرة أخرى.';

    if (code === 'auth/operation-not-allowed') {
      msg = 'طريقة تسجيل الدخول غير مفعلة في مشروع Firebase! يرجى فتح Firebase Console > Authentication > Sign-in method وتفعيل خيار (Email/Password) وخيار (Google).';
    } else if (code === 'auth/unauthorized-domain') {
      msg = `الدومين الحالي (${currentHost}) غير مضاف في قائمة النطاقات المصرح بها في Firebase!`;
    } else if (code === 'auth/user-not-found' || code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
      msg = 'البريد الإلكتروني أو كلمة المرور غير صحيحة. يرجى التأكد من كتابتها بشكل سليم.';
    } else if (code === 'auth/email-already-in-use') {
      msg = 'هذا البريد الإلكتروني مسجل بالفعل! اضغط على تبويب "تسجيل الدخول" في الأعلى للدخول بحسابك.';
    } else if (code === 'auth/weak-password') {
      msg = 'كلمة المرور ضعيفة جداً، يرجى كتابة 6 أحرف أو أرقام على الأقل.';
    } else if (code === 'auth/invalid-email') {
      msg = 'صيغة البريد الإلكتروني غير صحيحة.';
    } else if (code === 'auth/popup-blocked') {
      msg = 'المتصفح حظر نافذة تسجيل الدخول المنبثقة (Popup). يرجى السماح بالنوافذ المنبثقة في شريط عنوان المتصفح.';
    } else if (code === 'auth/network-request-failed') {
      msg = 'تعذر الاتصال بخوادم Firebase. تأكد من اتصالك بالإنترنت.';
    } else if (code) {
      msg = `خطأ Firebase (${code}): ${error?.message || 'تأكد من إعدادات Authentication'}`;
    }

    const customError: any = new Error(msg);
    customError.code = code;
    customError.hostname = currentHost;
    throw customError;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        isAdmin,
        loading,
        loginWithEmail,
        signupWithEmail,
        loginWithGoogle,
        logout,
        updateUserData
      }}
    >
      {children}
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
