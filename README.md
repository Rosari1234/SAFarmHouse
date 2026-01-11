<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/temp/1

## Run Locally

**Prerequisites:**  Node.js, MongoDB Atlas account

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
