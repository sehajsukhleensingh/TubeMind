from pydantic import BaseModel , Field , AnyUrl , field_validator
from typing import Optional , Annotated

class UserInput(BaseModel):
    
    url: Annotated[str , Field(...,examples="https://www.youtube.com/watch?")]
    lang: str = "en"
    query: Optional[str] = None

    @field_validator("url")
    @classmethod
    def youtube_url_validator(cls,url):
        valid = url.lower().strip().split(".")
        if "youtube" not in valid:
            raise ValueError("this is not a valid youtube url")
        return url

        
