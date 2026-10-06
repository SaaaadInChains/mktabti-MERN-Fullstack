# Maktabti: A MERN-Stack Library Application

Mktabti is a fullstack made with the MERN technology (MongdDB, ExpressJS, ReactJS, NodeJS), inspired from the website https://www.goodreads.com/ to give users a good experience about literature and reading which happens to be one of my passions too.

## Features

- **User authentication** – register, login, logout (JWT), password change, profile pictures, and bio
- **Books & Authors** – browsing, search, detailed pages with covers 
- **Ratings & reviews** – users can rate books from 1 to 5 stars and see average ratings
- **Comments** – users can comment on books and authors
- **Playlists (bookshelves)** – create, edit, delete playlists; add/remove books
- **AI Chatbot** – ask questions about literature and philosophy 
- **Admin & Worker panels** – managing everything with CRUD operations and role management

## Technologies used

| Layer        | Technology                                                                       |
| ------------ | -------------------------------------------------------------------------------- |
| Frontend     | React, TypeScript, Tailwind CSS, CSS, Material UI, Framer Motion, Axios, Lucide Icons |
| Backend      | Node.js, TypeScript, Express, MongoDB, Mongoose, JWT, Argon2                    |
| Cloud for files| Cloudinary                                                                       |
| AI           | Ollama (local LLM)                                                               |
| Container    | Docker / Docker Compose                                                          |

# How to use it

## Prerequisites

- NodeJS
- Npm
- MongoDB
- Cloudinary
- Ollama
- Docker
- Docker Compose
- Git

## Building phase

After installing the prerequisites, creating an account on MongoDB and Cloudinary and getting the necessary (API key and the MongoURI), and turning on Docker, clone the repo and build it:

```bash
# Clone the repo
git clone https://codeberg.org/your-user/maktaba-MERN-Fullstack
cd maktaba-MERN-Fullstack

# Create the .env file and edit it as you like
touch .env
echo '
NODE_ENV=development
PORT=5000 #or any port 
MONGO_URI="your mongodb url"
JWT_SECRET="generate a random key"
OLLAMA_BASE_URL="ollama url"
OLLAMA_MODEL="llama3" #Or the model you are using
CLOUDINARY_CLOUD_NAME="your cloudinary name"
CLOUDINARY_API_KEY="your api key"
CLOUDINARY_API_SECRET="your api secret key"
ENC_KEY="your encryption key"
VITE_API_URL="Your vite url"
ADMIN_EMAIL="admin@something.com"
ADMIN_PASSWORD="some password"
ADMIN_USERNAME="admin"
' >> .env

# Build it with Docker
docker compose up --build
```

Then open **http://localhost:5173**. (Default link)

To pull the AI model (first time only):
```bash
docker compose exec ollama ollama pull llama3 #or any other model as you like
```

To create the admin user:
```bash
docker compose exec server npx tsx src/scripts/createAdmin.ts
```
