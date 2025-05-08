import React, { useState, useRef, useEffect } from 'react';
import "./Profile.css";
import { auth, storage, db } from '../../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, updateDoc, getDoc, collection, getDocs } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

function Profile() {
  const [image, setImage] = useState(null);
  const fileInputRef = useRef(null);
  const [user, setUser] = useState('');
  const [uploading, setUploading] = useState(false);
  const [userData, setUserData] = useState({ displayName: '', email: '', password: '' });
  const [profileImageUrl, setProfileImageUrl] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [collectionsData, setCollectionsData] = useState([]);

  // Load user data
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        setUser(authUser);
        const userDocRef = doc(db, 'users', authUser.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const data = userDocSnap.data();
          setUserData({
            displayName: data.displayName || authUser.displayName || 'No name set',
            email: authUser.email,
            password: data.password || '',
          });
          setProfileImageUrl(data.profileImageUrl || '');
        } else {
          setUserData({
            displayName: authUser.displayName || 'No name set',
            email: authUser.email,
            password: '',
          });
        }
      } else {
        setUser(null);
        setUserData({ displayName: '', email: '', password: '' });
        setProfileImageUrl('');
      }
    });

    return () => unsubscribe();
  }, []);

  // Load user collections with images and story
  useEffect(() => {
    const fetchUserCollectionsData = async () => {
      if (!user) {
        setCollectionsData([]); // Ensure collectionsData is empty if no user
        console.log('No user logged in, skipping collection fetch.');
        return;
      }
      console.log('Fetching collections for user:', user.uid);
      try {
        const collectionsRef = collection(db, 'users', user.uid, 'collections');
        const snapshot = await getDocs(collectionsRef);
        console.log('Collections snapshot:', snapshot);
        const allCollectionsData = [];

        console.log('...')
        console.log(snapshot.size)
        snapshot.forEach((doc) => {
          console.log(doc.id, " => ", doc.data());
        });

        console.log('...')

        for (const collectionDoc of snapshot.docs) {
          const collectionId = collectionDoc.id;
          const collectionName = collectionDoc.data().collectionName || collectionId;
          console.log('Processing collection:', collectionId, 'Name:', collectionName);

          const imagesRef = collection(db, 'users', user.uid, 'collections', collectionId, 'images');
          const imagesSnapshot = await getDocs(imagesRef);
          const collectionImages = imagesSnapshot.docs
            .filter(doc => doc.id !== 'story')
            .map(doc => ({
              id: doc.id,
              imageUrl: doc.data().url,
            }));
          console.log('Images for collection', collectionId, ':', collectionImages);

          const storyRef = doc(db, 'users', user.uid, 'collections', collectionId, 'images', 'story');
          const storySnap = await getDoc(storyRef);
          const collectionStory = storySnap.exists() ? storySnap.data().narrative : 'No story available';
          console.log('Story for collection', collectionId, ':', collectionStory);

          allCollectionsData.push({
            id: collectionId,
            name: collectionName,
            images: collectionImages,
            story: collectionStory,
          });
        }
        setCollectionsData(allCollectionsData);
        console.log('Fetched collections data:', allCollectionsData);
      } catch (error) {
        console.error('Error fetching collections data:', error);
        setCollectionsData([]); // Handle potential errors by setting to empty
      }
    };

    fetchUserCollectionsData();
  }, [user]);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
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
    const imageRef = ref(storage, `users/${user.uid}/profileImage`);

    try {
      const snapshot = await uploadBytes(imageRef, image);
      const downloadURL = await getDownloadURL(snapshot.ref);

      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, {
        profileImageUrl: downloadURL,
      });

      setProfileImageUrl(downloadURL);
      setImage(null);
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
      <h2 style={{ marginLeft: '70px', fontWeight: 'bold', color: '#ebe4d1', fontSize: '40pt' }}>Update Profile</h2>

      {/* Profile Picture Section */}
      <div className="profile-picture-container">
        <div
          className="profile-picture"
          style={{
            backgroundImage: `url(${image ? URL.createObjectURL(image) : (profileImageUrl || 'placeholder-image.png')})`,
          }}
        />
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

      {/* User Information */}
      <div style={{ marginLeft: '70px', marginTop: '20px', color: '#ebe4d1' }}>
        <p><strong>Name:</strong> {userData.displayName}</p>
        <p><strong>Email:</strong> {userData.email}</p>
        <p>
          <strong>Password:</strong>
          {showPassword
            ? ` ${userData.password}`
            : ` ${'•'.repeat(userData.password.length || 0)}`
          }
          <button
            onClick={() => setShowPassword(!showPassword)}
            style={{ marginLeft: '10px', padding: '2px 6px', fontSize: '0.8em' }}
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </p>
      </div>

      <h2 style={{ marginLeft: '70px', fontWeight: 'bold', color: '#ebe4d1', fontSize: '40pt' }}>Cabinet</h2>

      <div style={{ marginLeft: '70px', color: '#ebe4d1' }}>
        {collectionsData.map(collection => (
          <div key={collection.id} style={{ marginBottom: '30px', padding: '15px', backgroundColor: '#5c7a68', borderRadius: '8px', maxWidth: '800px' }}>
            <h3 style={{ color: '#ebe4d1', fontWeight: 'bold', marginBottom: '10px' }}>{collection.name}</h3>
            {collection.story && (
              <div style={{ marginBottom: '15px', padding: '10px', backgroundColor: '#739072', borderRadius: '5px' }}>
                <strong style={{ color: '#d1c0a3' }}>Story:</strong>
                <p style={{ marginTop: '5px', fontStyle: 'italic', color: '#ebe4d1' }}>
                  {collection.story}
                </p>
              </div>
            )}
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
              {collection.images.map((img, index) => (
                <div key={img.id || index} style={{ margin: '10px', backgroundColor: '#739072', borderRadius: '8px', padding: '8px' }}>
                  <img
                    src={img.imageUrl}
                    alt={`Image ${index + 1}`}
                    style={{ width: '150px', height: '150px', objectFit: 'cover', borderRadius: '8px' }}
                  />
                </div>
              ))}
            </div>
            {collection.images.length === 0 && <p style={{ fontStyle: 'italic', color: '#d1c0a3' }}>No images in this collection.</p>}
          </div>
        ))}
        {collectionsData.length === 0 && <p style={{ fontStyle: 'italic', color: '#d1c0a3' }}>No collections available.</p>}
      </div>

      <footer>
        <div className="footer">
          <h6 className="footer_text">Copyright © 2025 The Thinking Cabinet. All rights reserved.</h6>
        </div>
      </footer>
    </div>
  );
}

export default Profile;