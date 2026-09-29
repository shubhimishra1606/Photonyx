import {
  collection,
  doc,
  getDocs,
  getDoc,
  query,
  setDoc,
} from "firebase/firestore";

import { db } from "../firebase";

export const saveUserProfile = async (uid, data) => {
  await setDoc(
    doc(db, "users", uid),
    data,
    { merge: true }
  );
};

export const getUserProfile = async (uid) => {
  const snapshot = await getDoc(doc(db, "users", uid));
  return snapshot.exists() ? snapshot.data() : null;
};

export const saveScan = async (uid, scan) => {
  const scanRef = doc(collection(db, "users", uid, "scans"));
  await setDoc(scanRef, {
    ...scan,
    scannedAt: new Date().toISOString(),
  });
  return scanRef.id;
};

export const getUserScans = async (uid) => {
  const scansQuery = query(collection(db, "users", uid, "scans"));
  const snapshot = await getDocs(scansQuery);
  return snapshot.docs
    .map((scanDoc) => {
      const data = scanDoc.data();
      return {
        id: scanDoc.id,
        ...data,
        plant: String(data.plant || 'Unknown plant'),
        disease: String(data.disease || 'Unknown result'),
        confidence: Number(data.confidence) || 0,
        scannedAt: data.scannedAt || data.timestamp || data.date || '',
      };
    })
    .sort((a, b) => (Date.parse(b.scannedAt) || 0) - (Date.parse(a.scannedAt) || 0));
};
