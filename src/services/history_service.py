"""Service for interacting with the history collection in MongoDB."""
import motor.motor_asyncio


class HistoryService:
    """Service for interacting with the history collection in MongoDB."""
    def __init__(self, _connection_string: str):
        client = motor.motor_asyncio.AsyncIOMotorClient(_connection_string)
        self.database = client.chat_history
        self.collection = self.database.message_history
        
    async def list(self, params: dict, limit=None) -> list:
        """Insert a new document into the collection."""
        cursor = self.collection.find(params)
        
        if limit:
            cursor = cursor.limit(limit)
        
        documents = await cursor.to_list(length=limit if limit else 1000)  # default to 1000 if no limit
        return documents

    async def create(self, document: dict) -> str:
        """Insert a new document into the collection."""
        result = await self.collection.insert_one(document)
        return str(result.inserted_id)

    async def read_one(self, params: dict) -> dict:
        """Find and return a single document from the collection."""
        document = await self.collection.find_one(params)
        return document

    async def update_one(self, params: dict, update: dict) -> bool:
        """Update a single document in the collection."""
        result = await self.collection.update_one(params, update)
        return result.modified_count > 0

    async def delete_one(self, params: dict) -> bool:
        """Delete a single document from the collection."""
        result = await self.collection.delete_one(params)
        return result.deleted_count > 0