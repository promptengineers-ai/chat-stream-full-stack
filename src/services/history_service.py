"""Service for interacting with the history collection in MongoDB."""
import time
import motor.motor_asyncio
from src.models.message import Message

class HistoryService:
    """Service for interacting with the history collection in MongoDB."""
    def __init__(self, _connection_string: str):
        client = motor.motor_asyncio.AsyncIOMotorClient(_connection_string)
        self.database = client.chat_history
        self.collection = self.database.message_history

    async def list_docs(self, params: dict, limit=None) -> list:
        """Insert a new document into the collection."""
        cursor = self.collection.find(params)

        if limit:
            cursor = cursor.limit(limit)
        documents = await cursor.to_list(length=limit if limit else 1000)
        return {
			'chats': documents
		}

    async def create(self, document: dict) -> str:
        """Insert a new document into the collection."""
        document['created_at'] = int(time.time())
        document['updated_at'] = int(time.time())
        result = await self.collection.insert_one(dict(document))
        return {
			'_id': str(result.inserted_id)
		}

    async def read_one(self, params: dict) -> dict:
        """Find and return a single document from the collection."""
        document = await self.collection.find_one(params)
        return document

    async def update_one(self, params: dict, update: dict) -> bool:
        """Update a single document in the collection."""
        update['updated_at'] = int(time.time())
        result = await self.collection.update_one(
            params,
            {'$set': update}
        )
        return result.modified_count > 0

    async def delete_one(self, params: dict) -> bool:
        """Delete a single document from the collection."""
        result = await self.collection.delete_one(params)
        return result.deleted_count > 0
    