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


    def _fetch_transcript(self,url: str) -> str:

        id = ytUrlId(url)
        trans = transcript_text(id ,lang = "en")
        
        return trans
    

    # translates the trascript to the preffered language , default = english 
    def _translate(self , transcript:str , language: str = "en") -> str:

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
        
        try : 
            chainTranslate = promptTranslate | self.llm 
            res = chainTranslate.invoke({"transcript":transcript,"language":language})

            return res.content
        
        except Exception as e:
            raise RuntimeError("failed to translate error occured") from e


    def _normalise_transcript(self , url:str , language = "en") -> str:

        trans = self._fetch_transcript(url)
        if language != "en":
            trans = self._translate(trans , language)

        return trans


    def get_transcript(self,url:str,language="en") -> str:

        return self._normalise_transcript(url,language)
    
    
    def notes(self , url: str ,language="en") -> str:
        """
        this function takes transcript as the input and returns well jotted notes 
        of the given transcript
        INPUT:
            transcript
        OUPUT:
            notes based on the transcript
        """

        transcript = self._normalise_transcript(url,language)
        
        promptNotes = PromptTemplate(
            template= fetch_prompts("prompts/notes.md") ,
            
            input_variables= ['transcript']
        )
    
        try:
            chainNotes = promptNotes | self.llm
            res = chainNotes.invoke({"transcript":transcript})

            return res.content
        
        except Exception as e:
            raise RuntimeError("failed to create the notes") from e
        

    def important_topics(self , url: str ,language="en") -> str:
        """
        this function takes transcript as the input and returns the important topics 
        of the given transcript
        INPUT:
            transcript
        OUPUT:
            important topics from the transcript
        """

        transcript = self._normalise_transcript(url,language)
        
        promptImpTopics = PromptTemplate(
            template= fetch_prompts("prompts/impTopic.md")
             ,
        input_variables=['transcript']
        )
    
        try:
            chainImpTopics = promptImpTopics | self.llm 
            res = chainImpTopics.invoke({"transcript":transcript})

            return res.content

        except Exception as e:
            raise RuntimeError("failed to create the notes") from e


    def create_embedding_vector_store(self , url: str , language="en") -> FAISS:

        """
        this function takes chuncks as input and create its embddings and store it 
        in a vector store 
        """

        transcript = self._normalise_transcript(url,language)
        chunks = create_chunks(transcript)

        vector_store = FAISS.from_documents(documents = chunks , embedding = self.embedder)

        return vector_store


    def rag_work(self , query , vector_store):
        """
          Perform Retrieval-Augmented Generation (RAG) using the provided vector store.

        Retrieves the most relevant document chunks for the given query, builds a
        contextual prompt from those chunks, and generates a final response using
        the language model.

        Args:
            query (str): User question or query.
            vector_store: Vector database (e.g., FAISS) used for similarity retrieval.

        Returns:
            str: Generated response based on retrieved context.

        Raises:
            RuntimeError: If retrieval or generation fails.
        """

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
