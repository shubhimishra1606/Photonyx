import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  reload,
} from "firebase/auth";

import { auth } from "../firebase";

export const signup = async (email, password) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  try {
    await sendEmailVerification(userCredential.user);
  } finally {
    // A newly created account must not keep an authenticated session before verification.
    await signOut(auth);
  }
  return userCredential;
};

export const login = async (email, password) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  await reload(userCredential.user);

  if (!userCredential.user.emailVerified) {
    await sendEmailVerification(userCredential.user);
    await signOut(auth);
    const error = new Error("Please verify your email before logging in.");
    error.code = "auth/email-not-verified";
    throw error;
  }

  return userCredential;
};

export const logout = () => {
  return signOut(auth);
};
