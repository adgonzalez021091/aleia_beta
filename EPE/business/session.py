from pymongo import MongoClient
import pymongo
import json
from bson.json_util import dumps
from datetime import *

permisos_usuario_admin = [0,1,2,9]

class loader_interactions(object):
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
        print(other_file_path)
        if f.mode == 'r':
            contents =f.read()
            print(contents)
            url_bd = contents.split("url_bd[")[1].split("]")[0]
        #mongo_client = MongoClient('mongodb://%s:%s@18.218.58.145' % (username, password)) #PROD
        mongo_client = MongoClient(str(url_bd) % (username, password))#TEST
        return mongo_client.aleja_bd
    def login(self,user,passw):
        
        db = self.load_mongo_client()
        print("tm28:", datetime.now().strftime("%H:%M:%S"),user.strip())
        rat = db.personas.find({"usuario":user.strip()})
        if rat.count() == 0:
            return {"error":True,"mensaje":"Usuario no encontrado"}
        if "cargos_aplica" in rat[0]:
            cargos_aplica = rat[0]["cargos_aplica"]
        else:
            cargos_aplica = ""
        salida = ""
        print("tm31:", datetime.now().strftime("%H:%M:%S"),str(rat[0]["password"]),str(passw) , str(rat[0]["password"]).strip(),rat[0])
        try:
            if str(rat[0]["password"]) == str(passw) and str(rat[0]["password"]).strip() != "":
                admin = 0
                if (int(rat[0]["tipo"]) in permisos_usuario_admin) and rat[0]["usuario"] != "":
                    admin = 1
                salida= {"data":{"lista":{},"cargos_aplica":cargos_aplica,"nombre":rat[0]["nombre"],"id":rat[0]["id"],"admin":admin,"tipo":rat[0]["tipo"]},"error":False}
            elif str(rat[0]["password"]).strip() == "":
                salida = {"error":True,"mensaje":"Cuenta pendiente por activar. Por favor revisa tu correo"}
            elif str(rat[0]["password"]) != str(passw):
                salida = {"error":True,"mensaje":"Contraseña incorrecta"}
        except ValueError:
            print(ValueError)
            salida = {"error":True,"mensaje":"Usuario no encontrado."}
        
            
        return salida

def login(user,passw):
    import gc
    gc.collect()
    rcm = loader_interactions()
    
    obj = rcm.login(user,passw)
    json_data = json.dumps({"retorno":obj}, sort_keys=False, ensure_ascii=False)
    return json_data