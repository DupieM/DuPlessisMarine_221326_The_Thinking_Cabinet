<br />

![GitHub repo size](https://img.shields.io/github/repo-size/DupieM/duplessismarine_221326_carbontrack)
![GitHub watchers](https://img.shields.io/github/watchers/DupieM/duplessismarine_221326_carbontrack)
![GitHub language count](https://img.shields.io/github/languages/count/DupieM/duplessismarine_221326_carbontrack)
![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/DupieM/duplessismarine_221326_carbontrack)

<!-- HEADER SECTION -->
<h5 align="center" style="padding:0;margin:0;">Mariné du Plessis</h5>
<h5 align="center" style="padding:0;margin:0;">221326</h5>
<h6 align="center">Creative Production 410 (Interactive Development)</h6>
</br>
<p align="center">

  <a href="https://github.com/username/projectname">
    <img src="readme_images/LOGO.png" alt="Logo" width="240" height="120">
  </a>
  
  <h3 align="center">The Thinking Cabinet</h3>

  <p align="center">
    Your AI-powered Wunderkammer of curiosity and reflection. <br>
   <br />
    <a href="https://github.com/DupieM/DuPlessisMarine_221326_The_Thinking_Cabinet/issues">Report Bug</a>
    ·
    <a href="https://github.com/DupieM/DuPlessisMarine_221326_The_Thinking_Cabinet/issues">Request Feature</a>
</p>

<!-- TABLE OF CONTENTS -->
## Table of Contents

* [About the Project](#about-the-project)
  * [Project Description](#project-description)
  * [Built With](#built-with)
* [Getting Started](#getting-started)
  * [Prerequisites](#prerequisites)
  * [How to install](#how-to-install)
* [Features and Functionality](#features-and-functionality)
* [Concept Process](#concept-process)
   * [Ideation](#ideation)
   * [Wireframes](#wireframes)
   * [User-flow](#user-flow)
   * [ERD](#erd-diagram)
* [Development Process](#development-process)
   * [Implementation Process](#implementation-process)
        * [Highlights](#highlights)
        * [Challenges](#challenges)
   * [Reviews and Testing](#peer-reviews)
        * [Reviews](#feedback-from-reviews)
        * [Unit Tests](#unit-tests)
   * [Future Implementation](#peer-reviews)
* [Final Outcome](#final-outcome)
    * [Mockups](#mockups)
    * [Video Demonstration](#video-demonstration)
* [Conclusion](#conclusion)
* [Roadmap](#roadmap)
* [Contributing](#contributing)
* [License](#license)
* [Contact](#contact)
* [Acknowledgements](#acknowledgements)

<!--PROJECT DESCRIPTION-->
## About the Project
<!-- header image of project -->
<img src="" alt="header image" width="580px">

### Project Description

The Thinking Cabinet is an interactive digital platform that fosters reflective thinking and self-exploration. Users can upload meaningful object images, engage with AI to explore their significance, and generate thought-provoking responses. Alternatively, they can select predefined objects to instantly create stories or explore categorized themes through AI-driven conversations for inspiration, reflection, or curiosity.

### Built With

* <a href="https://firebase.google.com/">![Static Badge](https://img.shields.io/badge/firebase-url?style=for-the-badge&logo=firebase&logoColor=black&color=%23FFBF00)</a>
* <a href="https://reactnative.dev/">![Static Badge](https://img.shields.io/badge/react%20native-url?style=for-the-badge&logo=react&color=black)</a>
* <a href="https://github.com/"> ![Static Badge](https://img.shields.io/badge/Github-url?style=for-the-badge&logo=github&color=purple)</a>
* <a href="https://code.visualstudio.com/"> ![Static Badge](https://img.shields.io/badge/visual%20studio-url?style=for-the-badge&logo=visual%20studio&logoColor=blue&color=black&link=https%3A%2F%2Fcode.visualstudio.com%2F)</a>

<!-- GETTING STARTED -->
<!-- Make sure to add appropriate information about what prerequesite technologies the user would need and also the steps to install your project on their own mashines -->
## Getting Started

The following instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

For development, you require to create an account on [Firebase](https://firebase.google.com/).

### How to install

### Installation
Clone the project repository as follow:

1. Go to Github Desktop and then click on clone new repository

2. Enter `https://github.com/DupieM/DuPlessisMarine_221326_The_Thinking_Cabinet.git` into the URL field and press the `Clone` button.

To start the React app do the following steps:

1. Go to Visual Studio code  </br>
   Open your Visual Studio code then click on File and then click on Open folder.
    Then navigate to where you have cloned the repository and open it.

2. Start terminal </br>
   Go to `Terminal` then click on new terminal.

3. Install dependencies </br>
   Enter `npm install` to get all the dependencies

4. Create your own .env file </br>
    Depending on the AI technology you are using (Google/OpenAi) add your `Private Keys` that you generated on either technology to this file.

5. Start the React App </br>
   Enter `npm start` to start d


<!-- FEATURES AND FUNCTIONALITY-->
<!-- You can add the links to all of your imagery at the bottom of the file as references -->
## Features and Functionality

![Authentication]()
### Authentication Page

This page allows users to securely sign up with their name, email, and password or log in with their existing credentials. It includes client-side validation to ensure proper email formatting and password strength, and provides instant feedback for invalid input. Users are redirected to the home screen upon successful login or registration.

</br>

![Home Page]()

### Home Page

This page welcomes users with an introductory message and explains the concept of the Wunderkammer a personalized cabinet of curiosities where users can upload images and generate AI-powered narratives. It also showcases a curated selection of collections created by other users, fostering inspiration and community engagement, while providing easy navigation to start creating your own collection.

</br>

![CabinetAI_pre]()

### CabinetAI-pre Page

This page lets users upload images of their objects to build a “Wunderkammer” collection. Users can rename each image to help the AI generate better, more personalized stories. They then provide a story title and select a genre from a dropdown. Upon clicking "Create Story," this data (user ID, story name, genre, images) is saved in shared state and the user is navigated to the next step (/cabinetAI-post) to generate AI narratives for their collection.

</br>

![CabinetAI_post]()

### CabinetAI-post Page

This page allows users to generate a short AI-written story based on their chosen genre and uploaded images. Users can interact with an AI assistant to ask questions about the story, save their story and images as a collection (“cabinet”) for later access, and navigate to their profile to review saved content. The page also supports regenerating stories and provides a categorized question prompt system to facilitate deeper story exploration.

</br>

![Profile]()

### Profile Page

This page allows users to view and update their personal information including their password and profile picture. They can securely change their password after re-authenticating, and browse through their personal Cabinets containing collections of images and stories. This page provides a centralized hub for managing account details and exploring user-created content.

<!-- CONCEPT PROCESS -->
<!-- Briefly explain your concept ideation process -->
## Concept Process

The `Conceptual Process` is the set of actions, activities and research that was done when starting this project.

### Ideation

<img src="readme_images/Visual_Mind_Map.jpg" alt="Visual Mind Map" width="1000px">
</br>
<img src="readme_images/moodboard.jpg" alt="Moodboard" width="1000px">

### Wireframes

<img src="" alt="Wireframe 1" width="700px">
</br>
<img src="" alt="Wireframe 2" width="700px">
</br>
<img src="" alt="Wireframe 3" width="700px">
</br>
<img src="" alt="Wireframe 4" width="700px">
</br>
<img src="" alt="Wireframe 5" width="700px">
</br>
<img src="" alt="Wireframe 6" width="700px">
</br>

### User-flow

<img src="readme_images/User_Flow.png" alt="user Flow" width="1000px">

### Schema Diagram

<img src="readme_images/Scheme_Diagram.png" alt="schema diagram" width="1000px">

<!-- DEVELOPMENT PROCESS -->

## Development Process

The `Development Process` is the technical implementations and functionality done in the frontend and backend of the application.

### Implementation Process
<!-- stipulate all of the functionality you included in the project -->

* `OpenAI` was used to get generate the story and to be able to chat with AI
* ``

#### Highlights
<!-- stipulated the highlight you experienced with the project -->
* To be able to impliment to chat with AI aboit  astory that it has generated
* To be able to let the user to update their password by creating a new one
* To be able to let the user upload their own profile image and to also be able to save it

#### Challenges
<!-- stipulated the challenges you faced with the project and why you think you faced it or how you think you'll solve it (if not solved) -->
* Trying to figure out how the user will upload a pictures to website and then save it to firebase
* Trying to find out how to save data locally to be able to get them from next page
* Figuring out how by clicking on button that it already starts generating the story
* Also figuring out 

### Reviews & Testing
<!-- stipulate how you've conducted testing in the form of peer reviews, feedback and also functionality testing, like unit tests (if applicable) -->
#### Unit Tests

`Unit Tests` were conducted to establish working functionality by my peers.

* `Kyle Onel` did a unit test of the whole websites and helped me point how how to fix my UI designs to make it more user friendly
* `Tania` did a unit test to tets if all teh functionality was working perfectly.

### Future Implementation
<!-- stipulate functionality and improvements that can be implemented in the future. -->

* To make that the user can also upload more images on the CAbinetAi-post page to help generate new story and create new cabinet
* To make my own coll loaders for generating and saving that looks like a cabinet that is moving.

<!-- MOCKUPS -->
## Final Outcome

### Mockups

![Mockup 1]()
<br>

![Mockup 2]()
<br>

![Mockup 3]()
<br>

![Mockup 4]()
<br>

![Mockup 5]()
<br>

![Mockup 6]()
<br>

<!-- VIDEO DEMONSTRATION -->
### Video Demonstration

To see a run through of the application, click below:

[View Demonstration]()

<!-- ROADMAP -->
## Roadmap

See Future Implementation for a list of proposed features (and known issues).

<!-- CONTRIBUTING -->
## Contributing

Contributions are what makes the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<!-- AUTHORS -->
## Authors

* **Mariné du Plessis** - [username](https://github.com/DupieM)

<!-- LICENSE -->
## License

The Thinking CAbinet Rights reserved © 2025

<!-- LICENSE -->
## Contact

* **Mariné du Plessis** - [email@address](221326@virtualwindow.co.za) 
* **Project Link** - https://github.com/DupieM/DuPlessisMarine_221326_The_Thinking_Cabinet

<!-- ACKNOWLEDGEMENTS -->
## Acknowledgements
<!-- all resources that you used and Acknowledgements here -->
* [??]()
