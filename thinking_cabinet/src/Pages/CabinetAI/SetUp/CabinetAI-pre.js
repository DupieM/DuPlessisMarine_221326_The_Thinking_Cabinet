import React, { useState, useEffect } from "react";
import axios from "axios";
import { saveImageToFirestore, saveStoryToFirestore } from "../../../services/DbService";
import { auth } from "../../../firebase";

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
    const [chatMessages, setChatMessages] = useState([]);
    const [userMessage, setUserMessage] = useState("");

    useEffect(() => {
      const unsubscribe = auth.onAuthStateChanged((currentUser) => {
        setUserId(currentUser.uid);
        console.log(currentUser)
      });
  
      return () => unsubscribe(); // Cleanup subscription
    }, []);

    // useEffect(() => {
    //     getcurrentUser()
    // }, []);

    // const getcurrentUser = async () => {
    //   const user = await auth.currentUser;
    //     console.log(user)
    //     if (user) {
    //       setUserId(user.uid);
          
    //     } else {
    //       console.log("No user logged in.");
    //     }
    // }

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
            const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
    
            let imageDescriptions = "";
            if (images.length > 0) {
                imageDescriptions = "The story should incorporate the following images: ";
                images.forEach((img, index) => {
                    imageDescriptions += `"${img.name}"${index === images.length - 1 ? "" : ", "}`;
                });
                imageDescriptions += ". ";
            }
    
            let previousStory = narrative.trim()
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

    // AI function to chat
    const handleChat = async () => {
      if (!userMessage.trim()) return;
  
      setChatMessages([...chatMessages, { role: "user", content: userMessage }]); // Add user message to chat
  
      try {
          const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
  
          const response = await axios.post(
              API_URL,
              {
                  model: "gpt-3.5-turbo",
                  messages: [
                      { role: "system", content: "You are an AI assistant knowledgeable about storytelling and image analysis." },
                      ...chatMessages, // Include previous chat history
                      { role: "user", content: userMessage }
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
          setChatMessages([...chatMessages, { role: "user", content: userMessage }, { role: "assistant", content: aiResponse }]); // Add AI response to chat
          setUserMessage(""); // Clear input field
      } catch (error) {
          console.error("Error in chat:", error.response ? error.response.data : error);
      }
  };

    return (
        <div className="App2">
        <h2 style={{ marginLeft: "70px", fontWeight: "bold", color: "black", fontSize: "30pt" }}>
          CabinetAI
        </h2>
  
        <h4>Please enter Collection Name below and upload images</h4>
        <br/>
        {/* Collection Name Input */}
        <input
          type="text"
          placeholder="Collection Name"
          value={collectionName}
          onChange={(e) => setCollectionName(e.target.value)}
        />

      <br/>
  
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
  
        <br/>

        <h4>Please enter a story name and then choose genre of story, then you can gebnerate your story.</h4>

        <br/>

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

        <br/>
        <br/>

        <h4>Please start chatting with AI below about objects and/or story.</h4>

        <br/>

        {/* Chat Function here */}
        <div style={{ marginTop: "20px", padding: "10px", background: "#f5f5f5", borderRadius: "8px" }}>
          <h3>Chat with AI</h3>

          <div style={{ maxHeight: "300px", overflowY: "auto", padding: "10px", border: "1px solid #ddd", background: "#fff" }}>
              {chatMessages.map((msg, index) => (
                  <div key={index} style={{ 
                      textAlign: msg.role === "user" ? "right" : "left", 
                      margin: "5px 0", 
                      padding: "8px", 
                      borderRadius: "6px", 
                      background: msg.role === "user" ? "#d1e7ff" : "#e8e8e8" 
                  }}>
                      <strong>{msg.role === "user" ? "You" : "AI"}:</strong> {msg.content}
                  </div>
              ))}
          </div>

          <input 
              type="text" 
              value={userMessage} 
              onChange={(e) => setUserMessage(e.target.value)} 
              placeholder="Type your message..." 
              style={{ width: "80%", padding: "10px", margin: "10px 0", borderRadius: "5px" }} 
          />

          <button onClick={handleChat} style={{ padding: "10px", cursor: "pointer" }}>Send</button>
      </div>


      </div>
    )
}

export default CabinetAIPre;