"""Functions configuration file."""

from src.utils.functions.crypto import get_latest_crypto_price
from src.utils.functions.weather import get_current_weather

AVAILABLE_FUNCTIONS = {
		"get_current_weather": get_current_weather,
		"get_latest_crypto_price": get_latest_crypto_price
}

FUNCTIONS = [
	{
		"name": "get_current_weather",
		"description": "Get the current weather in a given location",
		"parameters": {
			"type": "object",
			"properties": {
				"location": {
					"type": "string",
					"description": "The city and state, e.g. San Francisco, CA",
				},
				"unit": {"type": "string", "enum": ["celsius", "fahrenheit"]},
			},
			"required": ["location"],
		},
	},
  {
		"name": "get_latest_crypto_price",
		"description": "Get the latest crypto price from given symbol or list of symbols",
		"parameters": {
			"type": "object",
			"properties": {
				"symbols": {
					"type": "string",
					"description": "The symbol or list of symbols for cryptocurrencies, e.g. BTC-USD | AAPL,ETH-USD | MATIC-USD,MSFT",
				}
			},
			"required": ["symbols"],
		},
	}
]
