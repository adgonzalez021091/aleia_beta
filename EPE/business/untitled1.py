#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Mon Jun 28 15:43:56 2021

@author: alvarogonzalez

from __future__ import print_function
import pickle
import os.path
from googleapiclient.discovery import build
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request

# https://developers.google.com/analytics/devguides/config/mgmt/v3/quickstart/service-py
from apiclient.discovery import build
from oauth2client.service_account import ServiceAccountCredentials

scope = ['https://www.googleapis.com/auth/drive']

credentials = ServiceAccountCredentials.from_json_keyfile_name('creds.json' % path, scope)

# https://developers.google.com/drive/api/v3/quickstart/python
service = build('drive', 'v3', credentials=credentials)
google_drive_service = discovery.build('drive', 'v3',credentials=ServiceAccountCredentials.from_json_keyfile_name
                           os.path.join(settings.CLIENT_PATH, settings.CLIENT_SECRET_FILE),
                           scopes=settings.SCOPES))


media = MediaFileUpload(tmp_file_path, mimetype=tmp_file.content_type, resumable=True)
service.files().create(body=file_metadata, media_body=media, fields='id').execute()


"""
import io
from oauth2client.service_account import ServiceAccountCredentials
from apiclient.discovery import build
from apiclient.http import  MediaIoBaseUpload
def list_files(items):
    """given items returned by Google Drive API, prints them in a tabular way"""
    if not items:
        # empty drive
        print('No files found.')
    else:
        rows = []
        for item in items:
            # get the File ID
            id = item["id"]
            # get the name of file
            name = item["name"]
            try:
                # parent directory ID
                parents = item["parents"]
            except:
                # has no parrents
                parents = "N/A"
            try:
                # get the size in nice bytes format (KB, MB, etc.)
                size = int(item["size"])
            except:
                # not a file, may be a folder
                size = "N/A"
            # get the Google Drive type of file
            mime_type = item["mimeType"]
            # get last modified date time
            modified_time = item["modifiedTime"]
            # append everything to the list
            rows.append((id, name, parents, size, mime_type, modified_time))
        print("Files:")
        # convert to a human readable table
        #table = tabulate(rows, headers=["ID", "Name", "Parents", "Size", "Type", "Modified Time"])
        # print the table
        print(rows)
#Set up a credentials object I think
creds = ServiceAccountCredentials.from_json_keyfile_name('credentials.json', ['https://www.googleapis.com/auth/drive'])

#Now build our api object, thing
drive_api = build('drive', 'v3', credentials=creds)

file_name = "test_img"
print("Uploading file " + file_name + "...")

#We have to make a request hash to tell the google API what we're giving it
body = {'name': file_name, 'mimeType': 'image/jpeg', 'parents':["1TzwJzpVIeA1RD2lMu0zRv3L17m8mRvsE"]}

#Now create the media file upload object and tell it what file to upload,
#in this case 'test.html'
"""media = MediaFileUpload('credentials.json', mimetype = 'text/html')
"""
with open('img.jpeg', 'rb') as FID:
    fileInMemory = FID.read()

media = MediaIoBaseUpload(io.BytesIO(fileInMemory), mimetype='image/jpeg', resumable=True)

#Now we're doing the actual post, creating a new file of the uploaded type
fiahl = drive_api.files().create(body=body, media_body=media).execute()
folder_id = fiahl.get("id")
print("Folder ID:", folder_id)

#Because verbosity is nice
print("Created file '%s' id '%s'." % (fiahl.get('name'), fiahl.get('id')))



results = drive_api.files().list(pageSize=5, fields="nextPageToken, files(id, name, mimeType, size, parents, modifiedTime)").execute()
# get the results
items = results.get('files', [])
# list all 20 files & folders
list_files(items)

