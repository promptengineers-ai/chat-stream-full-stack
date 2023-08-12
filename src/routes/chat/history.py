"""Routes to get chat history"""
import json
from bson import ObjectId
from fastapi import APIRouter, HTTPException, Response, status

from src.config import MONGO_CONNECTION
from src.services.logging_service import logger
from src.services.history_service import HistoryService
from src.models.message import Message
from src.utils import JSONEncoder

router = APIRouter()
history_service = HistoryService(MONGO_CONNECTION)

#################################################
# Add files to storage
#################################################


@router.get(
    "/chat/history",
    response_model=Message,
    tags=["Chat History"]
)
async def list_chat_histories():
    """Creates a chat history"""
    try:
        result = await history_service.list_docs({})
        # Format Response
        data = json.dumps({
            **result
        }, cls=JSONEncoder)
        return Response(
            content=data,
            media_type='application/json',
            status_code=200
        )
    except HTTPException as err:
        logger.error(err.detail)
        raise
    except Exception as err:
        logger.error(err)
        raise HTTPException(
            status_code=500,
            detail=f"An unexpected error occurred. {str(err)}"
        )

#################################################
# Add files to storage
#################################################
@router.post(
    "/chat/history",
    response_model=Message,
    tags=["Chat History"]
)
async def create_chat_history(body: Message):
    """Creates a chat history"""
    try:
        result = await history_service.create(dict(body))
        # Format Response
        data = json.dumps({
            **result
        })
        return Response(
            content=data,
            media_type='application/json',
            status_code=200
        )
    except HTTPException as err:
        logger.error(err.detail)
        raise
    except Exception as err:
        logger.error(err)
        raise HTTPException(
            status_code=500,
            detail=f"An unexpected error occurred. {str(err)}"
        )

#################################################
# Add files to storage
#################################################
@router.get(
    "/chat/history/{chat_id}",
    response_model=Message,
    tags=["Chat History"]
)
async def show_chat_history(chat_id: str):
    """Creates a chat history"""
    try:
        result = await history_service.read_one({'_id': ObjectId(chat_id)})

        # Format Response
        data = json.dumps({
            **result
        }, cls=JSONEncoder)
        return Response(
            content=data,
            media_type='application/json',
            status_code=200
        )
    except HTTPException as err:
        logger.error(err.detail)
        raise
    except Exception as err:
        logger.error(err)
        raise HTTPException(
            status_code=500,
            detail=f"An unexpected error occurred. {str(err)}"
        )

#################################################
# Update Chat History
#################################################
@router.put(
    "/chat/history/{chat_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    tags=["Chat History"]
)
async def update_chat_history(
	chat_id: str,
    body: Message
):
    """Updates chat history"""
    try:
        await history_service.update_one({'_id': ObjectId(chat_id)}, body.dict())
        # Format Response
        return Response(status_code=204)
    except HTTPException as err:
        logger.error(err.detail)
        raise
    except Exception as err:
        logger.error(err)
        raise HTTPException(
            status_code=500,
            detail=f"An unexpected error occurred. {str(err)}"
        )
  
#################################################
# Delete Chat History
#################################################
@router.delete(
    "/chat/history{chat_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    tags=["Chat History"]
)
async def delete_chat_history(chat_id: str):
    """Deletes chat history"""
    try:
        await history_service.delete_one({'_id': ObjectId(chat_id)})
        # Format Response
        return Response(status_code=204)
    except Exception as err:
        raise HTTPException(status_code=404, detail=str(err))
    