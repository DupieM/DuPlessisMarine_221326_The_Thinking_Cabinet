import React, { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import './Home.css'
import image1 from "../../assets/landing_image.png"
import quate1 from "../../assets/Quoate_1.png"
import quate2 from "../../assets/Quoate_2.png"
import collections from "../../assets/collections.png"
import { Link } from 'react-router-dom';
import ScrollToTopButton from "../../componements/ScrollToTopButton";
import { getDocs, collection, limit } from "firebase/firestore";
import { db } from "../../firebase";

function Home() {

   const [userId, setUserId] = useState("");
   const [showWelcome, setShowWelcome] = useState(true);
   const [usersCollections, setUsersCollections] = useState([]);

    useEffect(() => {
           const auth = getAuth();
           const user = auth.currentUser;
           if (user) {
             setUserId(user.uid);
           } else {
             console.log("No user logged in.");
           }
    }, []);

  useEffect(() => {
    fetchUsersWithCollections().then(data => setUsersCollections(data));
  }, []);

  const fetchUsersWithCollections = async () => {
    try {
      const usersRef = collection(db, "users");
      const usersSnapshot = await getDocs(usersRef);

      // Let's pick 3 random or first 3 users for demo
      const users = usersSnapshot.docs.slice(0, 3);

      const usersCollections = [];

      for (const userDoc of users) {
        const userId = userDoc.id;
        const userData = userDoc.data();

        // fetch user's collections (maybe just 1 collection per user to keep UI simple)
        const collectionsRef = collection(db, "users", userId, "collections");
        const collectionsSnapshot = await getDocs(collectionsRef);

        if (collectionsSnapshot.size > 0) {
          const firstCollectionDoc = collectionsSnapshot.docs[0];
          const collectionId = firstCollectionDoc.id;
          const collectionData = firstCollectionDoc.data();

          // fetch images of this collection
          const imagesRef = collection(db, "users", userId, "collections", collectionId, "images");
          const imagesSnapshot = await getDocs(imagesRef);
          const images = imagesSnapshot.docs.map(doc => doc.data().url);

          usersCollections.push({
            userId,
            userName: userData.displayName || 'Unknown User',
            collectionName: collectionData.collectionName || collectionId,
            images,
          });
        }
      }

      return usersCollections;
    } catch (error) {
      console.error("Error fetching users collections:", error);
      return [];
    }
  };


  const closeWelcome = () => {
    // setShowWelcome(false);
    // Save to localStorage that popup was shown for this user
    if (userId) {
      localStorage.setItem(`welcomeShown_${userId}`, "true");
    }
  };

    return (
      <div>
         {showWelcome && (
          <div className="welcome-modal">
            <div className="modal_content">
              <h3>Welcome to Wunderkammer!</h3>
              <p>We're glad to have you here.</p>
              <button onClick={() => setShowWelcome(false)}>Close</button>
            </div>
          </div>
        )}
      
        <div className="App2">

            <div className="text">
              <img src={image1} className="image"/>

              <p className="paragraph">
                Welcome to The Thinking Cabinet, a unique space for self-reflection, creativity, and discovery. 
                Here, you can create your own Wunderkammer by uploading pictures, with AI generating narratives to 
                bring them to life. Engage in questioning these objects via AI and getting thought-provoking 
                AI-generated answers or crafting your own for deeper reflection.
              </p>

              <br/>

              <Link to={`/cabinetAI-pre`} className="button">
                Get Started
              </Link>
            </div>
            <br/>

            
            <h2 className="heading">Collections by other users</h2>
            
            <br/>

            <div className="collections-grid">
              {usersCollections.length === 0 ? (
                <p>Loading collections...</p>
              ) : (
                usersCollections.map((userCollection, idx) => (
                  <div key={idx} className="collection-card">
                    <h3>{userCollection.collectionName}</h3>
                    <p><em>by {userCollection.userName}</em></p>
                    <div className="images-row">
                      {userCollection.images.length > 0 ? (
                        userCollection.images.map((url, i) => (
                          <img key={i} src={url} alt={`Collection ${userCollection.collectionName} img ${i + 1}`} className="collection-image" />
                        ))
                      ) : (
                        <p>No images</p>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            <br/>

            <img src={quate1} className="quate"/>

            <p className="qoute_text">
              This is a thought provoking platform that challenges <br/>
              assumptions and perspectives
            </p>

            <img src={quate2} className="quate"/>

            <ScrollToTopButton />

            <footer>
                <div className="footer">
                    <h6 className="footer_text">Copyright © 2025 The Thinking Cabinet. All rights reserved.</h6>
                </div>
            </footer>

        </div>
        </div>
    )
}

export default Home;