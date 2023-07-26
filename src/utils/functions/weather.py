"""WEather API functions"""
import json

from src.utils.api.weather import get_weather_data


def get_current_weather(location, unit="fahrenheit"):
    """Get the current weather in a given location"""
    data = get_weather_data(location)
    return json.dumps(data)
