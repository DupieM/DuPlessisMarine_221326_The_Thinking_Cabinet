import React, { useState, useRef, useEffect } from 'react';
import "./Profile.css";
import { auth, storage, db } from '../../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, updateDoc, getDoc, collection, getDocs } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

function Profile() {
  const [image, setImage] = useState(null);
  const fileInputRef = useRef(null);
  const [user, setUser] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [userData, setUserData] = useState({ displayName: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [collections, setCollections] = useState([]);
  const [selectedCollectionId, setSelectedCollectionId] = useState('');
  const [images, setImages] = useState([]);
  const [selectedNarrative, setSelectedNarrative] = useState('');

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
            password: data.password || '', // Fetch password from Firestore (assumes you saved it)
          });
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
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchUserCollections = async () => {
      if (!user) return;
      try {
        const collectionsRef = collection(db, 'users', user.uid, 'collections');
        const snapshot = await getDocs(collectionsRef);
        const userCollections = snapshot.docs.map(doc => ({
          id: doc.id,
          name: doc.data().collectionName || doc.id,
          narrative: doc.data().narrative || '',
        }));
        setCollections(userCollections);
      } catch (error) {
        console.error('Error fetching collections:', error);
      }
    };

    fetchUserCollections();
  }, [user]);

  const handleCollectionChange = async (e) => {
    const collectionId = e.target.value;
    setSelectedCollectionId(collectionId);
    setImages([]);

    const selectedCollection = collections.find(c => c.id === collectionId);
    setSelectedNarrative(selectedCollection?.narrative || '');

    if (!user || !collectionId) return;

    try {
      const imagesRef = collection(db, 'users', user.uid, 'collections', collectionId, 'images');
      const snapshot = await getDocs(imagesRef);
      const imageData = snapshot.docs.map(doc => ({
        id: doc.id,
        imageUrl: doc.data().imageUrl
      }));
      setImages(imageData);
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  };

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

      <div className="profile-picture-container">
        <div
          className="profile-picture"
          style={{
            backgroundImage: `url(${image ? URL.createObjectURL(image) : (user?.photoURL || 'placeholder-image.png')})`,
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
        <label htmlFor="collectionDropdown">Select a Collection: </label>
        <select
          id="collectionDropdown"
          onChange={handleCollectionChange}
          value={selectedCollectionId}
          style={{ marginLeft: '10px', padding: '5px' }}
        >
          <option value="">-- Choose --</option>
          {collections.map(col => (
            <option key={col.id} value={col.id}>{col.name}</option>
          ))}
        </select>

        {selectedNarrative && (
          <p style={{ marginTop: '10px', fontStyle: 'italic', maxWidth: '500px' }}>
            <strong>Story:</strong> {selectedNarrative}
          </p>
        )}

        <div style={{ display: 'flex', flexWrap: 'wrap', marginTop: '20px' }}>
          {images.map((img, index) => (
            <div key={img.id || index} style={{ margin: '10px' }}>
              <img
                src={img.imageUrl}
                alt={`Image ${index + 1}`}
                style={{ width: '150px', height: '150px', objectFit: 'cover', borderRadius: '8px' }}
              />
            </div>
          ))}
        </div>
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
