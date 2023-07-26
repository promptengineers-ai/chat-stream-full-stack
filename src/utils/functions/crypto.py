"""Fetches the latest price of a cryptocurrency in USD."""
import requests

from src.config import YAHOOFINANCE_API_KEY
from src.services.logging_service import logger


def get_latest_crypto_price(symbols: str):
    logger.info("[functions.get_latest_crypto_price] Symbols: %s", symbols)
    url = f"https://yfapi.net/v6/finance/quote?region=US&lang=en&symbols={symbols}"
    response = requests.get(
    	url, 
    	headers={
    		"Accept": "application/json",
    		"X-API-KEY" : YAHOOFINANCE_API_KEY
    	}
    )
    data = response.json()
    
    results = str(data["quoteResponse"]["result"])
    logger.debug("[functions.get_latest_crypto_price] Results: %s", results)
    return results