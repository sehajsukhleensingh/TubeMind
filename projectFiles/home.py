import streamlit as st
# importing all the required functions 
from supportingFuncs import (
    ytUrlId , 
    transcript , 
    translate ,
    notes , 
    importantTopics
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
st.title(" TubeMind ")

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
    
    else:
        st.subheader("Error")
        st.warning("please paste a valid url of the video")

