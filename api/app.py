from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.routes import router
from src.utility import Utility
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_huggingface import HuggingFaceEndpointEmbeddings 
import os
from dotenv import load_dotenv
load_dotenv()

app = FastAPI(
    title="Tubemind" , 
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080", "http://127.0.0.1:8080"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
    
googlekey = os.getenv("GOOGLE_API_KEY")
hfkey = os.getenv("HUGGINGFACEHUB_API_TOKEN")

if not googlekey:
    raise RuntimeError("no api key found for google")
if not hfkey:
    raise RuntimeError("no hf token found")


llm = ChatGoogleGenerativeAI(
    model = "gemini-2.5-flash-lite",
    temperature = 0.2 , 
    google_api_key = googlekey
)

embedder = HuggingFaceEndpointEmbeddings(
    model = "BAAI/bge-base-en-v1.5" , 
    huggingfacehub_api_token = hfkey

)
u_obj = Utility(llm = llm , embedder = embedder)

app.state.utility = u_obj
app.include_router(router=router)
