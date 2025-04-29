import { db, storage } from "../firebase";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { collection, addDoc, doc, setDoc, serverTimestamp, getDoc } from "firebase/firestore";

// Save a single image under a collection
export const saveImageToFirestore = async (userId, collectionId, imageName, imageDataUrl) => {
    try {
      const storageRef = ref(storage, `users/${userId}/collections/${collectionId}/${imageName}`);
      
      // Upload image data
      await uploadString(storageRef, imageDataUrl, 'data_url');
      const downloadUrl = await getDownloadURL(storageRef);
  
      // Add image metadata to Firestore under collection
      const imageDocRef = collection(db, "users", userId, "collections", collectionId, "images");
      await addDoc(imageDocRef, {
        name: imageName,
        url: downloadUrl,
        timestamp: serverTimestamp(),
      });
  
      return downloadUrl; // Return for UI use
    } catch (error) {
      console.error("Error saving image:", error);
      throw error;
    }
  };
  
  // Create a new collection and return the new collectionId
  export const createImageCollection = async (userId, collectionName) => {
    try {
      const colRef = doc(collection(db, "users", userId, "collections"));
      await setDoc(colRef, {
        name: collectionName,
        createdAt: serverTimestamp(),
      });
      return colRef.id;
    } catch (error) {
      console.error("Error creating collection:", error);
      throw error;
    }
  };
  
  // Save the story under the same collection
  export const saveStoryToFirestore = async (userId, collectionId, storyName, genre, narrative) => {
    try {
      const storyDocRef = doc(db, "users", userId, "collections", collectionId, "story");
      await setDoc(storyDocRef, {
        title: storyName,
        genre,
        content: narrative,
        timestamp: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error saving story:", error);
      throw error;
    }
  };

  const getStoryText = async (userId, collectionId) => {
    const storyRef = doc(db, "users", userId, "collections", collectionId, "story");
    const storySnap = await getDoc(storyRef);
    if (storySnap.exists()) {
      return storySnap.data().content;
    } else {
      console.warn("No story found.");
      return null;
    }
  };