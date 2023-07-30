"""Fetches latest market news from given symbol or list of symbols."""
import requests

from src.config import ALPACA_API_KEY, ALPACA_SECRET_KEY
from src.services.logging_service import logger


def get_latest_market_news(symbols: str or None = None):
    if symbols:
      logger.info("[functions.get_latest_market_news] Symbols: %s", symbols)
      url = f"https://data.alpaca.markets/v1beta1/news?symbols={symbols}"
    else:
      url = f"https://data.alpaca.markets/v1beta1/news"
    
    response = requests.get(
    	url, 
    	headers={
    		"Accept": "application/json",
    		"Apca-Api-Key-Id" : ALPACA_API_KEY,
        "Apca-Api-Secret-Key" : ALPACA_SECRET_KEY,
    	}
    )
    data = response.json()
    
    results = str(data)
    logger.debug("[functions.get_latest_market_news] Results: %s", results)
    return results