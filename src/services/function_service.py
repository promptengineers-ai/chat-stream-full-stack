"""Function Service"""""
import json

from src.config.functions import AVAILABLE_FUNCTIONS

class FunctionTypeFactory:
    """Function Type Factory"""
    def get_result(self, fn_type, response_message):
        """Get Result"""
        function_args = json.loads(response_message["function_call"]["arguments"])

        if fn_type == "get_current_weather":
            function_to_call = AVAILABLE_FUNCTIONS[fn_type]
            return function_to_call(
			    location=function_args.get("location"),
			    unit=function_args.get("unit"),
			)
        if fn_type == "get_latest_crypto_price":
            function_to_call = AVAILABLE_FUNCTIONS[fn_type]
            return function_to_call(
			    symbols=function_args.get("symbols")
			)
            
        if fn_type == "get_latest_market_news":
            function_to_call = AVAILABLE_FUNCTIONS[fn_type]
            return function_to_call(
			    symbols=function_args.get("symbols", '')
			)
        raise ValueError("Invalid Function type.")
