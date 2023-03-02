import { initializeApp } from 'firebase/app';
import {
  EmailAuthProvider,
  GoogleAuthProvider,
  FacebookAuthProvider,
  getAuth,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  verifyPasswordResetCode,
  confirmPasswordReset,
  applyActionCode,
  reauthenticateWithCredential,
  reauthenticateWithPopup,
  deleteUser,
  updatePassword,
  signOut,
} from 'firebase/auth';
import { format } from 'date-fns';
import {
  getDbUser,
  addDbUser,
  updateDbUser,
  deleteDbUser,
  addDbLogEntry,
} from './db';
import { errorHandler } from './utils';

// Usually, you need to fastidiously guard API keys
// however, API keys for Firebase services are ok to include in code or checked -in config files.
// See https://firebase.google.com/docs/projects/api-keys#api-keys-for-firebase-are-different for more info.
const firebaseConfig = {
  apiKey: 'AIzaSyA1PC7m0wkxpZ2Z9f3GveEXqGNptUm_HKs',
  authDomain: 'aha-exam-fullstack.firebaseapp.com',
  projectId: 'aha-exam-fullstack',
  storageBucket: 'aha-exam-fullstack.appspot.com',
  messagingSenderId: '310620710124',
  appId: '1:310620710124:web:e6c2384b458557f29671c9',
};

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);

const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

const signInWithProvider = async (provider: string) => {
  try {
    const res =
      provider === 'google'
        ? await signInWithPopup(auth, googleProvider)
        : await signInWithPopup(auth, facebookProvider);
    const {
      user: {
        uid,
        displayName,
        email,
        providerData,
        photoURL,
        metadata: { creationTime, lastSignInTime },
      },
    } = res;
    const { providerId } = providerData[0];

    const userData = await getDbUser(uid);

    if (userData.length === 0) {
      await addDbUser(
        uid,
        displayName || '',
        email || '',
        providerId,
        photoURL || '',
        creationTime || '',
        lastSignInTime || '',
        1,
      );
    } else {
      await updateDbUser(
        userData[0].displayName,
        lastSignInTime || '',
        userData[0].timesLoggedIn + 1,
        uid,
      );
    }

    await addDbLogEntry(uid, format(new Date(), 'd/M/y'));
  } catch (err) {
    errorHandler(err);
  }
};

const logInWithEmailAndPassword = async (email: string, password: string) => {
  try {
    const res = await signInWithEmailAndPassword(auth, email, password);
    const {
      user: {
        uid,
        metadata: { lastSignInTime },
      },
    } = res;

    const userData = await getDbUser(uid);
    if (userData.length !== 0)
      await updateDbUser(
        userData[0].displayName,
        lastSignInTime || '',
        userData[0].timesLoggedIn + 1,
        uid,
      );

    await addDbLogEntry(uid, format(new Date(), 'd/M/y'));
  } catch (err) {
    errorHandler(err);
  }
};

const registerWithEmailAndPassword = async (
  displayName: string,
  email: string,
  password: string,
) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const { user } = res;
    const {
      uid,
      metadata: { creationTime, lastSignInTime },
    } = user;

    sendEmailVerification(user);

    await addDbUser(
      uid,
      displayName,
      email,
      'password',
      '',
      creationTime || '',
      lastSignInTime || '',
      1,
    );

    await addDbLogEntry(uid, format(new Date(), 'd/M/y'));
  } catch (err) {
    errorHandler(err);
  }
};

const verifyEmail = async (oobCode: string) => {
  try {
    await applyActionCode(auth, oobCode);
    alert('Email address verified!');
    return true;
  } catch (err) {
    errorHandler(err);
    return false;
  }
};

const sendPasswordReset = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
    alert('Password reset link sent!');
  } catch (err) {
    errorHandler(err);
  }
};

const verifyPasswordReset = async (oobCode: string) => {
  try {
    return await verifyPasswordResetCode(auth, oobCode);
  } catch (err) {
    errorHandler(err);
    return false;
  }
};

const resetPassword = async (oobCode: string, password: string) => {
  try {
    await confirmPasswordReset(auth, oobCode, password);
    alert('Password has been reset!');
  } catch (err) {
    errorHandler(err);
  }
};

const logout = () => {
  signOut(auth);
};

const updateName = async (userId: string, displayName: string) => {
  try {
    const userData = await getDbUser(userId);
    if (userData.length !== 0)
      await updateDbUser(
        displayName,
        userData[0].lastSignInTime,
        userData[0].timesLoggedIn,
        userId,
      );
  } catch (err) {
    errorHandler(err);
  }
};

const reauthenticate = async (password?: string) => {
  try {
    const user = auth.currentUser;
    if (user) {
      const { providerId } = user.providerData[0];
      const { email } = user;

      switch (providerId) {
        case 'password': {
          if (email && password) {
            const credential = EmailAuthProvider.credential(email, password);
            await reauthenticateWithCredential(user, credential);
            return true;
          }
          break;
        }
        case 'google.com': {
          await reauthenticateWithPopup(user, googleProvider);
          return true;
        }
        case 'facebook.com': {
          await reauthenticateWithPopup(user, facebookProvider);
          return true;
        }
        default:
        // Error: unknown provider
      }
    }
    return false;
  } catch (err) {
    errorHandler(err);
    return false;
  }
};

const changePassword = async (password: string) => {
  try {
    const user = auth.currentUser;
    if (user) {
      await updatePassword(user, password);
      alert('Password Updated!');
    }
  } catch (err) {
    if (err instanceof Error) {
      if (err.message === 'Firebase: Error (auth/requires-recent-login).')
        logout();
      console.error(err);
      alert(err.message);
    } else {
      console.log(err);
    }
  }
};

const deleteAccount = async () => {
  try {
    const user = auth.currentUser;
    if (user) {
      const userData = await getDbUser(user.uid);
      if (userData.length !== 0) await deleteDbUser(user.uid);

      await deleteUser(user);
      alert('Account Deleted!');
    }
  } catch (err) {
    if (err instanceof Error) {
      if (err.message === 'Firebase: Error (auth/requires-recent-login).')
        logout();
      console.error(err);
      alert(err.message);
    } else {
      console.log(err);
    }
  }
};

export {
  auth,
  deleteAccount,
  signInWithProvider,
  logInWithEmailAndPassword,
  registerWithEmailAndPassword,
  sendPasswordReset,
  resetPassword,
  logout,
  updateName,
  verifyEmail,
  verifyPasswordReset,
  reauthenticate,
  changePassword,
};
