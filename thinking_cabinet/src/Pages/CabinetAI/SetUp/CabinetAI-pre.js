import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { saveImageToFirestore } from "../../../services/DbService";
import { auth } from "../../../firebase";
import { useSharedData } from "../../../componements/SharedDataProvider";
import '../SetUp/CabinetAI-pre.css'

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
  
    const savedImages = [];
  
    const savedCollectionId = await saveImageToFirestore(
      userId,
      collectionName,
      tempImageList[0].name,
      tempImageList[0].url
    );
  
    savedImages.push({ ...tempImageList[0], id: savedCollectionId });
  
    for (let i = 1; i < tempImageList.length; i++) {
      const id = await saveImageToFirestore(
        userId,
        collectionName,
        tempImageList[i].name,
        tempImageList[i].url,
        savedCollectionId
      );
      savedImages.push({ ...tempImageList[i], id });
    }
  
    setCollectionId(savedCollectionId);
    setImages(savedImages);
    setTempImageList([]);
    setShowSaveButton(false);
    alert(`Collection '${collectionName}' with ${savedImages.length} images saved!`);
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
    <div className="App2">

      <div>
        <p className="Box">
          CabinetAI allows you to bring objects to life through AI-generated stories. 
          Simply upload a picture of an object, watch as AI creates a unique narrative, 
          and save it under a collection name. You can also chat with AI to explore deeper m
          eanings, ask questions, or gain new insights about your object.
        </p>
      </div>


      <h2 className="heading">Your Wunderkammer Objects</h2>

      <div>
      <label
        htmlFor="file-upload"
        style={{
          display: "inline-block",
          width: "100px",
          height: "120px",
          backgroundColor: "#888",
          color: "#fff",
          fontSize: "40px",
          textAlign: "center",
          lineHeight: "120px",
          borderRadius: "20px",
          cursor: "pointer",
          marginRight: "15px",
          userSelect: "none",
        }}
      >
        +
      </label>
      <input
        id="file-upload"
        type="file"
        multiple
        onChange={handleUpload}
        style={{ display: "none" }}
      />
      <p style={{ marginTop: "10px", fontWeight: "bold" }}>{tempImageList.length} images selected</p>

      {/* Carousel Section */}
      <div className="carousel" style={{ display: "flex", overflowX: "auto", padding: "20px 0" }}>
        {[...images, ...tempImageList].map((img, index) => (
          <div
            key={index}
            style={{
              flex: "0 0 auto",
              marginRight: "15px",
              textAlign: "center",
              background: "#fff",
              padding: "10px",
              borderRadius: "20px",
              boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
              width: "120px",
            }}
          >
            <img
              src={img.url}
              alt={img.name}
              style={{
                width: "100%",
                height: "100px",
                objectFit: "cover",
                borderRadius: "12px",
                marginBottom: "10px",
              }}
            />
            <div style={{ fontSize: "14px", fontWeight: "500" }}>{img.name.split(".")[0]}</div>
          </div>
        ))}
      </div>

      {/* Save Button */}
      {showSaveButton && (
        <button
          onClick={handleSaveImages}
          style={{
            padding: "10px 20px",
            backgroundColor: "#4caf50",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold",
            marginTop: "10px",
          }}
        >
          Save All Images to Collection
        </button>
      )}

      {/* Chosen Objects Section */}
      {images.length > 0 && (
        <div style={{ marginTop: "30px" }}>
          <h2 style={{ fontWeight: "600" }}>Chosen Objects</h2>
          <div
            style={{
              display: "flex",
              gap: "10px",
              background: "#a5bfa7",
              padding: "15px",
              borderRadius: "20px",
              marginTop: "10px",
            }}
          >
            {images.map((img, idx) => (
              <img
                key={idx}
                src={img.url}
                alt={img.name}
                style={{
                  width: "60px",
                  height: "60px",
                  borderRadius: "10px",
                  objectFit: "cover",
                }}
              />
            ))}
          </div>
        </div>
      )}
      </div>

      {/* <input type="file" onChange={handleUpload} />
      <p>{tempImageList.length} images selected</p>

      <div className="carousel" style={{ display: "flex", overflowX: "auto" }}>
        {[...images, ...tempImageList].map((img, index) => (
          <div key={index} style={{ marginRight: "10px", textAlign: "center" }}>
            <img src={img.url} alt={img.name} style={{ width: "100px", height: "100px", borderRadius: "10px" }} />
            <div>{img.name}</div>
          </div>
        ))}
      </div>

      {showSaveButton && <button onClick={handleSaveImages}>Save All Images to Collection</button>} */}

      <div className="Stn">
        <h7 className="subheading">What would you like the story to be called?</h7>
        <br/>
        <br/>
        <input className="input" type="text" placeholder="Name of Story" value={storyName} onChange={(e) => setStoryName(e.target.value)} />
      </div>

      <div className="Stn2">
        <h7 className="subheading">What genre is your story?</h7>
        <br/>
        <br/>
        <select className="dropdown" value={genre} onChange={(e) => setGenre(e.target.value)}>
          <option value="">Select Genre</option>
          <option value="Fantasy">Fantasy</option>
          <option value="Sci-Fi">Sci-Fi</option>
          <option value="Adventure">Adventure</option>
          <option value="?????">?????</option>
          <option value="?????">?????</option>
          <option value="?????">?????</option>
          <option value="?????">?????</option>
          <option value="?????">?????</option>
          <option value="?????">?????</option>
        </select>
      </div>

      <Link onClick={handleCreateStory} className="button">Create Story</Link>


      <footer>
        <div className="footer">
          <h6 className="footer_text">Copyright © 2025 The Thinking Cabinet. All rights reserved.</h6>
        </div>
      </footer>

    </div>
  );
}

export default CabinetAIPre;