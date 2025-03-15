import React from "react";
import { Container } from "react-bootstrap";
import { Nav } from "react-bootstrap";
import { Navbar } from "react-bootstrap";

function BasicNavbar() {
    return (
      <Navbar variant="dark" style={{backgroundColor: 'darkblue', padding: '0'}}>
            <Container style={{textAlign: 'left'}}>
                <Navbar.Brand href="/">The Thinking Cabinet</Navbar.Brand>
                <Nav.Link href="/cabinetAI-pre" style={{fontSize: '17pt', color: 'white', fontWeight: 'bold', marginRight: '20px'}}>CabinetAI</Nav.Link>
                <Nav.Link href="/profile" style={{fontSize: '17pt', color: 'white', fontWeight: 'bold'}}>Profile</Nav.Link>
            </Container>
        </Navbar>
    );
  };
  
  export default BasicNavbar;