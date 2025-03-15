import React, { useState } from "react";

function CabinetAIPre() {

    const [images, setImages] = useState([]);

    // Image upload
    const handleUpload = (e) => {
        const file = e.target.files[0];
        if(!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            setImages((prev) => [
                ...prev,
                { name: file.name, url: reader.result },
              ]);
        };
        reader.readAsDataURL(file);
    };

    // Change name of image
    const handleNameChange = (index, newName) => {
        const updatedImages = [...images];
        updatedImages[index].name = newName;
        setImages(updatedImages);
    };

    return (
        <div className="App2">

            <br/>

            <h2 style={{marginLeft: '70px', fontWeight: 'bold', color: 'black', fontSize: '30pt'}}>CabinetAI</h2>

            <br/>

            {/* add immage */}

            <h4>Image adder</h4>

            <br/>

            <input type="File" onChange={handleUpload}/>
            
            {/* Image Box Layout */}
            <div
                    style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#aaa",
                    padding: "20px",
                    borderRadius: "10px",
                    marginTop: "20px",
                    width: "80%",
                    marginLeft: "auto",
                    marginRight: "auto",
                    }}
                >
                    {images.map((img, index) => (
                    <div
                        key={index}
                        style={{
                        background: "#ccc",
                        padding: "10px",
                        borderRadius: "10px",
                        margin: "10px",
                        textAlign: "center",
                        }}
                    >
                        <img
                        src={img.url}
                        alt={img.name}
                        style={{ width: "80px", borderRadius: "10px" }}
                        />
                        <input
                        type="text"
                        value={img.name}
                        onChange={(e) => handleNameChange(index, e.target.value)}
                        style={{
                            display: "block",
                            marginTop: "5px",
                            padding: "5px",
                            textAlign: "center",
                            width: "90px",
                        }}
                        />
                    </div>
                    ))}
                </div>

            {/* <div style={{ display: "flex", flexWrap: "wrap", marginTop: "10px"}}>
                {images.map((img, index) => (
                    <div key={index} style={{margin: "10px", textAlign: "center"}}>
                        <img src={img.url} alt={img.name} width="150"/>
                        <p>{img.name}</p>
                    </div>
                ))};
            </div> */}

            <br/>

            <h8>Dropdown Boxes for AI input</h8>

            <br/>

            <h8>AI Story appears here</h8>

            <br/>

        </div>
    )
}

export default CabinetAIPre;