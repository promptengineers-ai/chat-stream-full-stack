import json
from typing import List, Optional

from fastapi import (APIRouter, File, HTTPException, Request, Response,
                     UploadFile, status)

from src.config import S3_ACCESS_KEY, S3_BUCKET_NAME, S3_SECRET_KEY
from src.config.test import TEST_USER_ID
from src.controllers.storage_controller import StorageController
from src.models.response import ResponseFileStorage, ResponseRetrieveFiles
from src.services.logging_service import logger
from src.services.storage_service import StorageService

router = APIRouter()

#################################################
## List Files
#################################################
@router.get(
    "/files",
    response_model=ResponseRetrieveFiles,
    tags=["Files"]
)
async def list_files():
    try:
        result = StorageController().retrieve_files_from_bucket()
        ## Format Response
        data = json.dumps({
            **result
        })
        return Response(
            content=data, 
            media_type='application/json', 
            status_code=200
        )
    except HTTPException as e:
        logger.error(e.detail)
        raise
    except Exception as e:
        logger.error(e)
        raise HTTPException(
            status_code=500, 
            detail=f"An unexpected error occurred. {str(e)}"
        )
        
#################################################
## Add files to storage
#################################################        
@router.post(
    "/files",
    response_model=ResponseFileStorage,
    tags=["Files"]
)
async def save_files(
    request: Request,
    files: Optional[List[UploadFile]] = File(...)
):
    try:
        result = StorageController().save_files_to_bucket(files)
        ## Format Response
        data = json.dumps({
            'message': 'File(s) Uploaded!',
            **result
        })
        return Response(
            content=data, 
            media_type='application/json', 
            status_code=200
        )
    except HTTPException as e:
        logger.error(e.detail)
        raise
    except Exception as e:
        logger.error(e)
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred. {str(e)}")
    
######################################
##      Delete Vector Store
###################################### 
@router.delete(
    "/files",
    status_code=status.HTTP_204_NO_CONTENT,
    tags=["Files"]
)
async def delete_file(
    prefix: str,
):
    try:
        ## Delete File
        s3 = StorageService(
            S3_ACCESS_KEY, 
            S3_SECRET_KEY
        )
        s3.delete_file(
            S3_BUCKET_NAME, 
            f'users/{TEST_USER_ID}/files/{prefix}'
        )
        return Response(status_code=204)
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))