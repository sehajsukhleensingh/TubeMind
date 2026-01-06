from langchain_core.prompts import PromptTemplate
from langchain_community.vectorstores import FAISS
from langchain_core.documents import Document 

from helper.supportingFuncs import ytUrlId , transcript_text , create_chunks , fetch_prompts

class Utility:
    def __init__(self , llm , embedder):   
        """
        constructor recieves the external dependencies 
        parameters :
        llm = text output generation model 
        embedder = model which creates the embeddings for the vector dB
        """    
        self.llm = llm 
        self.embedder = embedder


    def _fetch_transcript(self,url: str):

        id = ytUrlId(url)
        trans = transcript_text(id ,lang = "en")
        
        return trans
    

    # translates the trascript to the preffered language , default = english 
    def translate(self , url: str , language: str = "english") -> str:

        """this function takes transcript as the input and returns the translated version of 
        transcript in the language given input by user 
        INPUT:
            transcript
        OUPUT:
            translated version of transcript
        """
        promptTranslate = PromptTemplate(
            template = fetch_prompts("prompts/translate.md") ,

        input_variables = ['transcript','language']
        )

        transcript = self._fetch_transcript(url)

        
        try : 
            chainTranslate = promptTranslate | self.llm 
            res = chainTranslate.invoke({"transcript":transcript,"language":language})

            return res.content
        
        except Exception as e:
            raise RuntimeError("failed to translate error occured") from e


    def notes(self ,url: str) -> str:
        """
        this function takes transcript as the input and returns well jotted notes 
        of the given transcript
        INPUT:
            transcript
        OUPUT:
            notes based on the transcript
        """

        promptNotes = PromptTemplate(
            template= fetch_prompts("prompts/notes.md") ,
            
            input_variables= ['transcript']
        )

        transcript = self._fetch_transcript(url)
    
        try:
            chainNotes = promptNotes | self.llm
            res = chainNotes.invoke({"transcript":transcript})

            return res.content
        
        except Exception as e:
            raise RuntimeError("failed to create the notes") from e
        

    def important_topics(self , url: str):
        """
        this function takes transcript as the input and returns the important topics 
        of the given transcript
        INPUT:
            transcript
        OUPUT:
            important topics from the transcript
        """

        promptImpTopics = PromptTemplate(
            template= fetch_prompts("prompts/impTopic.md")
             ,
        input_variables=['transcript']
        )
        
        transcript = self._fetch_transcript(url)
    
        try:
            chainImpTopics = promptImpTopics | self.llm 
            res = chainImpTopics.invoke({"transcript":transcript})

            return res.content

        except Exception as e:
            raise RuntimeError("failed to create the notes") from e


    def _create_embedding_vector_store(self , url: str):

        """
        this function takes chuncks as input and create its embddings and store it 
        in a vector store 
        """

        transcript = self._fetch_transcript(url)
        chunks = create_chunks(transcript)
        docs = [Document(page_content=c) for c in chunks]

        vector_store = FAISS.from_documents(documents = docs , embedding = self.embedder)

        return vector_store


    def rag_work(self , query , vector_store):


        retriver = vector_store.as_retriever(search_type = "similarity" , search_kwargs = {"k":5})
        res = retriver.invoke(query)

        resDoc = "\n".join(text.page_content for text in res) 

        prompt = PromptTemplate(
        template= fetch_prompts("prompts/ragWork.md")
        , input_variables= ["query","resDoc"] )
        
        chain = prompt | self.llm
        
        try:
            res = chain.invoke({"query":query,"resDoc":resDoc})
            return res.content

        except Exception as e:
            raise RuntimeError("failed to generate the result") from e
