import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { saveImageToFirestore } from "../../../services/DbService";
import { auth } from "../../../firebase";
import { useSharedData } from "../../../componements/SharedDataProvider";

function CabinetAIPre() {
  const { setSharedData } = useSharedData();
  const [userId, setUserId] = useState("");
  const [collectionName, setCollectionName] = useState("");
  const [images, setImages] = useState([]);
  const [collectionId, setCollectionId] = useState(null);
  const [storyName, setStoryName] = useState("");
  const [genre, setGenre] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUserId(currentUser?.uid);
    });
    return () => unsubscribe();
  }, []);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const imageUrl = reader.result;
      let imageName = file.name;

      const newName = prompt("Rename your image:", imageName);
      if (newName !== null && newName.trim() !== "") {
        imageName = newName.trim();
      }

      let savedCollectionId = collectionId;
      if (!savedCollectionId && collectionName.trim()) {
        savedCollectionId = await saveImageToFirestore(userId, collectionName, imageName, imageUrl);
        setCollectionId(savedCollectionId);
      } else if (savedCollectionId) {
        await saveImageToFirestore(userId, collectionName, imageName, imageUrl, savedCollectionId);
      }

      const newImage = { name: imageName, url: imageUrl };
      setImages((prev) => [...prev, newImage]);
    };

    reader.readAsDataURL(file);
  };

  const handleCreateCollection = () => {
    if (!collectionName.trim()) {
      alert("Please enter a collection name!");
      return;
    }
    alert(`Collection "${collectionName}" created!`);
  };

  const handleCreateStory = () => {
    if (!storyName.trim() || !genre.trim()) {
      alert("Please enter a story name and select a genre!");
      return;
    }
    console.log("IMAGES before setting sharedData", images);
    setSharedData({ collectionName, storyName, genre, images, collectionId });
    navigate("/cabinetAI-post");
  };

  return (
    <div className="page-container">
      <h2>Your Wunderkammer Objects</h2>

      <input
        type="text"
        placeholder="Collection Name"
        value={collectionName}
        onChange={(e) => setCollectionName(e.target.value)}
      />
      <button onClick={handleCreateCollection}>+ Create Collection</button>

      <input type="file" onChange={handleUpload} />
      <p>{images.length} images selected</p>

      <div className="carousel" style={{ display: "flex", overflowX: "auto" }}>
        {images.map((img, index) => (
          <div key={index} style={{ marginRight: "10px", textAlign: "center" }}>
            <img
              src={img.url}
              alt={img.name}
              style={{ width: "100px", height: "100px", borderRadius: "10px" }}
            />
            <div>{img.name}</div>
          </div>
        ))}
      </div>

      <h3>Create a Story</h3>
      <input
        type="text"
        placeholder="Story Name"
        value={storyName}
        onChange={(e) => setStoryName(e.target.value)}
      />
      <select value={genre} onChange={(e) => setGenre(e.target.value)}>
        <option value="">Select Genre</option>
        <option value="Fantasy">Fantasy</option>
        <option value="Sci-Fi">Sci-Fi</option>
        <option value="Adventure">Adventure</option>
      </select>

      <button onClick={handleCreateStory}>Create Story</button>
    </div>
  );
}

export default CabinetAIPre;