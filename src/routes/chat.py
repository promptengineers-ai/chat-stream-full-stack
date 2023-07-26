import pickle
from io import BytesIO

from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse

from src.config import S3_ACCESS_KEY, S3_BUCKET_NAME, S3_SECRET_KEY
from src.config.test import TEST_USER_ID
from src.models.message import Message, VectorstoreChatMessage
from src.services.logging_service import logger
from src.services.message_service import (send_agent_message,
                                          send_functions_message,
                                          send_openai_message,
                                          send_vectorstore_message)
from src.services.storage_service import StorageService

router = APIRouter()

#################################################
## ChatGPT
#################################################
@router.post("/chat/stream", tags=["Chat Stream"])
async def chat_endpoint(body: Message):
    """Chat endpoint."""
    messages = body.messages or []
    # session_id = body.session_id
    logger.debug('[POST /chat] Query: %s', str(body))

    return StreamingResponse(
        send_openai_message(
            messages,
            body.model,
            body.temperature
        ),
        media_type="text/event-stream"
    )

@router.post("/chat/stream/functions", tags=["Chat Stream"])
async def chat_functions_endpoint(body: Message):
    """Chat endpoint."""
    messages = body.messages or []
    # session_id = body.session_id
    logger.debug('[POST /chat] Query: %s', str(body))

    return StreamingResponse(
        send_functions_message(
            messages,
            body.model,
            body.temperature
        ),
        media_type="text/event-stream"
    )

@router.post("/chat/stream/agent", tags=["Chat Stream"])
async def chat_agent_endpoint(body: Message):
    """Chat endpoint."""
    messages = body.messages or []
    # session_id = body.session_id
    logger.debug('[POST /chat] Query: %s', str(body))

    return StreamingResponse(
        send_agent_message(
            messages,
            body.model,
            body.temperature
        ),
        media_type="text/event-stream"
    )
    
@router.post("/chat/stream/vectorstore", tags=["Chat Stream"])
async def chat_vectorstore_endpoint(body: VectorstoreChatMessage):
    """Chat endpoint."""
    messages = body.messages or []
    # session_id = body.session_id
    logger.debug('[POST /chat] Query: %s', str(body))
    
    # Retrieve the vectorstore
    s3_file = StorageService(
        S3_ACCESS_KEY,
        S3_SECRET_KEY
    ).retrieve_file(
        S3_BUCKET_NAME,
        f'users/{TEST_USER_ID}/vectorstores/{body.vectorstore}'
    )
    # Check if the retrieved file is empty
    if not s3_file:
        raise HTTPException(status_code=404, detail="Vectorstore [%s] not found" % body.vectorstore)

    with BytesIO(s3_file.read()) as file:
        vectorstore = pickle.load(file)
        
    return StreamingResponse(
        send_vectorstore_message(
            messages,
            vectorstore,
            body.model,
            body.temperature,
        ),
        media_type="text/event-stream"
    )