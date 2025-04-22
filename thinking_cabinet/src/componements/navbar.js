import React, { useEffect, useState } from "react";
import { Container, Nav, Navbar, Button } from "react-bootstrap";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import './navbar.css';
import icon from './avatar.png';
import icon2 from './logout.png';
import logo from './LOGO.png'

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
      <Navbar variant="dark" className="navbar">
            <Container style={{textAlign: 'left'}}>
                <Navbar.Brand href="/home" style={{marginRight: "0px"}}><img  src={logo} style={{width: '35%'}}/></Navbar.Brand>
                <Nav.Link href="/cabinetAI-pre" style={{fontSize: '18pt', color: '#1B1D13', fontWeight: '700'}}>CabinetAI</Nav.Link>
                <Navbar.Brand href="/profile"  style={{fontSize: '18pt', color: '#1B1D13', fontWeight: '700', marginLeft: '-560px'}}><img src={icon} style={{width: '13%'}}/></Navbar.Brand>
                {user ? (
                  <Navbar.Brand onClick={handleLogout} style={{marginRight: '-150px', marginLeft: '-795px'}}><img src={icon2} style={{width: '14%'}}/></Navbar.Brand>
                  ) : (
                  <div></div>
                )}
                
            </Container>
        </Navbar>
    );
  };
  
  export default BasicNavbar;