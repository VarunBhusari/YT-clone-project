YouTube Clone MERN Project
A full-stack YouTube Clone application built with the MERN stack (MongoDB, Express, React, Node.js), featuring user authentication, channels, videos, comments, and more.

https://github.com/VarunBhusari/YT-clone-project

Features
User Authentication with JWT tokens (signup, login, logout)

User Profiles with personal channels

Channels creation, update, and management

Comments on videos with add, edit, delete functionality

Dynamic data fetching with a RESTful API backed by MongoDB

Responsive UI built with React and styled with Tailwind CSS

JWT-secured backend API with protected routes

Seamless integration between backend and frontend using Axios and React Context for auth

Project Structure
text
/backend
  /controllers
    authController.js
    channelController.js
    commentController.js
    videoController.js
  /middleware
    authMiddleware.js
  /models
    user.js
    channel.js
    comment.js
    video.js
  /routes
    auth.js
    channels.js
    comments.js
    videos.js

/frontend
  /src
    /api
      axios.js 
    /components
      FilterBar.jsx
      Header.jsx
      Sidebar.jsx
      VideoCard.jsx
      VideoGrid.jsx
    /context
      AuthContext.jsx 
    /pages
      HomePage.jsx
      ChannelPage.jsx
      VideoPlayerPage.jsx
      UserProfilePage.jsx
      LoginPage.jsx
    App.jsx (routes setup)
    main.jsx (ReactDOM render with BrowserRouter)
    index.css (TailwindCSS styles)
Technologies Used
Backend
Node.js + Express.js REST API

MongoDB + Mongoose ODM

JSON Web Tokens (JWT) for authentication

Bcrypt for password hashing

dotenv for environment variables

CORS middleware

Frontend
React 18+ with functional components and hooks

React Router v6 for routing

Axios for HTTP requests

React Context for global auth state management

Tailwind CSS for styling

React Icons for UI icons

Backend Setup and Run Instructions
Clone the repository and navigate to the backend folder

bash
cd backend
Install dependencies

bash
npm install
Create a .env file with the following environment variables:

text
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_here
PORT=5000

bash
nodemon server.js
or

bash
node server.js
The API will be running on http://localhost:5000/api (or your configured PORT).

Frontend Setup and Run Instructions
Navigate to frontend folder

bash
cd frontend
Install dependencies

bash
npm install
Create a .env file

text
VITE_API_URL=http://localhost:5000/api
(replace with your backend URL if deployed)

Start the React development server

bash
npm run dev
The frontend will usually be available at http://localhost:3000.

Running the Application
Open your browser at http://localhost:3000

You can sign up or log in with existing credentials

Create personal channels and upload your videos metadata

View videos, add comments, like and dislike videos

Each page fetches real-time data from the MongoDB database

API Endpoints Overview
Authentication
POST /api/auth/signup : Register new user

POST /api/auth/login : Login user and get JWT token

GET /api/auth/me : Get current authenticated user

Channels
GET /api/channels : List all channels

POST /api/channels : Create new channel (auth required)

GET /api/channels/:id : Get single channel details

PUT /api/channels/:id : Update existing channel (auth + owner required)

DELETE /api/channels/:id : Delete a channel (auth + owner required)

Videos
GET /api/videos : List videos (supports filters by channelId, category, search)

GET /api/videos/:id : Get video details with comments

PUT /api/videos/:id : Update video (auth + uploader required)

DELETE /api/videos/:id : Delete video (auth + uploader required)

Comments
GET /api/comments/:videoId : Get comments for a video

POST /api/comments/:videoId : Add comment (auth required)

PUT /api/comments/:commentId : Update comment (auth + comment owner required)

DELETE /api/comments/:commentId : Delete comment (auth + comment owner required)

Important Notes
Keep your .env secrets private and never commit them to version control.

Make sure MongoDB is accessible to your backend server.

Frontend JWT token is stored securely in memory and localStorage, sent with each API call requiring authentication.

Tailwind CSS is configured for styling but can be customized or replaced.

Future Improvements
Video file upload and streaming instead of thumbnail images

Enhanced UI/UX components (Sidebar, NavBar, Search)

Real-time updates with WebSocket or similar

Pagination and infinite scroll for videos/comments

Push notifications and subscriptions

License
This project is provided as-is for educational and demonstration purposes.

If you need any help setting up, testing endpoints, or extending the project, feel free to reach out!

Happy coding! 🚀
