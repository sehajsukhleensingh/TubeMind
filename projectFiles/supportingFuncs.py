import re 
from youtube_transcript_api import YouTubeTranscriptApi
import time
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import PromptTemplate
from dotenv import load_dotenv
load_dotenv()

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
def transcript(ytID: str , lang: str = "en") -> str:
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
        transcript = ["".join(transcript)]
        return transcript
    
    except Exception as e:
        return f"failed to fetch the transcript , error = {e}"


modl = ChatGoogleGenerativeAI(
    model = "gemini-2.5-flash-lite" , 
    temperature = 0.2 
)


# translates the trascript to the preffered language , default = english 
def translate(transcript: list[str] , language: str = "english") -> str:
    """this function takes transcript as the input and returns the translated version of 
    transcript in the language given input by user 
    INPUT:
        transcript
    OUPUT:
        translated version of transcript
    """
    promptTranslate = PromptTemplate(
        template =  """
        ### ROLE & CONTEXT
        You are a master-level translator and linguistic specialist. You possess deep, nuanced knowledge of both the source language of the provided transcript and the target language, {language}. Your expertise extends beyond simple word-for-word translation to include a profound understanding of cultural context, idiomatic expressions, tone, and subtext.

        ### YOUR TASK
        Your sole task is to translate the provided text transcript into [Specify Target Language Here]. The output must be a pure translation. You will not add any commentary, notes, or explanations.

        ### CORE DIRECTIVES & STRICT CONSTRAINTS
        You must adhere to the following rules without exception:

        1.  **Absolute Fidelity:** The translation must be a perfect mirror of the original text's meaning. Preserve the full, intended meaning, including all nuances, implications, and subtext.
        2.  **Tone & Style Preservation:** Replicate the original tone and style precisely. If the original is formal, informal, academic, casual, humorous, or serious, the translation must convey the exact same stylistic feeling.
        3.  **No Omissions or Additions:** You must not omit *any* information, words, or even filler sounds (like "uh" or "um") if they are in the transcript. You must not add *any* new information, clarifications, or explanations that were not in the original.
        4.  **Maintain Perspective (Voice):** The speaker's perspective must be identical. If the original uses "I," "we," or "you," the translation must maintain that exact first-person, second-person, or third-person perspective. Do not, under any circumstances, rewrite the text into a third-person narrative or change the speaker's voice.
        5.  **No Summarization or Simplification:** Do not summarize, paraphrase, or simplify any part of the text. If the original text is complex, verbose, or contains jargon, your translation must be equally complex, verbose, or use the closest equivalent jargon in the target language.
        6.  **Cultural & Idiomatic Equivalence:** When encountering idioms, slang, or culturally specific references, you will not provide a literal, nonsensical translation. Instead, you will find the *closest equivalent idiom or expression* in the target language that preserves the original *meaning and feeling*. If no direct equivalent exists, you will translate the *meaning* of the phrase while maintaining its original stylistic intent.
        7.  **Contextual Integrity:** The translation must make sense within the full context of the transcript. You will consider the preceding and succeeding text to ensure all ambiguous words are translated with their correct, context-dependent meaning.

        ### INPUT TEXT
        (The text to be translated will follow this prompt)

        {transcript}

        ### EXPECTED OUTPUT
        (Provide *only* the translated text. Do not write "Here is the translation:" or any other prefix.)
    """ ,

    input_variables = ['transcript','language']
    )

    try : 
        chainTranslate = promptTranslate | modl 
        res = chainTranslate.invoke({"transcript":transcript,"language":language})

        return res.content
    
    except Exception as e:
        return f"failed to translate error occured {e}"


def notes(transcript: list[str]) -> str:
    """
    this function takes transcript as the input and returns well jotted notes 
    of the given transcript
    INPUT:
        transcript
    OUPUT:
        notes based on the transcript
    """

    promptNotes = PromptTemplate(
        template="""
        ### ROLE & CONTEXT
        You are an expert knowledge synthesizer and academic rapporteur. You possess the advanced analytical skill to deconstruct complex information from a transcript and reorganize it into a structured, high-fidelity set of notes. Your goal is comprehension, not brevity.

        ### YOUR TASK
        Your task is to analyze the provided transcript and generate a comprehensive set of structured notes in  English. The notes must serve as a complete and accurate proxy for the original content, organized for study and review.

        ### CORE DIRECTIVES & STRICT CONSTRAINTS
        You must adhere to the following rules without exception:

        1.  **Preserve Core Meaning:** While you will restructure the content, you must not simplify, distort, or "dumb down" the original concepts. The full nuance and complexity of all arguments, data, and definitions must be retained.
        2.  **No External Information:** Your notes must be 100percent derived from the transcript. Do not add any external knowledge, clarifications, or opinions.
        3.  **Maintain Speaker's Voice:** All notes should reflect the speaker's original perspective and tone. If the speaker uses "I believe..." or "We found...", your notes must capture that first-person perspective. Do not rewrite into a passive or third-person voice (e.g., "The speaker believes...").
        4.  **Logical Structure:** This is not a summary. You will organize the output into logical sections. Use clear markdown headings (##) and bullet points (*) to create a hierarchy of information. Good sections to use might be:
            * **Main Thesis / Objective:** The central goal or argument.
            * **Key Concepts & Definitions:** All primary terms explained.
            * **Core Arguments & Evidence:** Each main point, followed by its supporting data or logic.
            * **Examples & Case Studies:** Any specific illustrations used.
            * **Conclusions & Actionable Takeaways:** The final summary and any instructions given.
        5.  **Comprehensive Coverage:** Do not omit any *significant* concept, argument, or data point. While you will filter out filler words ("um," "ah") and redundancies, you must capture the *entire logical chain* of the speaker.

        ### INPUT TEXT
        (The text to be analyzed will follow this prompt)

        {transcript}

        ### EXPECTED OUTPUT
        (Provide *only* the structured markdown notes. Do not add any conversational prefix.)""" ,

        input_variables= ['transcript']
    )

    try:
        chainNotes = promptNotes | modl
        res = chainNotes.invoke({"transcript":transcript})

        return res.content
    
    except Exception as e:
        return f"failed to create the notes , error {e}"
    

def importantTopics(transcript: list[str]):
    """
    this function takes transcript as the input and returns the important topics 
    of the given transcript
    INPUT:
        transcript
    OUPUT:
        important topics from the transcript
    """

    promptImpTopics = PromptTemplate(
        template="""
        ### ROLE & CONTEXT
        You are a top-tier executive analyst and editor. Your primary skill is to listen to a large volume of information and instantly identify the "signal in the noise." You excel at filtering content to find only the most mission-critical, high-priority points.

        ### YOUR TASK
        Your sole task is to analyze the provided transcript and "jot out" a concise, bulleted list of , only the *most important key 5 points * in [Specify Language, e.g., English]. This list is for someone who has no other time to review the content.

        ### CORE DIRECTIVES & STRICT CONSTRAINTS
        You must adhere to the following rules without exception:

        1.  **Extreme Prioritization:** This is not a summary. You must make hard choices and select *only* the absolute most essential takeaways. If a point is "nice to know" but not "need to know," it must be omitted.
        2.  **High-Fidelity Phrasing:** The points you extract must be phrased with the speaker's original meaning, tone, and perspective. Use tight paraphrasing or direct quotes. Do not change "I think..." to "It is thought..."
        3.  **No Distortion:** Even though you are being brief, you must not simplify a point so much that it becomes inaccurate or loses its original nuance. A complex point should be stated *concisely but accurately*.
        4.  **No External Information:** Do not add any context, analysis, or information that was not explicitly in the transcript.
        5.  **Format is Non-Negotiable:** The output *must* be a simple, clean, flat bulleted list (*). Do not use nested bullets, headings, or any complex structure. Each bullet point should be a single, powerful "jot point."

        ### INPUT TEXT
        (The text to be analyzed will follow this prompt)

        {transcript}

        ### EXPECTED OUTPUT
        (Provide *only* the clean, bulleted list. Do not add any conversational prefix like "Here are the key points:")
    """ ,
    input_variables=['transcript']
    )

    try:
        chainImpTopics = promptImpTopics | modl 
        res = chainImpTopics.invoke({"transcript":transcript})

        return res.content

    except Exception as e:
        return f"failed to create the notes , error {e}"


# ytID = ytUrlId("https://www.youtube.com/watch?v=jFbbRfe4pnk")
# transcipts = transcipt(ytID,"hi")
# translated = translate(transcipts)