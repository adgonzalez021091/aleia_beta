#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Wed May 18 16:48:16 2022

@author: alvarogonzalez
"""
import io , os
from oauth2client.service_account import ServiceAccountCredentials
from apiclient.discovery import build
from apiclient.http import  MediaIoBaseUpload, MediaIoBaseDownload
current_file_dir = os.path.dirname(__file__)
file_id = "1d5R8faVNaLVOsQMNZpshdbWKswyBoyzD"
other_file_path = os.path.join(current_file_dir, 'integracion aleja-a7c070957142.json')
scope = ['https://www.googleapis.com/auth/drive']
creds = ServiceAccountCredentials.from_json_keyfile_name(other_file_path,scope)
drive_api = build('drive', 'v3', credentials=creds)
permission = drive_api.permissions().list(fileId=file_id).execute()
print(permission)
for o in permission["permissions"]:
    if o["role"] == "writer":
        drive_api.permissions().update(transferOwnership=True,fileId=file_id,permissionId=o["id"], body={"role":"owner"}).execute()
#permission['role'] = "writer"

#print(permission)
#drive_api.permissions().delete(fileId=file_id, permissionId=permission_id).execute()
#drive_api.permissions().update(transferOwnership=True,fileId=file_id,permissionId=permission_id, body=permission).execute()