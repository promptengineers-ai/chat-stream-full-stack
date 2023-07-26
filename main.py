"""Entrypoint for the FastAPI application."""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from src.routes.chat import router as chat_router
from src.routes.files import router as files_router
from src.routes.pages import router as pages_router
from src.routes.vectorstores import router as vectorstores_router

# Create the FastAPI application
app = FastAPI(
    title="Prompt Engineers - FastAPI Chat Stream GPT",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Mount static files
app.mount("/static", StaticFiles(directory="static"), name="static")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(pages_router)
app.include_router(files_router)
app.include_router(chat_router)
app.include_router(vectorstores_router)
