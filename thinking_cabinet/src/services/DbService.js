import { db } from "../firebase";
import { collection, doc, setDoc, addDoc } from "firebase/firestore";

// Saving images first
export const saveImageToFirestore = async (userId, collectionName, imageName, imageUrl) => {
    if (!userId || !collectionName.trim()) {
        alert("User ID and Collection Name are required!");
        return;
    }

    try {
        const userRef = doc(db, "users", userId);
        const collectionRef = collection(userRef, "collections");
        const collectionDoc = await addDoc(collectionRef, { collectionName });

        await addDoc(collection(collectionDoc, "images"), {
            name: imageName,
            url: imageUrl,
        });

        return collectionDoc.id; // Return collection ID to link later
    } catch (error) {
        console.error("Error saving image:", error);
        alert("Failed to save image. Please try again.");
    }
};

// Saving the info and Story generated
export const saveStoryToFirestore = async (userId, collectionId, storyName, genre, narrative) => {
    if (!userId || !collectionId || !storyName.trim() || !genre.trim() || !narrative.trim()) {
        alert("Missing required fields!");
        return;
    }

    try {
        const userRef = doc(db, "users", userId);
        const collectionRef = doc(userRef, "collections", collectionId);

        await setDoc(collectionRef, { storyName, genre, narrative }, { merge: true });

        alert("Story saved successfully!");
    } catch (error) {
        console.error("Error saving story:", error);
        alert("Failed to save story.");
    }
};