# TubeMind — Watch Smarter , Learn Faster

**TubeMind** is an AI-powered tool that transforms YouTube videos into meaningful knowledge.  
Ask questions, generate notes, get summary , analyze viewer sentiment — all in one intelligent, interactive interface.
Unlike passive viewing, TubeMind lets you interact with video content like a knowledgeable assistant — helping you learn more in less time.

Powered by Retrieval-Augmented Generation (RAG), TubeMind combines transcript retrieval with language models to deliver context-aware, accurate responses grounded in the original video content. From long lectures and podcasts to tutorials and talks, TubeMind turns videos into searchable, explorable intelligence

---

##  Features

-  **Ask Anything** — Enter a YouTube link or topic and query the video like a search engine.  
-  **Smart Notes** — Auto-generate clean summaries, timestamps, and structured insights.  
-  **Summary** - to get the short , accurate and a consise summary of videos ( life saver for husge long loooongg podcasts )
-  **Multi-Video Comparison (Coming Soon)** — Compare insights from multiple videos on the same topic.  
---
##  Project Pictures 
<img src = "https://github.com/sehajsukhleensingh/TubeMind/blob/38046cbabc50d2379b7129b0b206691bc3aa9b79/images/ss1.png" height = "50%" width = "50%" >
<img src = "https://github.com/sehajsukhleensingh/TubeMind/blob/38046cbabc50d2379b7129b0b206691bc3aa9b79/images/ss2.png" height = "50%" width = "50%" >
<img src = "https://github.com/sehajsukhleensingh/TubeMind/blob/38046cbabc50d2379b7129b0b206691bc3aa9b79/images/ss3.png" height = "50%" width = "50%" >

## Flowchart
<img src = "https://github.com/sehajsukhleensingh/TubeMind/blob/38046cbabc50d2379b7129b0b206691bc3aa9b79/images/flowchart.png" alt = "flowchart" height = "50%" width = "50%">
---

## Tech Stack

- **Frontend:** TypeScript based UI
- **Backend:** Python  
- **APIs:** Gemini API, YouTube Transcript API, Hugging Face, Sentiment Analysis Models , sklearn   
- **Env Management:** dotenv  
- **Version Control:** Git & GitHub  

---

##  Setup Instructions

### 1 Clone the Repository
```
git clone https://github.com/sehajsukhleensingh/TubeMind.git
cd TubeMind
```

### 2 Backend setup 
```
# Create virtual environment (Optional but recommended)
python -m venv venv
# Activate: source venv/bin/activate (Mac/Linux) or .\venv\Scripts\activate (Windows)

# Install dependencies
pip install -r requirements.txt

# Create a .env file in the root directory and add the following:
GOOGLE_API_KEY=your_gemini_api_key_here
HF_TOKEN=your_huggingface_token_here

# Run the backend server
uvicorn api.app:app --reload
```

### 3 Frontend setup 
```
cd frontend

# Install Node dependencies
npm install

# Run the development server
npm run dev
```
