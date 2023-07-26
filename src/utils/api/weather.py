"""Fetch weather data from the Weather API"""""
import requests

from src.config import WEATHER_API_KEY

def get_weather_data(location):
    """Fetch weather data from the Weather API"""
    url = "https://api.weatherapi.com/v1/current.json"
    aqi = "no"

    params = {
        "key": WEATHER_API_KEY,
        "q": location,
        "aqi": aqi
    }

    try:
        response = requests.get(url, params=params, timeout=10)
        response.raise_for_status()  # Raise an exception for bad responses (4xx and 5xx)
        data = response.json()
        return data
    except requests.exceptions.RequestException as err:
        print(f"Error: {err}")
        return None