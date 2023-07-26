"""Request models for the API."""""
from typing import List
from pydantic import BaseModel, Field

class TypeUrlLoader(BaseModel):
  type: str = Field(...)
  urls: List[str] = Field(...)
    
class RequestMultiLoader(BaseModel):
  name: str = Field(...)
  files: List[str] or None = Field(...)
  loaders: List[TypeUrlLoader] or None = Field(...)
  
  class Config:
    schema_extra = {
      "example": {
        "name": "test-multi-loader",
        "files": [
          "Ryan-Eggleston-Senior-Software-Engineer (1).pdf",
          "venture-deals.pdf"
        ],
        "loaders": [
          {"type": "gitbook", "urls": ["https://help.form.io"]},
          {"type": "web_base", "urls": ["https://form.io"]}
        ]
      }
    }
  