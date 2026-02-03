from fastapi import APIRouter , HTTPException
from fastapi import Request , Depends
from api.schema import UserInput

router = APIRouter()

def get_utility(request : Request):
    return request.app.state.utility

@router.post("/notes")
async def generate_notes(data: UserInput , utility =  Depends(get_utility)):

    try:
        result = utility.notes(data.url , data.lang)
        return {"notes":result}
    
    except Exception as e:
        raise HTTPException(status_code=500,detail=str(e))



@router.post("/imptopics")
async def generate_important_topics(data:UserInput , utility = Depends(get_utility)):

    try:
        result = utility.important_topics(data.url , data.lang)
        return {"important_topics":result}
    
    except Exception as e:
        raise HTTPException(status_code=500 , detail=str(e))


@router.post("/transcript")
async def get_transcript(data:UserInput , utility = Depends(get_utility)):

    try:
        result = utility.get_transcript(data.url,data.lang)
        return {"transcript":result}
    
    except Exception as e:
        raise HTTPException(status_code=500 , detail=str(e))
    
@router.post("/ask")
def rag_chat(data: UserInput, utility=Depends(get_utility)):

    if not (data.query or "").strip():
        raise HTTPException(status_code=400, detail="query is required")
    try:
        vector_store = utility.create_embedding_vector_store(data.url, data.lang)
        answer = utility.rag_work(data.query.strip(), vector_store)
        return {"response": answer}
               
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
