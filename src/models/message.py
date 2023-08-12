""" Message Model """
from typing import Any

from pydantic import BaseModel, Field


class Message(BaseModel): # pylint: disable=too-few-public-methods
    """A message to send to the chatbot."""
    model: str = Field(...)
    messages: Any = Field(...)
    temperature: float or int = Field(...)

    class Config: # pylint: disable=too-few-public-methods
        """A message to send to the chatbot."""
        json_schema_extra = {
            "example": {
    			"model": "gpt-3.5-turbo",
       		 	"temperature": 0.8,	
                "messages": [
                    {"role": "system", "content": "You are a helpful assistant."},
                    {"role": "user", "content": 'Who won the 2001 world series?'},
					{"role": "assistant", "content": 'The arizona diamondbacks won the 2001 world series.'},
                    {"role": "user", "content": 'Who were the pitchers?'},
                ]
            }
        }
        
class FunctionChatMessage(BaseModel): # pylint: disable=too-few-public-methods
    """A message to send to the chatbot."""
    model: str = Field(...)
    messages: Any = Field(...)
    temperature: float or int = Field(...)
    functions: list[str] = Field(...)

    class Config: # pylint: disable=too-few-public-methods
        """A message to send to the chatbot."""
        schema_extra = {
            "example": {
    			"model": "gpt-3.5-turbo",
       		 	"temperature": 0.8,	
                "messages": [
                    {"role": "system", "content": "You are a helpful assistant."},
                    {"role": "user", "content": "What is the latest info on Bitcoin?"}
                ],
                "functions": [
                    "get_current_weather",
                    "get_latest_crypto_price",
                ]
            }
        }
        
class VectorstoreChatMessage(Message): # pylint: disable=too-few-public-methods
    """A message to send to the chatbot."""
    vectorstore: str = Field(...)

    class Config: # pylint: disable=too-few-public-methods
        """A message to send to the chatbot."""
        json_schema_extra = {
            "example": {
                "vectorstore": "formio.pkl",
    			"model": "gpt-3.5-turbo",
       		 	"temperature": 0.8,	
                "messages": [
                    {"role": "system", "content": "You are a helpful assistant."},
                    {"role": "user", "content": 'Who won the 2001 world series?'},
					{"role": "assistant", "content": 'The arizona diamondbacks won the 2001 world series.'},
                    {"role": "user", "content": 'Who were the pitchers?'},
                ]
            }
        }