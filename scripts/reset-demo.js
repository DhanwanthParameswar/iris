const admin = require("firebase-admin");
const { ManagementClient } = require("auth0");
const path = require("path");

// --- CONFIGURATION ---
const GOLDEN_USER_ID = "auth0|6990dce26645b4eb578475c2";

// 1. Initialize Firebase
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
});
const db = admin.firestore();
const bucket = admin.storage().bucket();

// 2. Initialize Auth0
const auth0 = new ManagementClient({
  domain: process.env.AUTH0_DOMAIN,
  clientId: process.env.AUTH0_CLIENT_ID,
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
});

async function main() {
  console.log("🔥 STARTING DAILY SYSTEM RESET 🔥");

  try {
    // --- PART A: AUTH0 CLEANUP ---
    console.log("\n--- Phase 1: Cleaning Auth0 Users ---");
    await cleanAuth0Users();

    // --- PART B: FIREBASE NUKE & PAVE ---
    console.log("\n--- Phase 2: Nuke & Pave Firebase ---");
    await nukeAndPaveFirebase();

    console.log("\n✅✅ SYSTEM RESET COMPLETE ✅✅");
    process.exit(0);
  } catch (error) {
    console.error("\n❌❌ CRITICAL FAILURE ❌❌");
    console.error(error);
    process.exit(1);
  }
}

async function cleanAuth0Users() {
  try {
    // UPDATED FOR AUTH0 SDK v5: uses .list() instead of .getAll()
    const response = await auth0.users.list({ per_page: 100 });

    // v5 returns the data inside a 'data' property
    const userList = response.data;

    if (!userList || userList.length === 0) {
      console.log("No users found in Auth0.");
      return;
    }

    console.log(`Found ${userList.length} users. Checking whitelist...`);

    for (const user of userList) {
      if (user.user_id === GOLDEN_USER_ID) {
        console.log(`🛡️ Skipping Golden User: ${user.email} (${user.user_id})`);
        continue;
      }

      console.log(
        `🗑️ Deleting user: ${user.email || "No Email"} (${user.user_id})`,
      );
      await auth0.users.delete(user.user_id);

      // Tiny throttle
      await new Promise((r) => setTimeout(r, 200));
    }
  } catch (e) {
    console.error("⚠️ Auth0 Cleanup Error:", e.message);
  }
}

async function nukeAndPaveFirebase() {
  // 1. Delete Collections
  console.log("🔥 Deleting Firestore Collections...");
  await deleteCollection(db, "users", 50);
  await deleteCollection(db, "sessions", 50);

  // 2. Delete Storage Files
  console.log("🔥 Deleting Storage Files...");
  const [files] = await bucket.getFiles();
  for (const file of files) {
    await file.delete();
  }

  // 3. Restore Golden Resume
  console.log("⬆️ Uploading Golden Resume...");
  const resumePath = path.join(__dirname, "seed-data/jakes-resume.pdf");

  // Verify file exists before trying to upload (Debugging step)
  if (!require("fs").existsSync(resumePath)) {
    throw new Error(
      `CRITICAL: Resume file not found at ${resumePath}. Did you commit it?`,
    );
  }

  const destination = `resumes/${GOLDEN_USER_ID}.pdf`;

  await bucket.upload(resumePath, {
    destination: destination,
    metadata: { contentType: "application/pdf" },
  });

  // Get long-lived public URL
  const [url] = await bucket.file(destination).getSignedUrl({
    action: "read",
    expires: "03-01-2500",
  });

  // 4. Restore Database Snapshot
  console.log("🌱 Reseeding Firestore...");
  const snapshot = require("./seed-data/db-snapshot.json");

  // Restore User
  const userData = { ...snapshot.user.data, resumeUrl: url };
  await db.collection("users").doc(snapshot.user.id).set(userData);

  // Restore Sessions
  for (const session of snapshot.sessions) {
    const sessionData = {
      ...session.data,
      createdAt: admin.firestore.Timestamp.now(),
    };
    await db.collection("sessions").doc(session.id).set(sessionData);
  }
}

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

main();
