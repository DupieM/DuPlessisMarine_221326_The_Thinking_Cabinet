import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { saveImageToFirestore } from "../../../services/DbService";
import { auth } from "../../../firebase";
import { useSharedData } from "../../../componements/SharedDataProvider";

function CabinetAIPre() {
  const { setSharedData } = useSharedData();
  const [userId, setUserId] = useState("");
  const [images, setImages] = useState([]);
  const [collectionId, setCollectionId] = useState(null);
  const [storyName, setStoryName] = useState("");
  const [genre, setGenre] = useState("");
  const [showSaveButton, setShowSaveButton] = useState(false);
  const [tempImageList, setTempImageList] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUserId(currentUser?.uid);
    });
    return () => unsubscribe();
  }, []);

  const handleUpload = (e) => {
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
      const newImage = { name: imageName, url: imageUrl };
      setTempImageList((prev) => [...prev, newImage]);
      setShowSaveButton(true);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveImages = async () => {
    const collectionName = prompt("Enter a collection name for these images:");
    if (!collectionName || !collectionName.trim()) {
      alert("Collection name is required!");
      return;
    }

    const savedCollectionId = await saveImageToFirestore(userId, collectionName, tempImageList[0].name, tempImageList[0].url);
    for (let i = 1; i < tempImageList.length; i++) {
      await saveImageToFirestore(userId, collectionName, tempImageList[i].name, tempImageList[i].url, savedCollectionId);
    }

    setCollectionId(savedCollectionId);
    setImages(tempImageList);
    setTempImageList([]);
    setShowSaveButton(false);
    alert(`Collection '${collectionName}' with ${images.length} images saved!`);
  };

  const handleCreateStory = () => {
    if (!storyName.trim() || !genre.trim()) {
      alert("Please enter a story name and select a genre!");
      return;
    }
    setSharedData({ userId, collectionId, storyName, genre, images });
    navigate("/cabinetAI-post");
  };

  return (
    <div className="page-container">
      <h2>Your Wunderkammer Objects</h2>
      <input type="file" onChange={handleUpload} />
      <p>{tempImageList.length} images selected</p>

      <div className="carousel" style={{ display: "flex", overflowX: "auto" }}>
        {[...images, ...tempImageList].map((img, index) => (
          <div key={index} style={{ marginRight: "10px", textAlign: "center" }}>
            <img src={img.url} alt={img.name} style={{ width: "100px", height: "100px", borderRadius: "10px" }} />
            <div>{img.name}</div>
          </div>
        ))}
      </div>

      {showSaveButton && <button onClick={handleSaveImages}>Save All Images to Collection</button>}

      <h3>Create a Story</h3>
      <input type="text" placeholder="Story Name" value={storyName} onChange={(e) => setStoryName(e.target.value)} />
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