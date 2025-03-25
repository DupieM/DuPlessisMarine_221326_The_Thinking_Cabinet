import React, { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";

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

            <br/>

            <h2 style={{marginLeft: '70px', fontWeight: 'bold', color: '#203023', fontSize: '30pt'}}>Home</h2>

            <br/>

            <p style={{marginLeft: '60px', marginRight: '60px', backgroundColor: 'white', color: '#203023'}}>
              Welcome to The Thinking Cabinet, a unique space for self-reflection, creativity, and discovery. 
              Here, you can create your own Wunderkammer by uploading pictures, with AI generating narratives to 
              bring them to life. Engage in questioning these objects via AI and getting thought-provoking 
              AI-generated answers or crafting your own for deeper reflection
            </p>

            <br/>

        </div>
    )
}

export default Home;