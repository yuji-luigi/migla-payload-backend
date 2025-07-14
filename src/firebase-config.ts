// payload.config.mjs (or your ESM entrypoint)
import admin from 'firebase-admin'

const b64 = process.env.FIREBASE_SECRET_SERVICE_ACCOUNT_B64
if (!b64) throw new Error('Missing FIREBASE_SECRET_SERVICE_ACCOUNT_B64')
const serviceAccount = JSON.parse(Buffer.from(b64, 'base64').toString('utf8'))

export function initFirebaseAdmin() {
  // 5. Initialize Admin SDK
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  })
  console.log('Firebase Admin initialized')
}

// …then export your Payload/Next.js config…
