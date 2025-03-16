import React, { useState } from "react";
import { signUpUser, loginUser } from "../../services/authService";
import { useNavigate } from "react-router-dom";

function Authentications() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSignUp, setIsSignUp] = useState(true); // Toggle Sign-up/Login
    const [error, setError] = useState(null);
    const navigate = useNavigate();
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        await signUpUser(name, email, password); // Call service function
        navigate("/home"); // Redirect to home page
      } catch (error) {
        setError(error.message); // Display error message
      }
    };
  

    return(
        <div className="App2">
            <h1>Login and Sign Up</h1>
            <div className="container mt-5">
                <h2>{isSignUp ? "Sign Up" : "Login"}</h2>
                <form onSubmit={handleSubmit}>
                {isSignUp && (  // Show Name field only for Sign-Up
                <div className="mb-3">
                    <label className="form-label">Full Name</label>
                    <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                )}
                    <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <div className="mb-3">
                    <label className="form-label">Password</label>
                    <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    <button type="submit" className="btn btn-primary">
                    {isSignUp ? "Sign Up" : "Login"}
                    </button>
                </form>
                <button className="btn btn-link mt-2" onClick={() => setIsSignUp(!isSignUp)}>
                    {isSignUp ? "Already have an account? Login" : "Need an account? Sign Up"}
                </button>
            </div>
        </div>

        
    )
}

export default Authentications;