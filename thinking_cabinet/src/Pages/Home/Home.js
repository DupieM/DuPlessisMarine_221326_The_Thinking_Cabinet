import React, { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import './Home.css'
import image1 from "../../assets/landing_image.png"
import quate1 from "../../assets/Quoate_1.png"
import quate2 from "../../assets/Quoate_2.png"
import collection from "../../assets/collections.png"
import { Link } from 'react-router-dom';

function Home() {

   const [userId, setUserId] = useState("");

   useEffect(() => {
           const auth = getAuth();
           const user = auth.currentUser;
           if (user) {
             setUserId(user.uid);
           } else {
             console.log("No user logged in.");
           }
    }, []);
    

    return (
        <div className="App2">

            <div className="text">
              <img src={image1} className="image"/>

              <p className="paragraph">
                Welcome to The Thinking Cabinet, a unique space for self-reflection, creativity, and discovery. 
                Here, you can create your own Wunderkammer by uploading pictures, with AI generating narratives to 
                bring them to life. Engage in questioning these objects via AI and getting thought-provoking 
                AI-generated answers or crafting your own for deeper reflection.
              </p>

              <br/>

              <Link to={`/cabinetAI-pre`} className="button">
                Get Started
              </Link>
            </div>
            <br/>

            
            <h2 className="heading">Collections by other users</h2>
            
            <br/>

            <div>
              <div>
                <img src={collection} className="collection"/>
                <h1 className="CLN">Collection Name</h1>
                <h3 className="User">User</h3>
              </div>
            </div>

            

            <br/>

            <img src={quate1} className="quate"/>

            <p className="qoute_text">
              “ This is a thought provoking platform that challenges <br/>
              assumptions and perspectives ”
            </p>

            <img src={quate2} className="quate"/>

            <footer>
                <div className="footer">
                    <h6 className="footer_text">Copyright © 2025 The Thinking Cabinet. All rights reserved.</h6>
                </div>
            </footer>

        </div>
    )
}

export default Home;