// Firebase Auth Functions
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile} from "firebase/auth";
import { auth, db } from "../firebase";
import { createUserInformation } from "./DbService";
import { doc, setDoc, getDoc } from "firebase/firestore";

// Create an account
export const signUpUser = async (name, email) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email);
      const user = userCredential.user;
  
      // Update Firebase Auth Profile with Name
    await updateProfile(user, { displayName: name });

    // Save user data to Firestore
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      name: name,  // Store name in Firestore
      email: user.email,
    });
  
      return user;
    } catch (error) {
      throw error;
    }
  };
  
  // Login 
  export const loginUser = async (email, password) => {
    try {
      // Sign in user with email and password
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      // Fetch user details from Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (!userDoc.exists()) {
        throw new Error("User not found in database.");
      }
  
      return userDoc.data(); // Return user data
    } catch (error) {
      throw error; // Throw error to be handled in the component
    }
  };
