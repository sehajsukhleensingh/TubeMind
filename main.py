import streamlit as st
from langchain_core.messages import AIMessage , HumanMessage
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_huggingface import HuggingFaceEndpointEmbeddings

# importing all the required functions 
from src.utility import Utility

from dotenv import load_dotenv
load_dotenv()

llm = ChatGoogleGenerativeAI(
    model = 'gemini-2.5-flash-lite' , 
    temperature = 0.2
)
embedder = HuggingFaceEndpointEmbeddings( 
        model= "BAAI/bge-base-en-v1.5"
)
service = Utility(llm= llm , embedder= embedder)

#css
with open("cssFile.txt","r") as file:
    st.markdown(f"""<style>{file.read()} </style> """,unsafe_allow_html=True)

st.markdown(""" <div class="fixed-header">
            <div class="header-inner">
                <span class="title">Taurus ♉︎</span>
            </div>
        </div>""" , unsafe_allow_html = True)

st.set_page_config(
    page_title = "ytBuddy" , 
    page_icon= "" , 
    layout= "centered" , 
    initial_sidebar_state= "expanded" 
)

with st.sidebar: 
    st.title("TubeMind")
    st.markdown("Transform any YouTube video into summaries, notes, and an interactive chatbot ")
    st.markdown("---")

    url = st.text_input("YouTube URL : " , placeholder= "https://www.youtube.com")
    language = st.text_input("Enter the video language code (if not English): " , placeholder = "eg : pa - punjabi , hi - hindi , es - spanish")
    
    language = language.strip() or "en"

    taskOpt = st.radio(
        "Choose : " , 
        ["Chat with video (powered by - Gemini-2.5)" ,
         "Get Notes" ,
         "Get Summary" ,
         "Show Transcript of Video"]
    )
    
    submit = st.button("start")


# execution process flow 
if submit:
    if url:

        if taskOpt == "Get Notes":
            with st.spinner("creating the best notes for you"):
                vidNotes = service.notes(url,language)
                st.subheader("NOTES")
                st.write(vidNotes)
                st.markdown("---")
                st.success("keep hustling")

        elif taskOpt == "Get Summary":
            with st.spinner("generating the summary for you"):
                vidImpPoints = service.important_topics(url,language) 
                st.subheader("SUMMARY")
                st.write(vidImpPoints)
                st.markdown("---")
                st.success("keep on grinding")
 
        elif taskOpt == "Show Transcript of Video":
            with st.spinner("printing the transcript"):
                st.subheader("TRANSCRIPT")
                st.write(service.get_transcript(url,language))
                st.markdown("---")
                st.success("keep learning")
        
        elif taskOpt == "Chat with video (powered by - Gemini-2.5)":
            if "vector_store" not in st.session_state:
                with st.spinner("Setting up the enviornment"):
                    st.session_state.vector_store = service.create_embedding_vector_store(url,language)
                    st.session_state.chatHistory = []
    else:
        st.subheader("Error")
        st.warning("please paste a valid url of the video")


# chatBOt session
if taskOpt == "Chat with video (powered by - Gemini-2.5)" and "vector_store" in st.session_state:

    if "chatHistory" in st.session_state:
        for message in st.session_state.chatHistory:
            if isinstance(message,HumanMessage):
                st.write("You: ","\n",message.content)
            elif isinstance(message,AIMessage):
                st.write("Taurus ♉︎: ","\n",message.content)
    
    usrqry = st.chat_input("waiting to clear your doubt ..")
    if usrqry:
        st.session_state.chatHistory.append(HumanMessage(usrqry))
        st.write("You: ","\n",usrqry)
        res = service.rag_work(usrqry , st.session_state.vector_store)
        st.session_state.chatHistory.append(AIMessage(res))
        st.write("Taurus ♉︎: " ,"\n", res)
