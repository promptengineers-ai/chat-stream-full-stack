import json
import os
import pickle
import tempfile
from typing import Any, List, Optional

from fastapi import (APIRouter, File, HTTPException, Request, Response,
                     UploadFile, status)

from src.config import S3_ACCESS_KEY, S3_BUCKET_NAME, S3_SECRET_KEY
from src.config.test import TEST_USER_ID
from src.controllers.storage_controller import StorageController
from src.factories.loader_factory import DocumentLoaderFactory
from src.models.request import RequestMultiLoader
from src.models.response import (ResponseCreateVectorStore,
                                 ResponseRetrieveVectorstores)
from src.services.loader_service import create_vectorstore
from src.services.logging_service import logger
from src.services.storage_service import StorageService

router = APIRouter()

#################################################
## List vectorstores
#################################################
@router.get(
    "/vectorstores",
    response_model=ResponseRetrieveVectorstores,
    tags=["Vector Stores"]
)
async def list_vectorstores():
    try:
        result = StorageController().retrieve_files_from_bucket(dir='vectorstores')
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
## Create vectorstore
#################################################    
@router.post(
    "/vectorstores/create",
    response_model=ResponseCreateVectorStore,
    tags=["Vector Stores"]
)
async def create_vectorstore_from_sources(
    body: RequestMultiLoader,
):
    files = []
    for name in body.files:
        try:
            file = StorageService(
                S3_ACCESS_KEY, 
                S3_SECRET_KEY
            ).retrieve_file(
                S3_BUCKET_NAME,
                f'users/{TEST_USER_ID}/files/{name}'
            )
        except Exception as err:
                raise HTTPException(status_code=404, detail=f"File Not Found in S3: {str(name)}")
        files.append(file)
    
    # Create a temporary directory
    with tempfile.TemporaryDirectory() as tmpdirname:
        # Your logic here to save uploaded files to tmpdirname
        loaders = []
        for loader in body.loaders:
            doc_loader = DocumentLoaderFactory.create_loader(
                loader.type, 
                {'urls': loader.urls}
            )
            loaders.append(doc_loader)
        try:
            for file_body, name in zip(files, body.files):
                file_path = os.path.join(tmpdirname, name)
                with open(file_path, 'wb') as f:
                    f.write(file_body.read())  # write the file to the temporary directory
                filename = file_path.split('/')[-1]
                loader = os.path.splitext(filename)[1][1:]
                doc_loader = DocumentLoaderFactory.create_loader(
                    loader, 
                    {'file_path': file_path}
                )
                loaders.append(doc_loader)
        except Exception as err:
            raise HTTPException(status_code=500, detail=f"Error creating loaders in tmp directory: {str(err)}")
        
        documents = []
        for loader in loaders:
            documents.extend(loader.load())
        logger.info("[main.load_vectorstore_from_file] Loaders: %s", str(len(loaders)))
        logger.info("[main.load_vectorstore_from_file] Documents: %s", str(len(documents)))
        vectorstore = create_vectorstore(documents)
        ## Save Vectorstore to tmp directory
        temp_file_path = os.path.join(tmpdirname, f'{int(ts)}-{body.name}.pkl')
        ## Path to store on s3
        s3_file_path = f'users/{TEST_USER_ID}/vectorstores/{body.name}.pkl'
        try:
            ## Write to temp file
            with open(temp_file_path, "wb") as f:
                pickle.dump(vectorstore, f)
            
            # Save to S3
            f = StorageService(
                S3_ACCESS_KEY, 
                S3_SECRET_KEY
            ).upload_file(
                temp_file_path, 
                S3_BUCKET_NAME, 
                s3_file_path
            )
        except Exception as err:
            raise HTTPException(status_code=500, detail=f"Error saving vectorstore in tmp directory: {str(err)}")
    ## Format Response
    data = json.dumps({
        'message': 'Vectorstore Created!',
        'data': body.dict()
    })
    return Response(
        content=data, 
        media_type='application/json', 
        status_code=201
    )
    
#################################################
## Uplooad an existing vectorstore
#################################################  
@router.post(
    "/vectorstores/upload",
    response_model=Any,
    tags=["Vector Stores"]
)
async def upload_an_existing_vector_store(
    request: Request,
    files: Optional[List[UploadFile]] = File(...)
):
    try:
        result = StorageController().save_files_to_bucket(files, 'vectorstores')
        ## Format Response
        data = json.dumps({
            'message': 'Vector Stores(s) Uploaded!',
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
    "/vectorstores",
    status_code=status.HTTP_204_NO_CONTENT,
    tags=["Vector Stores"]
)
async def delete_vectorstore(
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
            f'users/{TEST_USER_ID}/vectorstores/{prefix}'
        )
        return Response(status_code=204)
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))