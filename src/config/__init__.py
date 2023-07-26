"""Configuration files for the project."""
import os

# Path to the vector store
APP_VERSION = os.getenv("APP_VERSION", '')
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", '')
VECTORSTORE_PATH = os.getenv("VECTORSTORE_PATH", '')
SERPAPI_API_KEY= os.getenv("SERPAPI_API_KEY", '')
GOOGLE_CSE_ID = os.getenv("GOOGLE_CSE_ID", '')
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY", '')
WEATHER_API_KEY = os.getenv("WEATHER_API_KEY", '')
YAHOOFINANCE_API_KEY = os.getenv("YAHOOFINANCE_API_KEY", '')

# S3 Credentials
S3_ACCESS_KEY = os.getenv("S3_ACCESS_KEY", '')
S3_SECRET_KEY = os.getenv("S3_SECRET_KEY", '')
S3_BUCKET_NAME = os.getenv("S3_BUCKET_NAME", '')
