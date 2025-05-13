import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { saveImageToFirestore } from "../../../services/DbService";
import { auth } from "../../../firebase";
import { useSharedData } from "../../../componements/SharedDataProvider";
import '../SetUp/CabinetAI-pre.css'
import ScrollToTopButton from "../../../componements/ScrollToTopButton";

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
  
    for (let i = 0; i < tempImageList.length; i++) {
      const id = await saveImageToFirestore(
        userId,
        collectionName,
        tempImageList[i].name,
        tempImageList[i].url,
      );
      savedImages.push({ ...tempImageList[i], id });
    }
  
    setCollectionId(collectionName);
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



      <div className="container_box">      
        <div className="upload-container">
          <p className="upload-heading">Upload your objects</p>

          <label htmlFor="file-upload" className="upload-box">
            +
          </label>
          <input
            id="file-upload"
            type="file"
            multiple
            onChange={handleUpload}
            style={{ display: "none" }}
          />
          <p className="upload-count">{tempImageList.length} images loaded/added</p>
        </div>
        

        {/* Carousel Section */}
        <div className="carousel_box">
          <div className="carousel" style={{ display: "flex", overflowX: "auto", padding: "20px 0" }}>
            {[...images, ...tempImageList].map((img, index) => (
              <div className="image_box" key={index}>
                <img
                  src={img.url}
                  alt={img.name}
                  style={{
                    width: "100px",
                    height: "120px",
                    objectFit: "cover",
                    borderRadius: "12px",
                    marginBottom: "16px",
                  }}
                />
                <div style={{ fontSize: "14px", fontWeight: "500", textAlign: 'center'}}>{img.name.split(".")[0]}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Save Button */}
      {showSaveButton && (
        <button onClick={handleSaveImages} className="save_button">
          Save All Images to Collection
        </button>
      )}

      <div className="Stn">
        <h3 className="subheading">What would you like the story to be called?</h3>
        <input className="input" type="text" placeholder="Name of Story" value={storyName} onChange={(e) => setStoryName(e.target.value)} />
      </div>

      <div className="Stn2">
        <h3 className="subheading">What genre is your story?</h3>
        <select className="dropdown" value={genre} onChange={(e) => setGenre(e.target.value)} style={{width: '270px', fontSize: '15pt', backgroundColor:'#FFFAF4'}}>
          <option value="">Select Genre</option>
          <option value="Romance">Romance</option>
          <option value="Fantasy">Fantasy</option>
          <option value="Science Fiction">Science Fiction</option>
          <option value="Mystery">Mystery</option>
          <option value="Horror">Horror</option>
          <option value="Adventure">Adventure</option>
          <option value="Drama">Drama</option>
          <option value="Poetry">Poetry</option>
          <option value="Thriller">Thriller</option>
        </select>
      </div>

      <button onClick={handleCreateStory} className="button">Create Story</button>

      <ScrollToTopButton />

      <footer>
        <div className="footer">
          <h6 className="footer_text">Copyright © 2025 The Thinking Cabinet. All rights reserved.</h6>
        </div>
      </footer>

    </div>
  );
}

export default CabinetAIPre;