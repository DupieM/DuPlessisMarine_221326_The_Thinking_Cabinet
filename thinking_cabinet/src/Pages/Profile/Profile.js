import React, { useState, useRef, useEffect } from 'react';
import "./Profile.css";
import { auth, storage, db } from '../../firebase'; // Assuming your Firebase config is here
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, updateDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

function Profile() {
  const [image, setImage] = useState(null);
  const fileInputRef = useRef(null);
  const [user, setUser] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        setUser(authUser);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe(); // Cleanup the listener on unmount
  }, []);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file); // Store the File object, not the Data URL yet
    }
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleUpload = async () => {
    if (!image || !user) {
      console.error("No image selected or user not logged in.");
      return;
    }

    setUploading(true);
    const imageRef = ref(storage, `users/${user.uid}/profileImage`); // Store in user-specific folder

    try {
      const snapshot = await uploadBytes(imageRef, image);
      const downloadURL = await getDownloadURL(snapshot.ref);

      // Update the user's document in Firestore with the profile image URL
      const userDocRef = doc(db, 'users', user.uid); // Assuming you have a 'users' collection
      await updateDoc(userDocRef, {
        profileImageUrl: downloadURL,
      });

      setImage(null); // Clear the selected image after upload
      alert("Profile image updated successfully!");
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload profile image.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="App2">

      <br/>

      <h2 style={{marginLeft: '70px', fontWeight: 'bold', color: '#ebe4d1', fontSize: '40pt'}}>Update Profile</h2>

      <div className="profile-picture-container">
        <div
          className="profile-picture"
          style={{
            backgroundImage: `url(${image ? URL.createObjectURL(image) : (user?.profileImageUrl || 'placeholder-image.png')})`,
          }}
        >
          {/* Display the temporary preview or the existing URL */}
        </div>
        <button className="upload-button" onClick={handleClick} disabled={uploading}>
          {uploading ? 'Uploading...' : (image ? 'Change Image' : 'Upload Image')}
        </button>
        {image && (
          <button className="save-button" onClick={handleUpload} disabled={uploading}>
            {uploading ? 'Saving...' : 'Save Image'}
          </button>
        )}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          style={{ display: 'none' }}
          ref={fileInputRef}
        />
      </div>

      <br/>

      <h2 style={{marginLeft: '70px', fontWeight: 'bold', color: '#ebe4d1', fontSize: '40pt'}}>Cabinet</h2>

      <footer>
        <div className="footer">
          <h6 className="footer_text">Copyright © 2025 The Thinking Cabinet. All rights reserved.</h6>
        </div>
      </footer>

    </div>
  );
}

export default Profile;