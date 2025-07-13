// payload.config.mjs (or your ESM entrypoint)
import admin from 'firebase-admin'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// 1. Polyfill __dirname in ESM
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 2. Read the env var
const relPath = process.env.SERVICE_JSON_PATH
if (!relPath) throw new Error('SERVICE_JSON_PATH not defined')

// 3. Resolve against your project root (cwd) or this file’s dir
//    Usually process.cwd() is the project root:
const absPath = path.resolve(process.cwd(), relPath)

// 4. Load & parse the JSON
const raw = fs.readFileSync(absPath, 'utf8')
const serviceAccount = JSON.parse(raw)

export function initFirebaseAdmin() {
  // 5. Initialize Admin SDK
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  })
  console.log('Firebase Admin initialized')
}

// …then export your Payload/Next.js config…
