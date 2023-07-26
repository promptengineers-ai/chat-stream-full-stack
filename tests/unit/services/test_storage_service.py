

import unittest

from src.config import S3_ACCESS_KEY, S3_SECRET_KEY
from src.services.storage_service import StorageService

s3 = StorageService(S3_ACCESS_KEY, S3_SECRET_KEY)
BUCKET_NAME = 'prompt-engineers-dev'

class TestStorageService(unittest.TestCase):
    
    def test_retrieve_files(self):
        files = s3.retrieve_all_files(BUCKET_NAME, '')
        # print(files)
        assert int(len(files)) > 1
        
    def test_delete_file(self):
        deleted = s3.delete_file(BUCKET_NAME, 'Trello-REST-API.pkl')
        # print(deleted)
        assert deleted