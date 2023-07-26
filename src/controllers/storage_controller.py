import os
import tempfile
from typing import List, Optional

from fastapi import File, HTTPException, UploadFile

from src.config import S3_ACCESS_KEY, S3_BUCKET_NAME, S3_SECRET_KEY
from src.config.test import TEST_USER_ID
from src.services.storage_service import StorageService


class StorageController:
  def __init__(self):
    # Initialize any necessary variables or objects here
    self.data = {}
      
  ##############################################################
  ### Save Files To Bucket
  ##############################################################
  def save_files_to_bucket(self, files: Optional[List[UploadFile]] = File(...), dir: str = 'files'):
    ## Get Creds
      
    # Initialize S3 service with the given keys
    try:
      s3 = StorageService(
        S3_ACCESS_KEY, 
        S3_SECRET_KEY
      )
    except Exception as e:
      raise HTTPException(status_code=500, detail=str(e))

    # Create a temporary directory
    with tempfile.TemporaryDirectory() as tmpdirname:
      # Your logic here to save uploaded files to tmpdirname
      
      for file in files:
        ## Check If Vectorstore Is Valid
        if dir != 'files':
          ext = os.path.splitext(file.filename)[1][1:]
          if ext != 'pkl':
            raise HTTPException(status_code=400, detail=f"File [{file.filename}] can NOT be uploaded, only .pkl files are allowed.")
        ## Save File To Temp Directory
        file_path = os.path.join(tmpdirname, file.filename)
        try:
          with open(file_path, 'wb') as f:
            f.write(file.file.read())  # write the file to the temporary directory
        except Exception as e:
          raise HTTPException(status_code=500, detail=f"Error saving files to temporary directory: {str(e)}")
              
      uploaded_files = []
              
      # Now upload each file in the temporary directory to s3
      try:
        for file_name in os.listdir(tmpdirname):
          file_path = os.path.join(tmpdirname, file_name)
          s3_file_path = f'users/{TEST_USER_ID}/{dir}/{file_name}'  # Add the desired prefix
          s3.upload_file(
            file_path, 
            S3_BUCKET_NAME,
            s3_file_path
          )
          uploaded_files.append(file_name)
      except Exception as e:
          raise HTTPException(status_code=500, detail=f"Error uploading files to S3: {str(e)}")
        
    return {
      "files": uploaded_files
    }
    
  ##############################################################
  ### Retrieve Files From Bucket
  ##############################################################
  def retrieve_files_from_bucket(self, dir: str = 'files'):
    # Initialize S3 service with the given keys
    try:
      s3 = StorageService(
        S3_ACCESS_KEY, 
        S3_SECRET_KEY
      )
    except Exception as e:
      raise HTTPException(status_code=500, detail=str(e))

    files = s3.retrieve_all_files(
      S3_BUCKET_NAME,
     f'users/{TEST_USER_ID}/{dir}'
    )
    
    return {
      f'{dir}': files
    }
    
  ##############################################################
  ### Delete File From Bucket
  ##############################################################
  def delete_file_from_bucket(self, file_name: str):
    try:
      ## Delete File
      s3 = StorageService(
        S3_ACCESS_KEY, 
        S3_SECRET_KEY
      )
      s3.delete_file(
        S3_BUCKET_NAME, 
        f'users/{TEST_USER_ID}/files/{file_name}'
      )
    except Exception as e:
      raise HTTPException(status_code=500, detail=f"Error deleting file from S3: {str(e)}")