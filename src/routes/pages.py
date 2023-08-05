import os

from fastapi import APIRouter, HTTPException, Request
from fastapi.templating import Jinja2Templates

from src.config import APP_VERSION
from src.models.response import ResponseStatus
from src.services.logging_service import logger

router = APIRouter()
templates = Jinja2Templates(directory="static")

#######################################################################
###  Pages
#######################################################################
@router.get("/", tags=["Interface"])
async def chat_interface(request: Request):
    """Serves the index page."""
    return templates.TemplateResponse("pages/index.html", {"request": request})

@router.get("/functions", tags=["Interface"])
async def chat_functions_interface(request: Request):
    """Serves the index page."""
    return templates.TemplateResponse("pages/functions.html", {"request": request})

@router.get("/agent", tags=["Interface"])
async def chat_agent_interface(request: Request):
    """Serves the index page."""
    return templates.TemplateResponse("pages/agent.html", {"request": request})

@router.get("/vectorstore", tags=["Interface"])
async def chat_vectorstore_interface(request: Request):
    """Serves the index page."""
    return templates.TemplateResponse("pages/vectorstore.html", {"request": request})
  
#######################################################################
###  Status Endpoints
#######################################################################
@router.get("/status", tags=["Status"], response_model=ResponseStatus)
async def get_application_version():
    """Check the application status."""
    try:
        if APP_VERSION:
            return {
                "version": APP_VERSION,
                "pod_name": os.getenv("HOSTNAME", '')
            }
        else:
            raise "No APP_VERSION was passed"
    except Exception as err:
        logger.exception(err)
        raise HTTPException(status_code=500, detail="Internal Server Error")