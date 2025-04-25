import React, { useState, useEffect } from "react";
import axios from "axios";
import { saveImageToFirestore, saveStoryToFirestore } from "../../../services/DbService";
import { auth } from "../../../firebase";

const API_URL = "https://api.openai.com/v1/chat/completions";

function CabinetAIPre() {
  const [userId, setUserId] = useState("");
  const [collectionName, setCollectionName] = useState("");
  const [storyName, setStoryName] = useState("");
  const [genre, setGenre] = useState("");
  const [narrative, setNarrative] = useState("");
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [userMessage, setUserMessage] = useState("");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUserId(currentUser?.uid);
    });
    return () => unsubscribe();
  }, []);

  const [collectionId, setCollectionId] = useState(null);
const [selectedImages, setSelectedImages] = useState([]);

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

    // Create collection only once
    let savedCollectionId = collectionId;
    if (!savedCollectionId) {
      savedCollectionId = await saveImageToFirestore(userId, collectionName, imageName, imageUrl);
      setCollectionId(savedCollectionId);
    } else {
      await saveImageToFirestore(userId, collectionName, imageName, imageUrl, savedCollectionId);
    }

    const newImage = { name: imageName, url: imageUrl };
    setImages((prevImages) => [...prevImages, newImage]);
  };

  reader.readAsDataURL(file);
};

const handleImageClick = (image) => {
  setSelectedImages((prevSelected) => {
    const isAlreadySelected = prevSelected.some((img) => img.url === image.url);
    if (isAlreadySelected) {
      return prevSelected.filter((img) => img.url !== image.url);
    } else {
      return [...prevSelected, image];
    }
  });
};

  const handleNameChange = (index, newName) => {
    const updatedImages = [...images];
    updatedImages[index].name = newName;
    setImages(updatedImages);
  };

  // const handleImageClick = (image) => {
  //   setSelectedImage(image);
  // };

  const generateStory = async () => {
    if (!storyName.trim() || !genre.trim()) {
      alert("Please enter a story name and select a genre.");
      return;
    }

    setLoading(true);
    try {
      const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
      let imageDescriptions = "";

      if (images.length > 0) {
        imageDescriptions = "The story should incorporate the following images: ";
        images.forEach((img, index) => {
          imageDescriptions += `${img.name}${index === images.length - 1 ? "" : ", "}`;
        });
        imageDescriptions += ". ";
      }

      const previousStory = narrative.trim()
        ? `Here is a previous version of the story: "${narrative}". Improve it by making it more engaging and descriptive while aligning it with the uploaded images.`
        : "Write a fresh story based on the given theme and images.";

      const prompt = `${imageDescriptions} ${previousStory} The story should be a ${genre} story titled "${storyName}". Ensure that the characters and settings match the uploaded images.`;

      const response = await axios.post(
        API_URL,
        {
          model: "gpt-3.5-turbo",
          messages: [
            { role: "system", content: "You are an advanced AI that generates engaging stories based on user-provided images and text." },
            { role: "user", content: prompt },
          ],
          temperature: 0.7,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
        }
      );

      setNarrative(response.data.choices[0].message.content.trim());
    } catch (error) {
      console.error("Error generating story:", error);
      alert("Failed to generate story.");
    }
    setLoading(false);
  };

  const handleSaveStory = async () => {
    if (!collectionId) {
      alert("Please upload images first.");
      return;
    }
    await saveStoryToFirestore(userId, collectionId, storyName, genre, narrative);
  };

  const handleChat = async () => {
    if (!userMessage.trim()) return;
    const newMessages = [...chatMessages, { role: "user", content: userMessage }];

    try {
      const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
      const response = await axios.post(
        API_URL,
        {
          model: "gpt-3.5-turbo",
          messages: [
            { role: "system", content: "You are an AI assistant knowledgeable about storytelling and image analysis." },
            ...newMessages,
          ],
          temperature: 0.7,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
        }
      );

      const aiResponse = response.data.choices[0].message.content.trim();
      setChatMessages([...newMessages, { role: "assistant", content: aiResponse }]);
      setUserMessage("");
    } catch (error) {
      console.error("Error in chat:", error);
    }
  };

  return (
    <div className="App2">
      <h2>CabinetAI</h2>

      <input
        type="text"
        placeholder="Collection Name"
        value={collectionName}
        onChange={(e) => setCollectionName(e.target.value)}
      />
      <input type="file" onChange={handleUpload} />

      {/* Image Carousel */}
      <div className="carousel" style={{ display: "flex", overflowX: "auto", padding: "10px" }}>
        {images.map((img, index) => (
          <div key={index} style={{ marginRight: "10px", textAlign: "center" }}>
            <img
              src={img.url}
              alt={img.name}
              onClick={() => handleImageClick(img)}
              style={{
                width: "100px",
                height: "100px",
                borderRadius: "10px",
                cursor: "pointer",
                border: selectedImages.some((i) => i.url === img.url) ? "3px solid blue" : "1px solid gray"
              }}
            />
            <input
              type="text"
              value={img.name}
              onChange={(e) => handleNameChange(index, e.target.value)}
              style={{ marginTop: "5px", width: "100px", textAlign: "center" }}
            />
          </div>
        ))}
      </div>

      {/* Selected Image */}
      {selectedImage && (
        <div style={{ marginTop: "20px", textAlign: "center" }}>
          <h4>Selected Image</h4>
          <img src={selectedImage.url} alt={selectedImage.name} style={{ width: "300px", borderRadius: "10px" }} />
        </div>
      )}

      {/* Story Generator */}
      <div style={{ marginTop: "30px" }}>
        <h3>Story Generator</h3>
        <input
          type="text"
          placeholder="Story Name"
          value={storyName}
          onChange={(e) => setStoryName(e.target.value)}
          style={{ marginRight: "10px" }}
        />
        <input
          type="text"
          placeholder="Genre"
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
        />
        <button onClick={generateStory} disabled={loading} style={{ marginLeft: "10px" }}>
          {loading ? "Generating..." : "Generate Story"}
        </button>

        {narrative && (
          <div style={{ marginTop: "20px", whiteSpace: "pre-wrap", backgroundColor: "#f0f0f0", padding: "15px", borderRadius: "8px" }}>
            <h4>Your Story:</h4>
            <p>{narrative}</p>
          </div>
        )}
      </div>

      <button onClick={handleSaveStory} disabled={!collectionId || !narrative} style={{ marginTop: "20px" }}>
        Save Story and Images
      </button>

      {/* AI Chat Assistant */}
      <div style={{ marginTop: "40px" }}>
        <h3>AI Chat Assistant</h3>
        <div style={{ maxHeight: "200px", overflowY: "auto", backgroundColor: "#e8f5e9", padding: "10px", borderRadius: "8px" }}>
          {chatMessages.map((msg, idx) => (
            <div key={idx} style={{ marginBottom: "10px" }}>
              <strong>{msg.role === "user" ? "You" : "AI"}:</strong> {msg.content}
            </div>
          ))}
        </div>

        <div style={{ marginTop: "10px", display: "flex" }}>
          <input
            type="text"
            value={userMessage}
            onChange={(e) => setUserMessage(e.target.value)}
            placeholder="Ask the AI something..."
            style={{ flex: 1, marginRight: "10px" }}
          />
          <button onClick={handleChat}>Send</button>
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

export default CabinetAIPre;