import React, { useEffect, useState } from "react";
import { Container, Nav, Navbar, Button } from "react-bootstrap";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";

function BasicNavbar() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
  
    useEffect(() => {
      // Listen for authentication changes
      const unsubscribe = auth.onAuthStateChanged((currentUser) => {
        setUser(currentUser);
      });
  
      return () => unsubscribe();
    }, []);

    const handleLogout = async () => {
        try {
          await signOut(auth);
          navigate("/"); // Redirect to login page after logout
        } catch (error) {
          console.error("Logout failed:", error.message);
        }
      };

    return (
      <Navbar variant="dark" style={{backgroundColor: 'darkblue', padding: '0'}}>
            <Container style={{textAlign: 'left'}}>
                <Navbar.Brand href="/home">The Thinking Cabinet</Navbar.Brand>
                <Nav.Link href="/cabinetAI-pre" style={{fontSize: '17pt', color: 'white', fontWeight: 'bold', marginRight: '20px'}}>CabinetAI</Nav.Link>
                <Nav.Link href="/profile" style={{fontSize: '17pt', color: 'white', fontWeight: 'bold'}}>Profile</Nav.Link>
                {user ? (
                    <Button variant="danger" onClick={handleLogout}>
                        Logout
                    </Button>
                    ) : (
                    <div></div>
                )}
            </Container>
        </Navbar>
    );
  };
  
  export default BasicNavbar;