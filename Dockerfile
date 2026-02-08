# 1 Base image 
FROM python:3.11-slim 

# 2 working directory 
WORKDIR /app

# 3 copying the dependencies list first 
COPY requirements.txt . 

# 4 intalling the dependencies 
RUN pip install --no-cache-dir -r requirements.txt

# 5 copying all the project files 
COPY . . 

# 6 expose the streamlit port 
EXPOSE 8501

# 7 the final running command to run the app 
CMD ["streamlit","run","main.py"]