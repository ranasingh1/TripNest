import { authAdmin } from "../firebase-admin"

export async function verifyFirebaseToken(token: string) {
  try {
    const decoded = await authAdmin.verifyIdToken(token)
    
    return decoded 
  } catch (err) {
    console.error("Token verification failed", err)
    return null
  }
}

//TODO: build a middleware to verify the token and attach the user to the request object but this is not needed for now