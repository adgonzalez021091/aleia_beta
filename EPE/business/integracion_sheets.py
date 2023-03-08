#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Mon May 11 11:33:10 2020

@author: alvarogonzalez
"""
from EPE.business import logic
from datetime import *
import copy
import json
import urllib.parse
import gspread
import os
from oauth2client.service_account import ServiceAccountCredentials
from text_unidecode import unidecode


import io
from oauth2client.service_account import ServiceAccountCredentials
from apiclient.discovery import build
from apiclient.http import  MediaIoBaseUpload, MediaIoBaseDownload
import mimetypes


class control_atencion(object):
    def load_mongo_client(self):
        import os
        current_file_path = __file__
        current_file_dir = os.path.dirname(__file__)
        other_file_path = os.path.join(current_file_dir, "config.txt")
        url_bd = '18.222.100.32'
        import urllib.parse
        username = urllib.parse.quote_plus('aleja_user')
        password = urllib.parse.quote_plus('02-10-91aldigovE')
        f=open(other_file_path, "r")
        if f.mode == 'r':
            contents =f.read()
            url_bd = contents.split("url_bd[")[1].split("]")[0]
        #mongo_client = MongoClient('mongodb://%s:%s@18.218.58.145' % (username, password)) #PROD
        mongo_client = logic.MongoClient(str(url_bd) % (username, password))#TEST
        return mongo_client.aleja_bd
    def load_sheet_confs(self):
        import os
        current_file_path = __file__
        current_file_dir = os.path.dirname(__file__)
        other_file_path = os.path.join(current_file_dir, "config.txt")
        obj = {"sheet_postulaciones":"","sheet_control_vacantes":"","sheet_clientes_aleja":"","sheet_control_entrevistas":"","sheet_servicios_aleja":""}
        f=open(other_file_path, "r")
        if f.mode == 'r':
            contents =f.read()
            obj["sheet_control_vacantes"] = contents.split("sheet_control_vacantes[")[1].split("]")[0]
            obj["sheet_servicios_aleja"] = contents.split("sheet_servicios_aleja[")[1].split("]")[0]
            obj["sheet_control_entrevistas"] = contents.split("sheet_control_entrevistas[")[1].split("]")[0]
            obj["sheet_clientes_aleja"] = contents.split("sheet_clientes_aleja[")[1].split("]")[0]
            obj["sheet_postulaciones"] = contents.split("sheet_postulaciones[")[1].split("]")[0]
        return obj
    def carga_servicio(self,data):
        db = logic.load_mongo_client()
        current_file_dir = os.path.dirname(__file__)
        other_file_path = os.path.join(current_file_dir, 'integracion aleja-a7c070957142.json')
        scope = ['https://spreadsheets.google.com/feeds',
                 'https://www.googleapis.com/auth/drive']
        creds = ServiceAccountCredentials.from_json_keyfile_name(other_file_path,scope)
        client = gspread.authorize(creds)
        tipo_persona = db.personas.find_one({"id": int(data["id_usuario"])})["tipo"]
        sheetindx = ""
        if tipo_persona == 1:
            sheetindx = "Equipo interno"
        if tipo_persona == 5:
            sheetindx = "Programa a éxito"
        if tipo_persona == 6:
            sheetindx = "Compensar"
        if tipo_persona == 8 or tipo_persona == 11:
            sheetindx = "Freemium"
        if tipo_persona == 13:
            sheetindx = "Empresas"
        print(sheetindx,tipo_persona,"....esta a punto")
        if sheetindx != "":
            file = self.load_sheet_confs()["sheet_servicios_aleja"]
            sheet = client.open(file).worksheet(sheetindx)
            n = logic.load_mongo_client().personas.find_one({"id":int(data["id_usuario"])})
            v = logic.load_mongo_client().vacantes.find_one({"id":int(data["id_vacante"])})
            c = ""
            print(sheetindx,"tiene n v c")
            if data["id_contacto"] != "":
                c = logic.load_mongo_client().personas.find_one({"id":int(data["id_contacto"])})
            if c != "":
                cargo = c["nombre"]+" - "+  c["ultimo_cargo"]
                linkedin = c["linkedin"]
            else:
                cargo = ""
                linkedin = ""
            if data["id_cv"] != "":
                link_cv_drive = "https://drive.google.com/file/d/"+data["id_cv"]+"/view"
            else:
                link_cv_drive = ""
            if v["link"] != "":
                link_vac = v["link"]
            else:
                link_vac = "https://aleia.app/app?id_vacante="+str(v["id"])
            print("todos los datos ok")
            celdas = [data["id"],data["fecha"],data["hora"],n["nombre"],data["tipo"],link_cv_drive,"" ,"",data["estatus"],v["cargo"],v["empresa"],link_vac,v["id"],data["id_contacto"],cargo,linkedin]
            print(sheetindx,"...craendo reg...",celdas)
            sheet.append_row(celdas)
            print(sheetindx,"...registro creado ok...",celdas)

    def carga_entrevista(self,id_user,id_vac,id_per,id_et,fecet,nivel,fec_pr,servicio):

        db = logic.load_mongo_client()
        current_file_dir = os.path.dirname(__file__)
        other_file_path = os.path.join(current_file_dir, 'integracion aleja-a7c070957142.json')
        scope = ['https://spreadsheets.google.com/feeds',
                 'https://www.googleapis.com/auth/drive']
        creds = ServiceAccountCredentials.from_json_keyfile_name(other_file_path,scope)
        client = gspread.authorize(creds)
        tipo_persona = db.personas.find_one({"id": int(id_user)})["tipo"]
        sheetindx = ""
        if tipo_persona == 1:
            sheetindx = "Equipo interno"
        if tipo_persona == 5:
            sheetindx = "Programa a éxito"
        if tipo_persona == 6:
            sheetindx = "Compensar"
        if tipo_persona == 8 or tipo_persona == 11:
            sheetindx = "Freemium"
        if tipo_persona == 13:
            sheetindx = "Empresas"

        if sheetindx != "":
            file = self.load_sheet_confs()["sheet_control_entrevistas"]
            print(file,sheetindx)
            sheet = client.open(file).worksheet(sheetindx)
            n = logic.load_mongo_client().personas.find_one({"id":int(id_user)})
            v = logic.load_mongo_client().vacantes.find_one({"id":int(id_vac)})
            e = logic.load_mongo_client().personas.find_one({"id":int(id_per)})
            nivels = ""
            if int(nivel) == 1 :
                nivels = "Entrevista con equipo de selección"
            if int(nivel) == 2 :
                nivels = "Entrevista con gerente de RRHH"
            if int(nivel) == 3 :
                nivels = "Entrevista con jefe directo"
            if int(nivel) == 4 :
                nivels = "Entrevista con Director, CEO o Gerente general"
            if int(nivel) == 5 :
                nivels = "Postulación de Séligo"
            if int(nivel) == 6 :
                nivels = "Vacante cerrada"
            if int(nivel) == 7 :
                nivels = "Contratado!"
            fec = fecet.split(" ")[0]
            tim = fecet.split(" ")[1]

            sheet.append_row([str(id_user)+"."+str(id_et),fec,tim,n["nombre"],v["cargo"],v["empresa"],v["link"],v["id"],e["nombre"],nivels,fec_pr,servicio])
    def elimina_servicio(self,id_servicio,id_user,nw_id_servicio):
        db = logic.load_mongo_client()
        current_file_dir = os.path.dirname(__file__)
        other_file_path = os.path.join(current_file_dir, 'integracion aleja-a7c070957142.json')
        scope = ['https://spreadsheets.google.com/feeds',
                 'https://www.googleapis.com/auth/drive']
        creds = ServiceAccountCredentials.from_json_keyfile_name(other_file_path,scope)
        client = gspread.authorize(creds)
        tipo_persona = db.personas.find_one({"id": int(id_user)})["tipo"]
        
        
        sheetindx = ""
        if tipo_persona == 1:
            sheetindx = "Equipo interno"
        if tipo_persona == 5:
            sheetindx = "Programa a éxito"
        if tipo_persona == 6:
            sheetindx = "Compensar"
        if tipo_persona == 8 or tipo_persona == 11:
            sheetindx = "Freemium"
        if tipo_persona == 13:
            sheetindx = "Empresas"
        if sheetindx != "":
            file = self.load_sheet_confs()["sheet_servicios_aleja"]
            sheet = client.open(file).worksheet(sheetindx)
            lista = sheet.get_all_records()
            row = 1
            
            for o in lista:
                row = row +1
                id_tmp = str(o["id_servicio"])
                if str(id_tmp).strip() == (id_servicio):
                    sheet.update_cell(row, 1, nw_id_servicio)
                    sheet.update_cell(row, 9, "eliminado")



    def edita_entrevista(self,id_user,id_vac,id_per,id_et,fecet,nivel,fec_pr,servicio):

        db = logic.load_mongo_client()
        current_file_dir = os.path.dirname(__file__)
        other_file_path = os.path.join(current_file_dir, 'integracion aleja-a7c070957142.json')
        scope = ['https://spreadsheets.google.com/feeds',
                 'https://www.googleapis.com/auth/drive']
        creds = ServiceAccountCredentials.from_json_keyfile_name(other_file_path,scope)
        client = gspread.authorize(creds)
        tipo_persona = db.personas.find_one({"id": int(id_user)})["tipo"]
        
        nivels = ""
        if int(nivel) == 1 :
            nivels = "Entrevista con equipo de selección"
        if int(nivel) == 2 :
            nivels = "Entrevista con gerente de RRHH"
        if int(nivel) == 3 :
            nivels = "Entrevista con jefe directo"
        if int(nivel) == 4 :
            nivels = "Entrevista con Director, CEO o Gerente general"
        if int(nivel) == 5 :
            nivels = "Postulación de Séligo"
        if int(nivel) == 6 :
            nivels = "Vacante cerrada"
        if int(nivel) == 7 :
            nivels = "Contratado!"
        sheetindx = ""
        if tipo_persona == 1:
            sheetindx = "Equipo interno"
        if tipo_persona == 5:
            sheetindx = "Programa a éxito"
        if tipo_persona == 6:
            sheetindx = "Compensar"
        if tipo_persona == 8 or tipo_persona == 11:
            sheetindx = "Freemium"
        if tipo_persona == 13:
            sheetindx = "Empresas"
        if sheetindx != "":
            file = self.load_sheet_confs()["sheet_control_entrevistas"]
            sheet = client.open(file).worksheet(sheetindx)
            lista = sheet.get_all_records()
            row = 1
            
            for o in lista:
                row = row +1
                print(o["id"],str(id_user)+"."+str(id_et))
                id_tmp = str(o["id"]).replace(".ACTUALIZADA","")
                print("controladooo.....",id_tmp,(str(id_user)+"."+str(id_et)).strip())
                if str(id_tmp).strip() == (str(id_user)+"."+str(id_et)).strip():
                    fec = fecet.split(" ")[0]
                    tim = fecet.split(" ")[1]
                    sheet.update_cell(row, 10, nivels)
                    sheet.update_cell(row, 11, fec_pr)
                    sheet.update_cell(row, 12, servicio)
                    if "ACTUALIZADA" not in str(o["id"]):
                        sheet.update_cell(row, 1, str(o["id"]).strip()+".ACTUALIZADA")
                    break
    def edita_vacante(self,id_user,id_et,fecet,cumple):

        db = logic.load_mongo_client()
        current_file_dir = os.path.dirname(__file__)
        other_file_path = os.path.join(current_file_dir, 'integracion aleja-a7c070957142.json')
        scope = ['https://spreadsheets.google.com/feeds',
                 'https://www.googleapis.com/auth/drive']
        creds = ServiceAccountCredentials.from_json_keyfile_name(other_file_path,scope)
        client = gspread.authorize(creds)
        print("aca le metemos la vaina loca ")
        tipo_persona = db.personas.find_one({"id": int(id_user)})["tipo"]
        sheetindx = ""
        if tipo_persona == 1:
            sheetindx = "Equipo interno"
        if tipo_persona == 5:
            sheetindx = "Programa a éxito"
        if tipo_persona == 6:
            sheetindx = "Compensar"
        if tipo_persona == 8 or tipo_persona == 11:
            sheetindx = "Freemium"
        if tipo_persona == 13:
            sheetindx = "Empresas"
        if sheetindx != "":
            file = self.load_sheet_confs()["sheet_control_vacantes"]
            sheet = client.open(file).worksheet(sheetindx)
            lista = sheet.get_all_records()
            row = 1
            if cumple == True:
                cumple2 = "si"
            elif cumple == False:
                cumple2 = "no"
            else:
                cumple2 = cumple
            for o in lista:
                row = row +1
                id_tmp = str(o["id"]).replace(".ACTUALIZADA","")
                if str(id_tmp).strip() == (str(id_user)+"."+str(id_et)).strip():
                    fec = fecet.split(" ")[0]
                    tim = fecet.split(" ")[1]
                    sheet.update_cell(row, 2, fec)
                    sheet.update_cell(row, 3, tim)
                    sheet.update_cell(row, 9, cumple2)
                    if "ACTUALIZADA" not in str(o["id"]):
                        sheet.update_cell(row, 1, str(o["id"]).strip()+".ACTUALIZADA")
                    break
    def elimina_vacante(self,id_user,id_et):
        db = logic.load_mongo_client()
        current_file_dir = os.path.dirname(__file__)
        other_file_path = os.path.join(current_file_dir, 'integracion aleja-a7c070957142.json')
        scope = ['https://spreadsheets.google.com/feeds',
                 'https://www.googleapis.com/auth/drive']
        creds = ServiceAccountCredentials.from_json_keyfile_name(other_file_path,scope)
        client = gspread.authorize(creds)
        tipo_persona = db.personas.find_one({"id": int(id_user)})["tipo"]
        sheetindx = ""
        if tipo_persona == 1:
            sheetindx = "Equipo interno"
        if tipo_persona == 5:
            sheetindx = "Programa a éxito"
        if tipo_persona == 6:
            sheetindx = "Compensar"
        if tipo_persona == 8 or tipo_persona == 11:
            sheetindx = "Freemium"
        if tipo_persona == 13:
            sheetindx = "Empresas"
        if sheetindx != "":
            file = self.load_sheet_confs()["sheet_control_vacantes"]
            print(file,sheetindx)
            sheet = client.open(file).worksheet(sheetindx)
            lista = sheet.get_all_records()
            row = 1
            for o in lista:
                row = row +1
                print(o["id"],str(id)+"."+str(id_et))
                if str(o["id"]).strip() == (str(id_user)+"."+str(id_et)).strip():
                    sheet.update_cell(row, 1, "ELIMINADA")
                    break
    def carga_vacante(self,id_user,id_vac,cumple,id_et,fecet):

        db = logic.load_mongo_client()
        current_file_dir = os.path.dirname(__file__)
        other_file_path = os.path.join(current_file_dir, 'integracion aleja-a7c070957142.json')
        scope = ['https://spreadsheets.google.com/feeds',
                 'https://www.googleapis.com/auth/drive']
        creds = ServiceAccountCredentials.from_json_keyfile_name(other_file_path,scope)
        client = gspread.authorize(creds)
        print(int(id_user),",,,,,,,,,,,,",cumple)
        tipo_persona = db.personas.find_one({"id": int(id_user)})["tipo"]
        sheetindx = ""
        if tipo_persona == 1:
            sheetindx = "Equipo interno"
        if tipo_persona == 5:
            sheetindx = "Programa a éxito"
        if tipo_persona == 6:
            sheetindx = "Compensar"
        if tipo_persona == 8 or tipo_persona == 11:
            sheetindx = "Freemium"
        if tipo_persona == 13:
            sheetindx = "Empresas"

        if sheetindx != "":
            file = self.load_sheet_confs()["sheet_control_vacantes"]
            print(file,sheetindx)
            sheet = client.open(file).worksheet(sheetindx)
            n = logic.load_mongo_client().personas.find_one({"id":int(id_user)})
            v = logic.load_mongo_client().vacantes.find_one({"id":int(id_vac)})
            c = "no"
            fec = fecet.split(" ")[0]
            tim = fecet.split(" ")[1]
            if "recompensa" in v:
                r = v["recompensa"]
            else:
                r = "--"
            if "req" in v:
                q = v["req"]
            else:
                q = "--"
            if cumple == True:
                c = "si"
            elif cumple == False:
                c = "no"
            else:
                c = cumple
            data_vac = "Recompensa:"+r+"\nReqs:"+q+"\n"+v["obs"] + "\nRango salarial: "+str(v["rango_menor"])+" - "+str(v["rango_mayor"])+"\nCiudad:"+v["ciudad"]
            row = [str(id_user)+"."+str(id_et),fec,tim,n["nombre"],v["cargo"],v["empresa"],v["link"],v["id"],c,'','','','','','','','','','','',data_vac]
            print("controlado",row)
            sheet.append_row(row)
class integraciones(object):

    def load_mongo_client(self):
        import os
        current_file_path = __file__
        current_file_dir = os.path.dirname(__file__)
        other_file_path = os.path.join(current_file_dir, "config.txt")
        url_bd = '18.222.100.32'
        import urllib.parse
        username = urllib.parse.quote_plus('aleja_user')
        password = urllib.parse.quote_plus('02-10-91aldigovE')
        f=open(other_file_path, "r")
        if f.mode == 'r':
            contents =f.read()
            url_bd = contents.split("url_bd[")[1].split("]")[0]
        #mongo_client = MongoClient('mongodb://%s:%s@18.218.58.145' % (username, password)) #PROD
        mongo_client = MongoClient(str(url_bd) % (username, password))#TEST
        return mongo_client.aleja_bd
    def load_sheet_confs(self):
        import os
        current_file_path = __file__
        current_file_dir = os.path.dirname(__file__)
        other_file_path = os.path.join(current_file_dir, "config.txt")
        obj = {"sheet_postulaciones":"","sheet_control_vacantes":"","sheet_clientes_aleja":"","sheet_control_entrevistas":""}
        f=open(other_file_path, "r")
        if f.mode == 'r':
            contents =f.read()
            obj["sheet_control_vacantes"] = contents.split("sheet_control_vacantes[")[1].split("]")[0]
            obj["sheet_registro_ingresos"] = contents.split("sheet_registro_ingresos[")[1].split("]")[0]
            obj["sheet_control_entrevistas"] = contents.split("sheet_control_entrevistas[")[1].split("]")[0]
            obj["sheet_clientes_aleja"] = contents.split("sheet_clientes_aleja[")[1].split("]")[0]
            obj["sheet_postulaciones"] = contents.split("sheet_postulaciones[")[1].split("]")[0]
        return obj
    def registro_ingreso_epayco(self,data):
        current_file_dir = os.path.dirname(__file__)
        other_file_path = os.path.join(current_file_dir, 'integracion aleja-a7c070957142.json')
        scope = ['https://spreadsheets.google.com/feeds',
                 'https://www.googleapis.com/auth/drive']
        creds = ServiceAccountCredentials.from_json_keyfile_name(other_file_path,scope)
        client = gspread.authorize(creds)
        file = self.load_sheet_confs()["sheet_registro_ingresos"]
        print(file)
        sheet = client.open(file).worksheet("Detalle ingresos")
        cols = sheet.row_values(1)
        
        es = "no"
        if "A4-" in data["descripcion"]:
            jh = "si"
            es = "si"
        else:
            jh = "no"
        if "A10-" in data["descripcion"]:
            es = "si"
        data["jh"] = jh
        data["es"] = es
        mapeo = {"Referencia pago epayco":"referencia","Marca temporal":"fecha","Concepto":"descripcion","Valor consignado":"monto","Nombre completo persona que compró":"nombre","¿Dónde consignó?":"canal","Asignarle job hacker":"jh","Crearlo en la escuela online":"es","Mail":"mail","Celular":"celular"}
        if str(data["impuesto"]) != "0":
            mapeo["Valor consignado sin IVA"] = data["impuesto"]
        salida = []
        for o in cols:
            if o in mapeo:

                salida.append(data[mapeo[o]])
            else:
                salida.append(None)
            
        sheet.append_row(salida)
        print(salida,"todo perfecto")
    

    def activacion_usuario_sheet(self,id,estado,password):
        import os
        current_file_dir = os.path.dirname(__file__)
        other_file_path = os.path.join(current_file_dir, 'integracion aleja-a7c070957142.json')
        scope = ['https://spreadsheets.google.com/feeds',
                 'https://www.googleapis.com/auth/drive']
        creds = ServiceAccountCredentials.from_json_keyfile_name(other_file_path,scope)
        client = gspread.authorize(creds)
        
        current_file_path = __file__
        current_file_dir = os.path.dirname(__file__)
        other_file_path = os.path.join(current_file_dir, "config.txt")
        obj = {"sheet_control_vacantes":"","sheet_clientes_aleja":"","sheet_control_entrevistas":""}
        f=open(other_file_path, "r")
        if f.mode == 'r':
            contents =f.read()
            obj["sheet_control_vacantes"] = contents.split("sheet_control_vacantes[")[1].split("]")[0]
            obj["sheet_control_entrevistas"] = contents.split("sheet_control_entrevistas[")[1].split("]")[0]
            obj["sheet_clientes_aleja"] = contents.split("sheet_clientes_aleja[")[1].split("]")[0]
        file = obj["sheet_clientes_aleja"]
        sheet = client.open(file).sheet1
        lista = sheet.get_all_records()
        row = 1
        for o in lista:
            row = row +1
            if str(o["id"]).strip() == str(id).strip():
                sheet.update_cell(row, 15, estado)
                sheet.update_cell(row, 11, password)
                break
        
    def actualiza_usuarios(self,id,telefono,mail,linkedin,area,cargo,empresa,aspiracion,ciudad,sector,subsector,cargos,faltante_busqueda=""):
        current_file_dir = os.path.dirname(__file__)
        other_file_path = os.path.join(current_file_dir, 'integracion aleja-a7c070957142.json')
        scope = ['https://spreadsheets.google.com/feeds',
                 'https://www.googleapis.com/auth/drive']
        creds = ServiceAccountCredentials.from_json_keyfile_name(other_file_path,scope)
        client = gspread.authorize(creds)
        file = self.load_sheet_confs()["sheet_clientes_aleja"]
        sheet = client.open(file).sheet1
        lista = sheet.get_all_records()
        row = 1
        for o in lista:
            row = row +1
            if str(o["id"]).strip() == str(id).strip():
                sheet.update_cell(row, 5, telefono)
                sheet.update_cell(row, 6, mail)
                sheet.update_cell(row, 7, linkedin)
                sheet.update_cell(row, 8, area)
                sheet.update_cell(row, 9, aspiracion)
                sheet.update_cell(row, 12, cargo)
                sheet.update_cell(row, 13, empresa)
                sheet.update_cell(row, 17, ciudad)
                sheet.update_cell(row, 18, sector)
                sheet.update_cell(row, 19, subsector)
                sheet.update_cell(row, 23, cargos)
                if faltante_busqueda != "":
                    sheet.update_cell(row, 29, faltante_busqueda)
                break
    def actualiza_usuario_login(self,id,fecha):
        current_file_dir = os.path.dirname(__file__)
        other_file_path = os.path.join(current_file_dir, 'integracion aleja-a7c070957142.json')
        scope = ['https://spreadsheets.google.com/feeds',
                 'https://www.googleapis.com/auth/drive']
        creds = ServiceAccountCredentials.from_json_keyfile_name(other_file_path,scope)
        client = gspread.authorize(creds)
        file = self.load_sheet_confs()["sheet_clientes_aleja"]
        sheet = client.open(file).sheet1
        lista = sheet.get_all_records()
        row = 1
        for o in lista:
            row = row +1
            if str(o["id"]).strip() == str(id).strip():
                tot = 1
                print(o["total_logins"],"........")
                if str(o["total_logins"]).strip() != "":
                    tot = int(o["total_logins"]) + 1

                sheet.update_cell(row, 26, tot)
                sheet.update_cell(row, 27, fecha)
                
                break
    def actualiza_representaciones(self,id,numero):
        current_file_dir = os.path.dirname(__file__)
        other_file_path = os.path.join(current_file_dir, 'integracion aleja-a7c070957142.json')
        scope = ['https://spreadsheets.google.com/feeds',
                 'https://www.googleapis.com/auth/drive']
        creds = ServiceAccountCredentials.from_json_keyfile_name(other_file_path,scope)
        client = gspread.authorize(creds)
        file = self.load_sheet_confs()["sheet_clientes_aleja"]
        sheet = client.open(file).sheet1
        lista = sheet.get_all_records()
        row = 1
        for o in lista:
            row = row +1
            if str(o["id"]).strip() == str(id).strip():
                sheet.update_cell(row, 33, numero)
                
                
                break
    def respuesta_formulario(self,n,c,e,o,f,t):
        current_file_dir = os.path.dirname(__file__)
        other_file_path = os.path.join(current_file_dir, 'integracion aleja-a7c070957142.json')
        scope = ['https://spreadsheets.google.com/feeds',
                 'https://www.googleapis.com/auth/drive']
        creds = ServiceAccountCredentials.from_json_keyfile_name(other_file_path,scope)
        client = gspread.authorize(creds)
        sheet = client.open('Respuestas formulario Aleja').sheet1
        sheet.append_row([n,c,e,o,f,t])
    def crea_usuario(self,arr):
        current_file_dir = os.path.dirname(__file__)
        other_file_path = os.path.join(current_file_dir, 'integracion aleja-a7c070957142.json')
        scope = ['https://spreadsheets.google.com/feeds',
                 'https://www.googleapis.com/auth/drive']
        creds = ServiceAccountCredentials.from_json_keyfile_name(other_file_path,scope)
        client = gspread.authorize(creds)
        file = self.load_sheet_confs()["sheet_clientes_aleja"]
        sheet = client.open(file).sheet1
        cols = sheet.row_values(1)
        arr["Marca temporal"] =str(datetime.now().strftime("%d/%m/%Y %H:%M:%S"))
        arr["Dirección de correo electrónico"] = "Aleja"
        print(arr)
        if arr["tipo"] == 13:
            arr["__tipo"] = "empresa"
        else:
            arr["__tipo"] = "freemium"
        arr["password"] = ""
        print(cols)
        salida = []
        for o in cols:
            if o in arr:
                if o == "fecha":
                    fecha_arr = arr[o].split('-')
                    arr[o] = str(fecha_arr[2])+"/"+str(fecha_arr[1])+"/"+str(fecha_arr[0])
                salida.append(arr[o])
            else:
                salida.append("")

        sheet.append_row(salida,value_input_option='USER_ENTERED')
        print(salida,"todo perfecto")
    def registro_postulacion(self,obj):
        current_file_dir = os.path.dirname(__file__)
        other_file_path = os.path.join(current_file_dir, 'integracion aleja-a7c070957142.json')
        scope = ['https://spreadsheets.google.com/feeds',
                 'https://www.googleapis.com/auth/drive']
        creds = ServiceAccountCredentials.from_json_keyfile_name(other_file_path,scope)
        client = gspread.authorize(creds)
        filet = self.load_sheet_confs()
        print(filet)
        file = filet["sheet_postulaciones"]
        sheet = client.open(file).sheet1
        obj_vac = logic.load_mongo_client().vacantes.find_one({"id":int(obj["id_vac"])})
        o={
        "id_postulacion":obj["id"],
        "nombre":obj["nombre"],
        "telefono":obj["telefono"],
        "mail":obj["mail"],
        "aspiracion_max":obj["aspiracion_max"],
        "aspiracion_min":obj["aspiracion_min"],
        "link_hv":"https://drive.google.com/file/d/"+obj["id_cv"],
        "contenido_hv":obj["contenido_cv"],
        "id_vacante":obj["id_vac"],
        "cargo_vacante":obj_vac["cargo"],
        "empresa_vacante":obj_vac["empresa"],
        "tiene_convenio":obj["convenio"],
        "vacante_agentes":obj_vac["servicio"],
        "fecha_envio":obj["fecha"],
        "nombre agente":"--"
        }
        salida = []
        values_list = sheet.row_values(1)

        for u in values_list:
            salida.append(o[u])
        
        sheet.append_row(salida,value_input_option='USER_ENTERED')
        
    def integra_usuarios(self):

        db = logic.load_mongo_client()
        current_file_dir = os.path.dirname(__file__)
        other_file_path = os.path.join(current_file_dir, 'integracion aleja-a7c070957142.json')
        scope = ['https://spreadsheets.google.com/feeds',
                 'https://www.googleapis.com/auth/drive']
        creds = ServiceAccountCredentials.from_json_keyfile_name(other_file_path,scope)
        client = gspread.authorize(creds)
        file = self.load_sheet_confs()["sheet_clientes_aleja"]
        sheet = client.open(file).worksheet("clientes")
        sheet2 = client.open(file).worksheet("Teachable")
        lista = sheet.get_all_records()
        lista2 = sheet2.get_all_records()
        correos = []
        for m in lista2:
            correos.append(m["email"].lower().strip())
        row = 1
        for o in lista:
            print(o)
            row = row +1
            tipo = 5
            if o["__tipo"] == "admin_convenio":
                tipo = 9
            if o["__tipo"] == "empresa":
                tipo = 13
            if o["__tipo"] == "freemium":
                tipo = 8
            if o["__tipo"] == "colombo":
                tipo = 10
            if o["__tipo"] == "jobsearcher":
                tipo = 7
            if o["__tipo"] == "compensar":
                tipo = 6
            if o["__tipo"] == "sin programa":
                tipo = 4
            if o["__tipo"] == "sesiones":
                tipo = 11
            if o['nombre'] == '':
                print(row,'´´´´´´´´´´´')
                continue
            fecha_tmp = o['fecha']
            if fecha_tmp.strip() == '':
                
                x = datetime.now()
                fecha = str(x.year)+"-"+str(x.month)+"-"+str(x.day)
            else:

                fecha_arr = fecha_tmp.split('/')
                fecha = str(fecha_arr[2])+"-"+str(fecha_arr[1])+"-"+str(fecha_arr[0])
            personas = db.personas.find()
            cambia_a_convenio = False
            repetido = False
            id_repetido = ''
            if o['id'] == '':
                for u in personas:
                    if u["mail"].lower().strip() == o['mail'].lower().strip():
                        if o["id"] == '' and u["convenio_busco"] != "si" and o["convenio_busco"] == "si":
                            cambia_a_convenio =True
                        repetido = True
                        id_repetido = u["id"]
                        sheet.update_cell(row, 2, "repetido")
                        sheet.update_cell(row, 3, id_repetido)
                        break
            if o['id'] == '' and repetido == False:

                id_persona = db.personas.find_one(sort=[("id", -1)])["id"]+1
                ets = []
                if tipo == 5:
                    ets = [{"confirmado":True,"fecha": fecha,"id": 1,"label": "contacto","id_objeto": 2142,"personalidad": "","nivel": 3,"obs": ""}]
                db.personas.insert_one({
                            "id":id_persona,
                            "nombre":o['nombre'],
                            "telefono":o['telefono'],
                            "mail":o['mail'],
                            "linkedin":o['linkedin'],
                            "area":o['area'],
                            "aspiracion_min":o['aspiracion_min'],
                            "aspiracion_max":o['aspiracion_min'],
                            "usuario":o['usuario'].strip().lower(),
                            "password":o['password'],
                            "cargos_aplica":o['cargos_aplica'],
                            "tipo":tipo,
                            "etiquetas":ets,
                            "ultimo_cargo":o['ultimo_cargo'],
                            "ultima_empresa":o['ultima_empresa'],
                            "crystal":'',
                            "job_hacker":o['job_hacker'],
                            "estado":o['estado'],
                            "ciudad":o['ciudad'],
                            "sector":o['sector'],
                            "subsector":o['subsector'],
                            "satisfaccion":o['satisfaccion'],
                            "fecha":fecha,
                            "representaciones":'',
                            "convenio_busco":o["convenio_busco"]

                            })
                logic.envio_correo("creacion_usuario",id_persona,{"tipo":tipo,"nombre":o["nombre"].split(" ")[0].strip(),"usuario":o['usuario'].strip().lower(),"password":o['password']},o["mail"])
                print(id_persona)
                sheet.update_cell(row, 3, id_persona)
                if tipo == 5:
                    sheet.update_cell(row, 33, "-1")
                if tipo != 8 or (tipo == 8 and o["convenio_busco"].strip().lower() == 'si'):
                    
                    sheet2.append_row([o["mail"],o["nombre"],o["password"],id_persona])
                
            else:
                if repetido == False:
                    id = int(o['id'])
                else:
                    id = id_repetido
                    #sheet.update_cell(row, 2, "repetido")
                    ##sheet.update_cell(row, 3, id)
                o.pop('id', None)
                o2 = copy.deepcopy(o)
                #if o["mail"] not in correos and id > 11000:
                #    sheet2.append_row([o["mail"],o["nombre"],o["password"],id])
                for w in o2:
                    if "__" in w:
                        o.pop(w,None)
                o['fecha'] = fecha
                o['tipo'] = tipo
                #print(id,o)
                o["usuario"] = o["usuario"].strip().lower()
                
                #print('------------------------')
                db.personas.update_one({"id":id},{"$set":o})
                #sheet.update_cell(row, 3, id)
                #if cambia_a_convenio == True:
                #    logic.envio_correo("actualizacion_convenio",id_persona,{"tipo":tipo,"nombre":o["nombre"].split(" ")[0].strip(),"usuario":o['usuario'].strip().lower(),"password":o['password']},o["mail"])   
                
                #print("nada")
    def integra_satisfaccion(self,config,nombre,stopers):
        current_file_dir = os.path.dirname(__file__)
        other_file_path = os.path.join(current_file_dir, 'integracion aleja-a7c070957142.json')
        scope = ['https://spreadsheets.google.com/feeds',
                 'https://www.googleapis.com/auth/drive']
        creds = ServiceAccountCredentials.from_json_keyfile_name(other_file_path,scope)
        client = gspread.authorize(creds)
        
        sheet = client.open(nombre).sheet1
        lista = sheet.get_all_records()
        row = 1
        for o in lista:
            row = row +1
            
            
            if o["sync"] != "si": 
                fecha_tmp = o["Submitted At"]
                fecha_arr = fecha_tmp.split('/')
                anio = fecha_arr[2].split(' ')[0]
                fecha = str(anio)+"-"+str(fecha_arr[1])+"-"+str(fecha_arr[0])
                token = o["Token"]
                usuario = o['Primero debemos identificarte']
                s = {"encuesta":nombre,"fecha":fecha,"token":token}
                col = 0
                col_sync = 20
                for w in o:
                    col = col+1
                    if w == "sync":
                        col_sync = col
                    if w not in stopers:
                        print("punto controlado!!....",row,col,w,o[w])
                        pregunta = unidecode(w.replace(" ", "_").replace("?","").replace("¿","").strip().lower())
                        indx_respuesta= config[pregunta]
                        o[w] = str(o[w])
                        if indx_respuesta == []:
                            respuesta = o[w]
                        else:
                            respuesta_tmp = unidecode(o[w].replace(" ", "_").replace("?","").replace("¿","").strip().lower())
                            try:
                                size = len(indx_respuesta)
                                index = ((indx_respuesta.index(respuesta_tmp)-size)*(-1))
                                respuesta = (10/size)*index
                                
                            except:
                                respuesta = o[w]
                        s[pregunta] = respuesta
                print("s creada...",s)
                res = logic.load_mongo_client().personas.update({"usuario":str(usuario)},{"$push":{"encuestas" : s}})
                if res["nModified"] > 0:
                    print(res)
                    sheet.update_cell(row,col_sync, "si")
                else:
                    res = logic.load_mongo_client().personas.update({"nombre":str(usuario)},{"$push":{"encuestas" : s}})
                    if res["nModified"] > 0:
                        print(res)
                        sheet.update_cell(row,col_sync, "si")
                    else:
                        sheet.update_cell(row,col_sync, "usuario no encontrado")
"""
METODO EN DESUSO POR INTEGRACION MONDAY

def registro_postulacion(obj):
    import gc
    gc.collect()
    rcm = integraciones()
    rcm.registro_postulacion(obj)
    json_data = json.dumps({"return":"ok"}, sort_keys=False, ensure_ascii=False) 
    return json_data
"""
def activacion_usuario_sheet(id,estado,password):
    import gc
    gc.collect()
    rcm = integraciones()
    rcm.activacion_usuario_sheet(id,estado,password)
    json_data = json.dumps({"return":"ok"}, sort_keys=False, ensure_ascii=False) 
    return json_data
def registro_ingreso_epayco(data):
    import gc
    gc.collect()
    rcm = integraciones()
    rcm.registro_ingreso_epayco(data)
    json_data = json.dumps({"return":"ok"}, sort_keys=False, ensure_ascii=False) 
    return json_data
def actualiza_usuarios(id,telefono,mail,linkedin,area,cargo,empresa,aspiracion,ciudad,sector,subsector,cargos,faltante_busqueda=""):
    import gc
    gc.collect()
    rcm = integraciones()
    rcm.actualiza_usuarios(id,telefono,mail,linkedin,area,cargo,empresa,aspiracion,ciudad,sector,subsector,cargos,faltante_busqueda)
    json_data = json.dumps({"return":"ok"}, sort_keys=False, ensure_ascii=False) 
    return json_data
def crea_usuario(arr):
    import gc
    gc.collect()
    rcm = integraciones()
    rcm.crea_usuario(arr)
    json_data = json.dumps({"return":"ok"}, sort_keys=False, ensure_ascii=False) 
def respuesta_formulario(n,c,e,o,f,t):
    import gc
    gc.collect()
    rcm = integraciones()
    rcm.respuesta_formulario(n,c,e,o,f,t)
    json_data = json.dumps({"return":"ok"}, sort_keys=False, ensure_ascii=False) 
    return json_data
def actualiza_representaciones(id,numero):
    import gc
    gc.collect()
    rcm = integraciones()
    try:
        rcm.actualiza_representaciones(id,numero)
    except:
        logic.load_mongo_client().errores.insert_one({"servicio":"update_creditos","data":data})
        json_data = json.dumps({"return":"error integracion"}, sort_keys=False, ensure_ascii=False) 
    json_data = json.dumps({"return":"ok"}, sort_keys=False, ensure_ascii=False) 
    return json_data
def actualiza_usuario_login(id,fecha):
    import gc
    gc.collect()
    rcm = integraciones()
    rcm.actualiza_usuario_login(id,fecha)
    json_data = json.dumps({"return":"ok"}, sort_keys=False, ensure_ascii=False) 
    return json_data
def carga_servicio(data):
    import gc
    gc.collect()
    rcm = control_atencion()
    try:
        rcm.carga_servicio(data)
        json_data = json.dumps({"return":"ok"}, sort_keys=False, ensure_ascii=False) 
    except:
        logic.load_mongo_client().errores.insert_one({"servicio":data["tipo"],"data":data})
        json_data = json.dumps({"return":"error integracion"}, sort_keys=False, ensure_ascii=False) 
    return json_data
def carga_entrevista(id_user,id_vac,id_per,id_et,fecet,nivel,fec_pr,servicio):
    import gc
    gc.collect()
    rcm = control_atencion()
    try:
        rcm.carga_entrevista(id_user,id_vac,id_per,id_et,fecet,nivel,fec_pr,servicio)
        json_data = json.dumps({"return":"ok"}, sort_keys=False, ensure_ascii=False) 
    except:
        logic.load_mongo_client().errores.insert_one({"id_user":id_user,"id_vac":id_vac,"id_per":id_per,"id_et":id_et,"fecet":fecet,"nivel":nivel,"fec_pr":fec_pr,"servicio":servicio,"estatus":"abierto"})
        json_data = json.dumps({"return":"error integracion"}, sort_keys=False, ensure_ascii=False) 
    return json_data
def elimina_servicio(id_serv,id_user,nw_id_serv):
    import gc
    gc.collect()
    rcm = control_atencion()
    rcm.elimina_servicio(id_serv,id_user,nw_id_serv)
    json_data = json.dumps({"return":"ok"}, sort_keys=False, ensure_ascii=False) 
    return json_data
def edita_entrevista(id_user,id_vac,id_per,id_et,fecet,nivel,fec_pr,servicio):
    import gc
    gc.collect()
    rcm = control_atencion()
    rcm.edita_entrevista(id_user,id_vac,id_per,id_et,fecet,nivel,fec_pr,servicio)
    json_data = json.dumps({"return":"ok"}, sort_keys=False, ensure_ascii=False) 
    return json_data
def edita_vacante(id_user,id_et,fecha,cumple):
    import gc
    gc.collect()
    rcm = control_atencion()
    rcm.edita_vacante(id_user,id_et,fecha,cumple)
    json_data = json.dumps({"return":"ok"}, sort_keys=False, ensure_ascii=False) 
    return json_data
def elimina_vacante(id_user,id_et):
    import gc
    gc.collect()
    rcm = control_atencion()
    rcm.elimina_vacante(id_user,id_et)
    json_data = json.dumps({"return":"ok"}, sort_keys=False, ensure_ascii=False) 
    return json_data
def carga_vacante(id_user,id_vac,cumple,id_et,fecet):
    import gc
    gc.collect()
    rcm = control_atencion()
    try:
        rcm.carga_vacante(id_user,id_vac,cumple,id_et,fecet)
        json_data = json.dumps({"return":"ok"}, sort_keys=False, ensure_ascii=False) 
    except:
        logic.load_mongo_client().errores.insert_one({"id_user":id_user,"id_vac":id_vac,"cumple":cumple,"id_et":id_et,"fecet":fecet,"estatus":"abierto"})
        json_data = json.dumps({"return":"error integracion"}, sort_keys=False, ensure_ascii=False) 
    return json_data

def integra_todo():
    import gc
    gc.collect()
    rcm = integraciones()
    print("integra_usuarios::131:", datetime.now().strftime("%H:%M:%S"))
    rcm.integra_usuarios()
    """
    config = {"que_tan_oportuna_fue_la_atencion_por_canales_virtuales":["fue_muy_oportuna_la_atencion","fue_oportuna_pero_podria_mejorar","fue_muy_lenta_la_atencion"],
    "que_tan_relevante_fue_la_informacion_que_te_remitio_el_equipo_de_seligo":["muy_util","medianamente_util","no_fue_util"],
    "como_calificarias_el_servicio_prestado_esta_semana":["me_encanto","estoy_muy_satisfecho","estuvo_bien","creo_que_podria_mejorar","estoy_insatisfecho"],
    "cuentanos_un_poco_mas_por_que_tuviste_ese_nivel_de_satisfaccion":[]}
    nombre = 'Satisfaccion cliente programa'
    stopers = ["Primero debemos identificarte","Submitted At","Token","sync","ending_displayed_id"]
    rcm = integraciones()
    print("integra_satisfaccion_programa::133:", datetime.now().strftime("%H:%M:%S"))
    rcm.integra_satisfaccion(config,nombre,stopers)
    print("integra_satisfaccion_programa::141:", datetime.now().strftime("%H:%M:%S"))
    config = {"que_sesion_tomaste":[],
    "manejo_del_tiempo":["adecuado","inadecuado","desfasado"],
    "manejo_de_la_informacion":["muy_completo","bueno","podria_mejorar"],
    "relevancia_de_la_informacion":["muy_util","medianamente_util","no_fue_util"],
    "novedad_de_la_informacion":["es_informacion_de_vanguardia","es_buena_pero_no_novedosa","esta_des_actualizada"],
    "que_calificacion_le_darias_a_tu_sesion":[]}
    nombre = 'Satisfaccion cliente sesiones'
    stopers = ["Primero debemos identificarte","Submitted At","Token","sync","ending_displayed_id"]
    rcm = integraciones()
    print("integra_satisfaccion_sesiones::147:", datetime.now().strftime("%H:%M:%S"))
    rcm.integra_satisfaccion(config,nombre,stopers)
    print("integra_satisfaccion_programa::156:", datetime.now().strftime("%H:%M:%S"))
    """
    json_data = json.dumps({"return":"ok"}, sort_keys=False, ensure_ascii=False) 
    print("integra_stotal:sale:", datetime.now().strftime("%H:%M:%S"))
    return json_data

def integra_usuarios():
    import gc
    gc.collect()
    rcm = integraciones()
    print("integra_usuarios::131:", datetime.now().strftime("%H:%M:%S"))
    rcm.integra_usuarios()
    print("integra_usuarios::132:", datetime.now().strftime("%H:%M:%S"))
    json_data = json.dumps({"return":"ok"}, sort_keys=False, ensure_ascii=False) 
    print("integra_usuarios:sale:", datetime.now().strftime("%H:%M:%S"))

    return json_data
def integra_satisfaccion_programa():
    config = {"que_tan_oportuna_fue_la_atencion_por_canales_virtuales":["fue_muy_oportuna_la_atencion","fue_oportuna_pero_podria_mejorar","fue_muy_lenta_la_atencion"],
    "que_tan_relevante_fue_la_informacion_que_te_remitio_el_equipo_de_seligo":["muy_util","medianamente_util","no_fue_util"],
    "como_calificarias_el_servicio_prestado_esta_semana":["me_encanto","estoy_muy_satisfecho","estuvo_bien","creo_que_podria_mejorar","estoy_insatisfecho"],
    "cuentanos_un_poco_mas_por_que_tuviste_ese_nivel_de_satisfaccion":[]}
    nombre = 'Satisfaccion cliente programa'
    stopers = ["Primero debemos identificarte","Submitted At","Token","sync","ending_displayed_id"]
    import gc
    gc.collect()
    rcm = integraciones()
    print("integra_satisfaccion_programa::133:", datetime.now().strftime("%H:%M:%S"))
    rcm.integra_satisfaccion(config,nombre,stopers)
    print("integra_satisfaccion_programa::141:", datetime.now().strftime("%H:%M:%S"))
    json_data = json.dumps({"return":"ok"}, sort_keys=False, ensure_ascii=False) 
    print("integra_satisfaccion_programa:sale:", datetime.now().strftime("%H:%M:%S"))
    return json_data

"""def get_file(file_id):
    current_file_dir = os.path.dirname(__file__)
    other_file_path = os.path.join(current_file_dir, 'integracion aleja-a7c070957142.json')
    scope = ['https://www.googleapis.com/auth/drive']
    creds = ServiceAccountCredentials.from_json_keyfile_name(other_file_path,scope)
    drive_api = build('drive', 'v3', credentials=creds)
    print(file_id)
    request = drive_api.files().get_media(fileId=file_id)

    print(request)
    file_meta = drive_api.files().get(fileId=file_id).execute()
    print(file_meta)
    file_name = file_meta['name']
    
    mime = mimetypes.MimeTypes().guess_type(file_name)[0]
    fh = io.BytesIO()
    downloader = MediaIoBaseDownload(fh, request)
    done = False
    while done is False:
        status, done = downloader.next_chunk()
        print("Download %d%%." % int(status.progress() * 100))
    

    filename = datetime.strftime(datetime.now(), '%Y-%m-%d-%H-%M-%S')
    extension = file_name.split(".")[len(file_name.split("."))-1]

    with open(os.path.join("/home/ec2-user/temp_downloads/",filename) + extension, 'wb') as f:
        #for data in file_size_request.iter_content(block_size):         
        f.write(fh.getvalue())     
        f.close()
    with open(os.path.join("/home/ec2-user/temp_downloads/",filename) + extension, 'rb') as f:
        data = f.read()   
    print("archivo cargados en el servidor")
    os.remove(os.path.join("/home/ec2-user/temp_downloads/",filename) + extension)
    print("archivo eliminado del servidor")
    return {"file":data,"name":file_name,"mime":mime}
"""
def get_last_cv(id):
    res = logic.load_mongo_client().personas.find_one({"id":int(id)})
    if "id_last_cv" in res:
        return logic.get_file(res["id_last_cv"])
    else:
        return "NaN"
def load_file(file,id,name=""):
    current_file_dir = os.path.dirname(__file__)
    other_file_path = os.path.join(current_file_dir, 'integracion aleja-a7c070957142.json')
    scope = ['https://www.googleapis.com/auth/drive']
    creds = ServiceAccountCredentials.from_json_keyfile_name(other_file_path,scope)
    drive_api = build('drive', 'v3', credentials=creds)
    file_name = str(file)
    extension = file_name.split(".")[len(file_name.split("."))-1]
    mime = mimetypes.MimeTypes().guess_type(file_name)[0]
    print("Uploading file " + file_name + "..."+str(id))
    res = logic.load_mongo_client().personas.find_one({"id":int(id)})
    datetimen = datetime.now() - timedelta(hours=5)
    if name == "":
        nw_file_name = "AC"+str(res["id"])+"VG "+res["nombre"].lower()+"_"+datetimen.strftime("%Y_%m_%d_%H_%M_%S")+"."+extension
    else:
        nw_file_name = "AC"+name+"VS "+res["nombre"].lower()+"."+extension
    body = {'name': nw_file_name, 'mimeType':mime, 'parents':["1TzwJzpVIeA1RD2lMu0zRv3L17m8mRvsE"]}    
    media = MediaIoBaseUpload(io.BytesIO(file.read()), mimetype=mime, resumable=True)
    fiahl = drive_api.files().create(body=body, media_body=media).execute()
    file_id = fiahl.get("id")
    perm_body ={
        'role':'reader',
        'type':'anyone'
    }
    resperm = drive_api.permissions().create(fileId=file_id,body=perm_body).execute()
    print(resperm)
    reslink = drive_api.files().get(fileId = file_id,fields='webViewLink').execute()
    print(reslink)
    logic.load_mongo_client().personas.update_one({"id":int(id)},{"$set":{"id_last_cv":file_id}})
    try:
        id_cv =  logic.load_mongo_client().cvs.find_one(sort=[("id", -1)])["id"]+1
    except:
        id_cv = 1
    
    logic.load_mongo_client().cvs.insert_one({"id":id_cv,"id_file":file_id,"fecha":date.today().strftime("%Y-%m-%d"),"hora":datetimen.strftime("%H:%M:%S"),"id_user":int(id),"original_name":file_name,"name":nw_file_name})
    res_doc_pr = logic.extraer_contenido_archivo(file_id)
    return {"id":file_id,"contenido":res_doc_pr["contenido"]}


def integra_satisfaccion_sesiones():
    config = {"que_sesion_tomaste":[],
    "manejo_del_tiempo":["adecuado","inadecuado","desfasado"],
    "manejo_de_la_informacion":["muy_completo","bueno","podria_mejorar"],
    "relevancia_de_la_informacion":["muy_util","medianamente_util","no_fue_util"],
    "novedad_de_la_informacion":["es_informacion_de_vanguardia","es_buena_pero_no_novedosa","esta_des_actualizada"],
    "que_calificacion_le_darias_a_tu_sesion":[]}
    nombre = 'Satisfaccion cliente sesiones'
    stopers = ["Primero debemos identificarte","Submitted At","Token","sync","ending_displayed_id"]
    import gc
    gc.collect()
    rcm = integraciones()
    print("integra_satisfaccion_sesiones::147:", datetime.now().strftime("%H:%M:%S"))
    rcm.integra_satisfaccion(config,nombre,stopers)
    print("integra_satisfaccion_programa::156:", datetime.now().strftime("%H:%M:%S"))
    json_data = json.dumps({"return":"ok"}, sort_keys=False, ensure_ascii=False) 
    print("integra_satisfaccion_sesiones:sale:", datetime.now().strftime("%H:%M:%S"))
    return json_data
