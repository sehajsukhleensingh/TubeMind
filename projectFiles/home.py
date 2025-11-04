import streamlit as st
from langchain_core.messages import AIMessage , HumanMessage
# importing all the required functions 
from supportingFuncs import (
    ytUrlId , 
    transcript , 
    translate ,
    notes , 
    importantTopics ,
    createChucks ,
    createEmbeddingVectorStore, 
    ragWork
)
#css
st.markdown("""
        <style>
        html, body, div, span, p, h1, h2, h3, h4, h5, h6, label{
            font-family:"courier" !important;
        }
        </style>
""" , unsafe_allow_html=True # so that streamlit will render it as css 
)
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

    ytUrl = st.text_input("YouTube URL : " , placeholder= "https://www.youtube.com")
    language = st.text_input("Enter the video language code (if not English): " , placeholder = "eg : pa - punjabi , hi - hindi , es - spanish")

    taskOpt = st.radio(
        "Choose : " , 
        ["Chat with video (powered by - Gemini-2.5)" ,
         "Get Notes" ,
         "Get Summary" ,
         "Show Transcript of Video"]
    )
    
    submit = st.button("start")
    st.markdown("---")

# execution process flow 
if submit:
    if ytUrl:
        vidId = ytUrlId(ytUrl)
        with st.spinner("fetching the transcripts"):
            vidTrans = transcript(vidId)

            if language:
                with st.spinner("translating the transcripts"):
                    vidTrans = translate([vidTrans],language=language)
        
        if taskOpt == "Chat with video (powered by - Gemini-2.5)":
            pass

        if taskOpt == "Get Notes":
            with st.spinner("creating the best notes for you"):
                vidNotes = notes(vidTrans)
                st.subheader("NOTES")
                st.write(vidNotes)
                st.markdown("---")
                st.success("keep hustling")

        if taskOpt == "Get Summary":
            with st.spinner("generating the summary for you"):
                vidImpPoints = importantTopics(vidTrans) 
                st.subheader("SUMMARY")
                st.write(vidImpPoints)
                st.markdown("---")
                st.success("keep on grinding")
 
        if taskOpt == "Show Transcript of Video":
            with st.spinner("printing the transcript"):
                st.subheader("TRANSCRIPT")
                st.write(vidTrans)
                st.markdown("---")
                st.success("keep learning")
        
        if taskOpt == "Chat with video (powered by - Gemini-2.5)":
            with st.spinner("creating chat enviornment"):
                chunks = createChucks(vidTrans)
                vectorStore = createEmbeddingVectorStore(chunks)

                st.session_state.vectorStore = vectorStore
                st.session_state.chatHistory = []
            
    else:
        st.subheader("Error")
        st.warning("please paste a valid url of the video")


# chatBOt session
if taskOpt == "Chat with video (powered by - Gemini-2.5)" and "vectorStore" in st.session_state:

    st.subheader("welcome to Taurus")

    if "chatHistory" in st.session_state:
        for message in st.session_state.chatHistory:
            if isinstance(message,HumanMessage):
                st.write("You: ","\n",message.content)
            elif isinstance(message,AIMessage):
                st.write("♉︎ Taurus: ","\n",message.content)
    
    usrqry = st.chat_input("waiting to clear your doubt ..")
    if usrqry:
        st.session_state.chatHistory.append(HumanMessage(usrqry))
        st.write("You: ","\n",usrqry)
        res = ragWork(usrqry , st.session_state.vectorStore)
        st.session_state.chatHistory.append(AIMessage(res))
        st.write("♉︎ Taurus: " ,"\n", res)
