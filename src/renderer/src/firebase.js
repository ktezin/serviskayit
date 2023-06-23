import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: import.meta.env.RENDERER_VITE_API_KEY,
  authDomain: import.meta.env.RENDERER_VITE_AUTH_DOMAIN,
  projectId: import.meta.env.RENDERER_VITE_PROJECT_ID,
  storageBucket: import.meta.env.RENDERER_VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.RENDERER_VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.RENDERER_VITE_APP_ID,
  measurementId: import.meta.env.RENDERER_VITE_MEASUREMENT_ID
}

const app = initializeApp(firebaseConfig)
export const analytics = getAnalytics(app)
export const auth = getAuth(app)
export const firestore = getFirestore(app)
export default app
