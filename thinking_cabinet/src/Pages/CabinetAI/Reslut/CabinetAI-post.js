import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSharedData } from "../../../componements/SharedDataProvider";
import { createImageCollection, saveImageToFirestore, saveStoryToCollection } from "../../../services/DbService";
import '../Reslut/CabinetAI-post.css';
import ScrollToTopButton from "../../../componements/ScrollToTopButton";

const API_URL = "https://api.openai.com/v1/chat/completions";

function CabinetAIPost() {
  const { sharedData } = useSharedData();
  const { storyName, genre, images, userId } = sharedData;

  const [narrative, setNarrative] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [userMessage, setUserMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [collectionName, setCollectionName] = useState("");

  const [questions] = useState({
    Debater: [
      "What assumptions does the main character make, and are they justified?",
      "Could the antagonist’s actions be seen as rational in any way?",
      "What ethical dilemmas are presented, and how are they resolved?",
      "Is the protagonist's victory truly deserved?",
      "How might a different character interpret these events?",
      "Were any key decisions rushed or flawed?",
      "Does the story present one-sided viewpoints?",
      "What might a skeptic say about the ending?",
    ],
    Philosopher: [
      "What does this story reveal about human nature?",
      "Are fate and free will at play in this narrative?",
      "How does the story define ‘good’ and ‘evil’?",
      "What moral or lesson lies beneath the plot?",
      "Does the story challenge conventional values?",
      "Is suffering necessary for growth in this story?",
      "How does the story explore identity or self-discovery?",
      "What deeper truth does the story try to express?",
    ],
    Therapist: [
      "What trauma or unresolved issue drives the main character?",
      "How does the protagonist evolve emotionally?",
      "What role do relationships play in character development?",
      "What fears or insecurities are hidden in the characters?",
      "Is there emotional healing by the end of the story?",
      "What does the story say about forgiveness?",
      "How are conflict and communication portrayed?",
      "What coping mechanisms are visible in the characters?",
    ],
    Muse: [
      "What would happen if the setting changed completely?",
      "Can you rewrite the story from another character’s perspective?",
      "What magical or sci-fi twist could be added?",
      "What if the main character had made the opposite decision?",
      "How would this story look as a poem or song?",
      "Can you describe a sequel to this story?",
      "What metaphor best represents the story’s journey?",
      "How could a visual artist bring this story to life?",
    ],
    Personal: [
      "Which character do you most relate to, and why?",
      "Has anything in your life mirrored a moment in the story?",
      "What part of the story moved you emotionally?",
      "Would you have made the same decisions as the protagonist?",
      "What did this story remind you of in your own experience?",
      "How did this story make you feel overall?",
      "What would you do differently if you were in the story?",
      "Does this story reflect a dream or fear you’ve had?",
    ],
  });

  const [selectedCategory, setSelectedCategory] = useState("");

  // Auto-generate story on page load
  useEffect(() => {
    const generateStory = async () => {
      const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
      let imageDescriptions = "The story includes these images: ";
      images.forEach((img, i) => {
        imageDescriptions += `${img.name}${i === images.length - 1 ? "" : ", "}`;
      });

      const prompt = `${imageDescriptions}. Write a ${genre} story titled "${storyName}" using around 150 to 200 words.`;

      try {
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

        let generatedStory = response.data.choices[0].message.content.trim();

        // Remove the title if it's part of the generated story
        if (generatedStory.toLowerCase().startsWith(storyName.toLowerCase())) {
          generatedStory = generatedStory.slice(storyName.length).trim();
        }

        setNarrative(generatedStory);
      } catch (error) {
        console.error("Error generating story:", error);
      }
    };

    generateStory();
  }, [images, genre, storyName]);


  const handleChat = async () => {
    if (!userMessage.trim()) return;

    const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
    const systemPrompt = "You are an AI assistant designed to discuss a user's story. Please respond to questions and prompts about the story in no more than 60 words.";
    const messagesToSend = [
      { role: "system", content: systemPrompt },
      { role: "user", content: `Here's the full story: ${narrative}` },
      ...chatMessages,
      { role: "user", content: userMessage },
    ];

    try {
      const response = await axios.post(
        API_URL,
        {
          model: "gpt-3.5-turbo",
          messages: messagesToSend,
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
      setChatMessages([...chatMessages, { role: "user", content: userMessage }, { role: "assistant", content: aiResponse }]);
      setUserMessage("");
    } catch (error) {
      console.error("Error in chat:", error);
    }
  };

  const handleSubmit = async () => {
    if (!collectionName.trim()) {
      alert("Please enter a collection name.");
      return;
    }

    try {
      // 1. Create the collection and get its ID
      const collectionId = await createImageCollection(userId, collectionName);

      // 2. Save the story to the 'stories' subcollection
      await saveStoryToCollection(
        userId,
        collectionId,
        storyName,
        genre,
        narrative
      );

      // 3. Save each image to the 'images' subcollection
      for (const image of images) {
        await saveImageToFirestore(
          userId,
          collectionId,
          image.name,
          image.url
        );
      }

      alert("Story and images saved successfully!");
      setShowPopup(false);
    } catch (error) {
      console.error("Error saving data:", error);
      alert("Failed to save the story and images.");
    }
  };

  return (
    <div className="App2">
      <h2 className="heading">Your Story Preview</h2>

      {/* Display images */}
      <div className="image-grid">
        {images.map((img, index) => (
          <img key={index} src={img.url} alt={img.name} className="story-image"  style={{width: '300px', height: '300px'}}/>
        ))}
      </div>

      <p style={{color: '#ebe4d1'}}><strong>Story Name:</strong> {storyName}</p>
      <p style={{color: '#ebe4d1'}}><strong>Genre:</strong> {genre}</p>

      {/* Generated story */}
      <div className="story-output">
        <h3>Generated Story</h3>
        <p>{narrative}</p>
      </div>

      {/* Submit Button (triggers popup) */}
      <button className="btn-save" onClick={() => setShowPopup(true)}>Submit</button>

      {/* Popup for collection name */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <h3>Enter Collection Name</h3>
            <input
              type="text"
              value={collectionName}
              onChange={(e) => setCollectionName(e.target.value)}
              placeholder="e.g., MagicalRealismStories"
              className="popup-input"
            />
            <button className="btn-save" onClick={handleSubmit}>Confirm Save</button>
            <button className="btn-cancel" onClick={() => setShowPopup(false)}>Cancel</button>
          </div>
        </div>
      )}

      {/* AI Chat Section */}
      <h3 className="heading">Ask AI about your story:</h3>
      <div className="chat-section">
        <div className="chat-container">
          {chatMessages.map((msg, idx) => (
            <div
              key={idx}
              className={`chat-message ${msg.role === "user" ? "user" : "ai"}`}
            >
              {msg.content}
            </div>
          ))}
        </div>

        <div className="chat-input-group">
          <input
            className="chat-input"
            type="text"
            placeholder="Type your question..."
            value={userMessage}
            onChange={(e) => setUserMessage(e.target.value)}
          />
          <button className="btn-send" onClick={handleChat}>Send</button>
        </div>

        <select
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="dropdown"
        >
          <option value="">Pick a category...</option>
          {Object.keys(questions).map((category, idx) => (
            <option key={idx} value={category}>{category}</option>
          ))}
        </select>

        <select
          onChange={(e) => e.target.value && setUserMessage(e.target.value)}
          className="dropdown"
        >
          <option value="">Pick a question...</option>
          {selectedCategory && questions[selectedCategory].map((question, idx) => (
            <option key={idx} value={question}>{question}</option>
          ))}
          {!selectedCategory && <option value="" disabled>Please select a category first</option>}
        </select>
      </div>

      <ScrollToTopButton />

      <footer>
        <div className="footer">
          <h6 className="footer_text">Copyright © 2025 The Thinking Cabinet. All rights reserved.</h6>
        </div>
      </footer>
    </div>
  );
}

export default CabinetAIPost;