import os

import boto3
from botocore.exceptions import ClientError

from src.services.logging_service import logger


class StorageService:
    def __init__(self, _aws_access_key_id, _aws_secret_access_key):
        self.aws_access_key_id = _aws_access_key_id
        self.aws_secret_access_key = _aws_secret_access_key 
        self.client = boto3.client('s3', 
                                    aws_access_key_id = self.aws_access_key_id, 
                                    aws_secret_access_key = self.aws_secret_access_key
                                    )  
        
    def retrieve_all_files_raw(self, bucket: str, prefix: str = ''):
        files = []
        for file in self.client.list_objects_v2(Bucket=bucket, Prefix=prefix)['Contents']:
            if file:  # this condition will be False for empty strings
                files.append(file)
        return files
        
    def retrieve_all_files(self, bucket: str, prefix: str = ''):
        files = []
        for key in self.client.list_objects_v2(Bucket=bucket, Prefix=prefix)['Contents']:
            # filename = key['Key']
            filename = key['Key'].split('/')[-1]
            if filename:  # this condition will be False for empty strings
                files.append(filename)
        return files

    def retrieve_file(self, bucket: str, path: str):
        try:
            response = self.client.get_object(Bucket=bucket, Key=path)
            body = response['Body']
            return body
        except ClientError as e:
            error_code = e.response["Error"]["Code"]
            if error_code == "AccessDenied":
                logger.warn("[storage_service.retrieve_file] Access denied!")
                return None
            elif error_code == "InvalidLocationConstraint":
                logger.warn("[storage_service.retrieve_file] Invalid Path: %s", path)
                return None
                

    def delete_file(self, bucket: str, path: str):
        # Check if the file was deleted successfully
        try:
            response = self.client.delete_object(Bucket=bucket, Key=path)
            return response
        except Exception as e:
            raise Exception(e)
        
    def upload_file(self, file_name, bucket, object_name=None):
        """Upload a file to an S3 bucket

        :param file_name: File to upload
        :param bucket: Bucket to upload to
        :param object_name: S3 object name. If not specified then file_name is used
        :return: True if file was uploaded, else False
        """

        # If S3 object_name was not specified, use file_name
        if object_name is None:
            object_name = os.path.basename(file_name)

        try:
            self.client.upload_file(file_name, bucket, object_name)
        except ClientError as e:
            logger.error(e)
            return False
        return True