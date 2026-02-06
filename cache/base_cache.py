import os 
import json 
import hashlib # used to create hashes

CACHE_DIR = "cache_house"
os.makedirs(CACHE_DIR, exist_ok = True) # this creates a folder with name CACHE_DIR , 
# ( exist_ok = True ) prevents crash if folder already present

def _get_path(key : str):
    key = key.encode() # encodes from unicode to binary 
    hash = hashlib.sha256(key).hexdigest() # sha256 creates 256bit hash object
    # hexdigest fetches the hash code from object and convert to human redable hexadecimal code
    
    return os.path.join(CACHE_DIR,f"{hash}.json")


def get_cache(key : str):

    path = _get_path(key)
    if os.path.exists(path):
        with open(path,"r") as file:
            return json.load(file)
    return None


def set_cache(key : str , value):
    path = _get_path(key)
    with open(path,"w") as file:
        json.dump(value,file)

