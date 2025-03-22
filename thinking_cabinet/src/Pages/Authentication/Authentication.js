import React, { useState } from "react";
import { signUpUser, loginUser } from "../../services/authService";
import { useNavigate } from "react-router-dom";
import './Authentication.css';
import plantImage from '../../assets/plant.jpg';

function Authentications() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(true);
  const [error, setError] = useState(null);
  const [imageOnRight, setImageOnRight] = useState(false); // Track image position
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isSignUp) {
        await signUpUser(name, email, password);
      } else {
        await loginUser(email, password);
      }
      navigate("/home");
    } catch (error) {
      setError(error.message);
    }
  };

  const toggleForm = () => {
    setIsSignUp(!isSignUp);
    setImageOnRight(!imageOnRight); // Toggle image position along with form
  };

  return (
    <div className="authentication-container">
      {/* Image Container */}
      <div className={`image-container ${isSignUp ? "normal" : "right"}`}>
        <img
          src={plantImage}
          alt="Authentication Background"
          className="authentication-image"
        />
        <button className="toggle-button" onClick={toggleForm}>
          {isSignUp ? "Login" : "Sign Up"}
        </button>
      </div>

      {/* Form Container */}
      <div className={`form-container ${!isSignUp ? "move-left" : ""}`}>
        <h2 className="Heading">{isSignUp ? "Sign Up" : "Login"}</h2>
        <form onSubmit={handleSubmit}>
          {isSignUp && (
            <div className="form-group">
              <label className="labels">Full Name</label> <br/>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}
          <div className="form-group">
            <label className="labels-two">Email</label> <br/>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="labels">Password</label> <br/>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="submit-button">
            {isSignUp ? "Sign Up" : "Login"}
          </button>

          {/* <button className="toggle-button-two">
            Try AI story generater
          </button> */}

        </form>
      </div>
    </div>
  );
}

export default Authentications;