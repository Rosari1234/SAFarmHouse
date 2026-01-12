## Run Locally

**Prerequisites:**  Node.js, MongoDB Atlas, NextJs

1. Install dependencies:
   `npm install`
2. Set up MongoDB Atlas:
   - Create a free account at https://www.mongodb.com/atlas
   - Create a new cluster
   - Get your connection string from the "Connect" button
   - Replace `<username>`, `<password>`, and `<cluster>` in the connection string
3. Set the environment variables in [.env.local](.env.local):
   - `GEMINI_API_KEY`: Your Gemini API key
   - `MONGODB_URI`: Your MongoDB Atlas connection string
4. Run the app:
   `npm run dev`
