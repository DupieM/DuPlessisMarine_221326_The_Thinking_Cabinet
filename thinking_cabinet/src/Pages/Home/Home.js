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

            <h2 style={{marginLeft: '70px', fontWeight: 'bold', color: 'black', fontSize: '30pt'}}>Home</h2>

            <br/>

        </div>
    )
}

export default Home;