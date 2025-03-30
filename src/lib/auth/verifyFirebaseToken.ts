import { authAdmin } from "../firebase-admin"

export async function verifyFirebaseToken(token: string) {
  try {
    const decoded = await authAdmin.verifyIdToken(token)
    console.log(decoded, "decoded");
    
    return decoded 
  } catch (err) {
    console.error("Token verification failed", err)
    return null
  }
}
