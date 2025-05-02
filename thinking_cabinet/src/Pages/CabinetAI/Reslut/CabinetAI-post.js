import React, { useState } from "react";
import axios from "axios";

import { useSharedData } from "../../../componements/SharedDataProvider";
import { saveStoryToCollection } from "../../../services/DbService";
import '../Reslut/CabinetAI-post.css'

const API_URL = "https://api.openai.com/v1/chat/completions";

function CabinetAIPost() {

  const { sharedData } = useSharedData();
  const [narrative, setNarrative] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [userMessage, setUserMessage] = useState("");

  const [questions] = useState([
    "What inspired the main character?",
    "Describe the setting in more detail.",
    "How do the objects influence the story?",
  ]);

  const extractCollectionId = (url) => {
    if (!url.startsWith("http")) return url; // Already a name like "nature"
    try {
      const decoded = decodeURIComponent(url);
      const segments = decoded.split("/");
      const collectionsIndex = segments.indexOf("collections");
      if (collectionsIndex !== -1 && segments[collectionsIndex + 1]) {
        return segments[collectionsIndex + 1]; // e.g. "nature"
      }
      return "defaultCollection"; // fallback
    } catch (e) {
      return "defaultCollection";
    }
  };

  const generateStory = async () => {
    const { storyName, genre, images } = sharedData;
    const apiKey = process.env.REACT_APP_OPENAI_API_KEY;

    let imageDescriptions = "The story includes these images: ";
    images.forEach((img, i) => {
      imageDescriptions += `${img.name}${i === images.length - 1 ? "" : ", "}`;
    });

    const prompt = `${imageDescriptions}. Write a ${genre} story titled "${storyName}".`;

    const response = await axios.post(
      API_URL,
      {
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are an AI storyteller." },
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

    const generatedStory = response.data.choices[0].message.content.trim();
    setNarrative(generatedStory);
  };

  const handleSaveStory = async () => {
    const { userId, collectionId, storyName, genre, images } = sharedData;
  
    if (!collectionId || !images || images.length === 0) {
      alert("Collection or images missing.");
      return;
    }
  
    const cleanCollectionId = extractCollectionId(collectionId); // Clean collection ID
  
    try {
      // Save the story without specifying an imageId (it will be saved directly under images collection)
      await saveStoryToCollection(userId, cleanCollectionId, storyName, genre, narrative);
      alert("Story saved successfully under images!");
    } catch (error) {
      console.error("Error saving story:", error);
      alert("Failed to save the story.");
    }
  };
  

  const handleChat = async () => {
    if (!userMessage.trim()) return;

    const newMessages = [...chatMessages, { role: "user", content: userMessage }];
    const apiKey = process.env.REACT_APP_OPENAI_API_KEY;

    const response = await axios.post(
      API_URL,
      {
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are an AI storyteller." },
          { role: "user", content: `Here's the full story: ${narrative}` },
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
  };

  return (
    <div className="page-container">
      <h2>Generated Story</h2>
      <button onClick={generateStory}>Generate Story</button>
      <p>{narrative}</p>

      <button onClick={handleSaveStory}>Save Story</button>

      <h3>Chat with AI</h3>
      <select
        onChange={(e) => {
          if (e.target.value) setUserMessage(e.target.value);
        }}
      >
        <option value="">Questions to ask</option>
        {questions.map((q, idx) => (
          <option key={idx} value={q}>
            {q}
          </option>
        ))}
      </select>

      <input
        type="text"
        placeholder="Type your message..."
        value={userMessage}
        onChange={(e) => setUserMessage(e.target.value)}
      />
      <button onClick={handleChat}>Send</button>

      <div className="chat-container">
        {chatMessages.map((msg, idx) => (
          <div key={idx} style={{ textAlign: msg.role === "user" ? "right" : "left" }}>
            <p
              style={{
                background: msg.role === "user" ? "#cce5ff" : "#d4edda",
                padding: "10px",
                borderRadius: "10px",
                display: "inline-block",
              }}
            >
              {msg.content}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CabinetAIPost;