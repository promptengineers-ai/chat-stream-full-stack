"""Response models for the API."""""
from pydantic import BaseModel, Field

class ResponseStatus(BaseModel):
    version: str = Field(example='v0.0.15')
    pod_name: str or None = Field(example='server-67765cc7cd-nx6mp')
    
class ResponseRetrieveVectorstores(BaseModel):
  class Config:
    schema_extra = {
      "example": {
        "vectorstores": [
          "formio.pkl",
          "bullmq.pkl"
        ]
      }
    }    

class ResponseRetrieveFiles(BaseModel):
  class Config:
    schema_extra = {
      "example": {
        "files": [
          "A Prompt Pattern Catalog to Enhance Prompt Engineering with ChatGPT.pdf",
          "ai-village.pdf"
        ]
      }
    }
    
class ResponseFileStorage(BaseModel):
  class Config:
    schema_extra = {
      "example": {
        "message": "File(s) Uploaded!",
        "bucket_name": "prompt-engineers-dev",
        "files": [
          "formio-standard-procedure.pdf",
          "formio-interview-questions.pdf"
        ]
      }
    }
    
class ResponseCreateVectorStore(BaseModel):
  class Config:
    schema_extra = {
      "example": {
        "message": "Vectorstore Created!",
        "data": {
          "name": "test-multi-loader-to-s3",
          "files": [
            "formio-standard-procedure.pdf",
            "formio-interview-questions.pdf"  
          ],
          "loaders": [
            {
              "type": "gitbook",
              "urls": [
                "https://help.form.io"
              ]
            },
            {
              "type": "website",
              "urls": [
                "https://form.io"
              ]
            }
          ]
        }
      }
    }