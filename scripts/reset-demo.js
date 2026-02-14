const admin = require("firebase-admin");
const fs = require("fs");
const path = require("path");

// 1. Initialize with Service Account (from GitHub Secrets)
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET, // e.g. 'iris-app.firebasestorage.app'
});

const db = admin.firestore();
const bucket = admin.storage().bucket();

const GOLDEN_USER_ID = "auth0|6990dce26645b4eb578475c2";

async function nukeAndPave() {
  console.log("🔥 Starting Daily Reset Protocol...");

  // --- STEP 1: NUKE FIRESTORE ---
  console.log("🗑️ Deleting all collections...");
  await deleteCollection(db, "users", 50);
  await deleteCollection(db, "sessions", 50);

  // --- STEP 2: NUKE STORAGE ---
  console.log("🗑️ Deleting all files in storage...");
  const [files] = await bucket.getFiles();
  for (const file of files) {
    await file.delete();
  }

  // --- STEP 3: RESTORE RESUME ---
  console.log("⬆️ Uploading Golden Resume...");
  const resumePath = path.join(__dirname, "seed-data/demo-resume.pdf");
  const destination = `resumes/${GOLDEN_USER_ID}.pdf`;

  await bucket.upload(resumePath, {
    destination: destination,
    metadata: { contentType: "application/pdf" },
  });

  // Get public URL (Signed URL with long expiration)
  const [url] = await bucket.file(destination).getSignedUrl({
    action: "read",
    expires: "03-01-2500", // Practically forever
  });

  // --- STEP 4: RESTORE DATABASE ---
  console.log("🌱 Reseeding Database...");
  const snapshot = require("./seed-data/db-snapshot.json");

  // Restore User
  const userData = { ...snapshot.user.data, resumeUrl: url };
  await db.collection("users").doc(snapshot.user.id).set(userData);

  // Restore Sessions
  for (const session of snapshot.sessions) {
    const sessionData = {
      ...session.data,
      createdAt: admin.firestore.Timestamp.now(), // Reset date to "Today" so it looks fresh
    };
    await db.collection("sessions").doc(session.id).set(sessionData);
  }

  console.log("✅ Sandbox Reset Complete. Ready for Demo.");
}

// Helper to delete collections
async function deleteCollection(db, collectionPath, batchSize) {
  const collectionRef = db.collection(collectionPath);
  const query = collectionRef.orderBy("__name__").limit(batchSize);

  return new Promise((resolve, reject) => {
    deleteQueryBatch(db, query, resolve).catch(reject);
  });
}

async function deleteQueryBatch(db, query, resolve) {
  const snapshot = await query.get();
  const batchSize = snapshot.size;
  if (batchSize === 0) {
    resolve();
    return;
  }
  const batch = db.batch();
  snapshot.docs.forEach((doc) => {
    batch.delete(doc.ref);
  });
  await batch.commit();
  process.nextTick(() => {
    deleteQueryBatch(db, query, resolve);
  });
}

nukeAndPave();
