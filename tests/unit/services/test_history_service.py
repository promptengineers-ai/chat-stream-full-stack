"""Test the HistoryService class."""
import unittest
from datetime import datetime

from src.config import MONGO_CONNECTION
from src.services.history_service import HistoryService

from bson import ObjectId



class TestHistoryService(unittest.IsolatedAsyncioTestCase):
    """Unit tests for the HistoryService class."""
    
    async def asyncSetUp(self):
        self.history_service = HistoryService(MONGO_CONNECTION)
        self.history_id = None
        
    async def asyncTearDown(self):
        """Clean up method. This runs after each test."""
        if self.history_id:
            await self.history_service.delete_one({"_id": self.history_id})


    async def test_create_history(self):
        """Create a history item."""
        history = {
            'user_id': None,
            'messages': [
                {
                    'role': 'system',
                    'content': 'You are a helpful assistant.'
                },
                {
                    'role': 'user',
                    'content': 'Who won the 2001 world series?'
                }
            ],
            'model': 'gpt-3.5-turbo',
            'temperature': 0,
            'created_at': datetime.utcnow(),  # Current time in UTC
            'updated_at': datetime.utcnow(),
            'deleted_at': None
        }
        new_item = await self.history_service.collection.insert_one(history)
        self.history_id = new_item.inserted_id
        assert new_item.inserted_id is not None
        
        # Define the update
        update_query = {
            '$set': {
                'messages': [
                    {
                        'role': 'system',
                        'content': 'You are a helpful assistant.'
                    },
                    {
                        'role': 'user',
                        'content': 'Who won the 2001 world series?'
                    },
                    {
                        'role': 'assistant',
                        'content': 'The Arizona Dismonds won the 2001 world series.'
                    }
                ],
                'model': 'gpt-3.5-turbo',
                'temperature': 0,
                'updated_at': datetime.utcnow()
            }
        }
        
        history_list = await self.history_service.list()
        assert len(history_list) == 1
        
        read_one = await self.history_service.read_one({"_id": ObjectId(new_item.inserted_id)})
        assert read_one is not None
        
        # Execute the update
        new_result = await self.history_service.update_one(
            {"_id": ObjectId(new_item.inserted_id)},
            update_query
        )
        assert new_result is True