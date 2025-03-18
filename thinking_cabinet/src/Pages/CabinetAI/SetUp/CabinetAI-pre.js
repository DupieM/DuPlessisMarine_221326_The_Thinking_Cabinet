import React, { useState, useEffect } from "react";
import axios from "axios";
import { saveImageToFirestore, saveStoryToFirestore } from "../../../services/DbService";
import { getAuth } from "firebase/auth";

const API_URL = "https://api.openai.com/v1/chat/completions"; // Best practice to set URL as variable.

function CabinetAIPre() {
    const [userId, setUserId] = useState("");
    const [collectionName, setCollectionName] = useState("");
    const [storyName, setStoryName] = useState("");
    const [genre, setGenre] = useState("");
    const [narrative, setNarrative] = useState("");
    const [collectionId, setCollectionId] = useState("");
    const [loading, setLoading] = useState(false);
    const [images, setImages] = useState([]);

    useEffect(() => {
        const auth = getAuth();
        const user = auth.currentUser;
        if (user) {
          setUserId(user.uid);
        } else {
          console.log("No user logged in.");
        }
      }, []);

    // Image upload
    const handleUpload = async (e) => {
        const file = e.target.files[0];
        if (!file || !collectionName.trim()) {
          alert("Please enter a collection name before uploading.");
          return;
        }
    
        const reader = new FileReader();
        reader.onloadend = async () => {
          const imageUrl = reader.result;
          const imageName = file.name;
    
          // Save Image to Firestore
          const savedCollectionId = await saveImageToFirestore(userId, collectionName, imageName, imageUrl);
          if (savedCollectionId && !collectionId) {
            setCollectionId(savedCollectionId);
          }
    
          // Store images locally for display
          setImages((prevImages) => [
            ...prevImages,
            { name: imageName, url: imageUrl },
          ]);
        };
    
        reader.readAsDataURL(file);
      };

      // Call OpenAI to Generate Story
      

      const generateStory = async () => {
          if (!storyName.trim() || !genre.trim()) {
              alert("Please enter a story name and select a genre.");
              return;
          }
      
          setLoading(true);
          try {
              const apiKey = "api_key"; 

              // Build the prompt with image names
              let imageDescriptions = "";
              if (images.length > 0) {
                  imageDescriptions = "The story should incorporate these images and their names: ";
                  images.forEach((img, index) => {
                      imageDescriptions += `${img.name}${index === images.length - 1 ? "" : ", "}`;
                  });
                  imageDescriptions += ". "; // Add a period for better flow
              }
      
              const prompt = `${imageDescriptions}Write a short ${genre} story titled "${storyName}".`;
      
              const response = await axios.post(
                  API_URL, // Use the API_URL variable
                  {
                      model: "gpt-3.5-turbo", // Use a model you have access to.
                      messages: [
                          { role: "system", content: "You are a story writing assistant." }, // Add a system message.
                          { role: "user", content: prompt },
                      ],
                      temperature: 0.7, // Add temperature to control randomness.
                  },
                  {
                      headers: {
                          "Content-Type": "application/json", // Explicitly set content type.
                          Authorization: `Bearer ${apiKey}`,
                      },
                  }
              );
      
              setNarrative(response.data.choices[0].message.content.trim());
          } catch (error) {
              console.error("Error generating story:", error.response ? error.response.data : error);
              alert("Failed to generate story.");
          }
          setLoading(false);
      };

    // Save Story to Firestore
  const handleSaveStory = async () => {
    if (!collectionId) {
      alert("Please upload images first.");
      return;
    }

    await saveStoryToFirestore(userId, collectionId, storyName, genre, narrative);
  };


    // Change name of image
    const handleNameChange = (index, newName) => {
        const updatedImages = [...images];
        updatedImages[index].name = newName;
        setImages(updatedImages);
    };

    return (
        <div className="App2">
        <h2 style={{ marginLeft: "70px", fontWeight: "bold", color: "black", fontSize: "30pt" }}>
          CabinetAI
        </h2>
  
        {/* Collection Name Input */}
        <input
          type="text"
          placeholder="Collection Name"
          value={collectionName}
          onChange={(e) => setCollectionName(e.target.value)}
        />
  
        {/* Upload Image */}
        <input type="file" onChange={handleUpload} />
  
        {/* Image Box Layout */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#aaa",
            padding: "20px",
            borderRadius: "10px",
            marginTop: "20px",
            width: "80%",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          {images.map((img, index) => (
            <div
              key={index}
              style={{
                background: "#ccc",
                padding: "10px",
                borderRadius: "10px",
                margin: "10px",
                textAlign: "center",
              }}
            >
              <img
                src={img.url}
                alt={img.name}
                style={{ width: "80px", borderRadius: "10px" }}
              />
              <input
                type="text"
                value={img.name}
                onChange={(e) => handleNameChange(index, e.target.value)}
                style={{
                  display: "block",
                  marginTop: "5px",
                  padding: "5px",
                  textAlign: "center",
                  width: "90px",
                }}
              />
            </div>
          ))}
        </div>
  
        {/* Story Name Input */}
        <input
          type="text"
          placeholder="Story Name"
          value={storyName}
          onChange={(e) => setStoryName(e.target.value)}
        />
  
        {/* Genre Dropdown */}
        <select value={genre} onChange={(e) => setGenre(e.target.value)}>
          <option value="">Select Genre</option>
          <option value="Fantasy">Fantasy</option>
          <option value="Sci-Fi">Sci-Fi</option>
          <option value="Mystery">Mystery</option>
          <option value="Horror">Horror</option>
        </select>
  
        {/* Generate Story Button */}
        <button onClick={generateStory} disabled={loading}>
          {loading ? "Generating..." : "Generate Story"}
        </button>
  
        {/* Display Generated Story */}
        {narrative && (
          <div style={{ marginTop: "20px", padding: "10px", background: "#eee" }}>
            <h3>{storyName}</h3>
            <p>{narrative}</p>
          </div>
        )}
  
        {/* Save Story Button */}
        <button onClick={handleSaveStory} disabled={!collectionId}>
          Save Story
        </button>
      </div>
    )
}

export default CabinetAIPre;