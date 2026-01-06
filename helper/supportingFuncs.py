from youtube_transcript_api import YouTubeTranscriptApi
from langchain_text_splitters import RecursiveCharacterTextSplitter
import re


# extracts the ytVid ID from its url 
def ytUrlId(url: str) -> str:
    """
    this function takes Youtube video url as the input and returns the id from the url 
    INPUT:
        url
    OUPUT:
        url id
    """
    try:
        # using the regex 
        pattern = r"(?:v=|\/)([0-9A-Za-z_-]{11}).*"
        match = re.search(pattern, url)

        return match.group(1) if match else None
    
    except:
        return f"Invalid url {url}"


# uses the ytTranscript Api to fetch the transcripts of a yt video 
def transcript_text(ytID: str , lang: str = "en") -> str:
    """
    this function takes Youtube video id as the input and returns the transcripts
    of the video in the language entered by user , default english (en)
    INPUT:
        yt video id 
    OUPUT:
        transcript of the video
    """
    ytAPI = YouTubeTranscriptApi()

    try:
        res = ytAPI.fetch(ytID , languages = [lang])
        # fetches the each text part from different time snippets
        transcript = [text.text for text in res.snippets]
        # combines the whole different "strs" list into a single big "str" 
        transcript = "".join(transcript)
        return transcript
    
    except Exception as e:
        raise RuntimeError("failed to fetch the transcript") from e

    
def create_chunks(transcript: str) -> str:
    """
    this function takes the transcript as the input and create the chuncks of it 
    """
    splitter = RecursiveCharacterTextSplitter(chunk_size = 1000 , chunk_overlap = 100)
    doc = splitter.create_documents([transcript])
 
    return doc

def fetch_prompts(path:str) -> str:
    """
    this function fetches the textual prompts for diff purposes 

    """

    with open(path , "r" , encoding= "utf-8") as file:
        return file.read()