import streamlit as st
# importing all the required functions 
from supportingFuncs import (
    ytUrlId , 
    transcipt , 
    translate ,
    notes , 
    importantTopics
)

st.set_page_config(
    page_title = "ytBuddy" , 
    page_icon= "" , 
    layout= "centered" , 
    initial_sidebar_state= "expanded" 
)

st.title(" TubeMind ")
st.subheader(" update the text ")


