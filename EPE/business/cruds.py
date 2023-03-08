from pymongo import MongoClient
import pymongo
import logging
logging.basicConfig(filename='app.log', filemode='w', format='%(name)s - %(levelname)s - %(message)s')
import json
from EPE.business.logic import *
from EPE.business.integracion_sheets import *
from bson.json_util import dumps
from datetime import *
from bson.json_util import loads
import json

permisos_usuario_atencion = [5,6,8]
permisos_usuario_empresa= [13]
class read(object):
    def load_mongo_client():
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
    def get_persona(self,id):
        print("read_persona:", datetime.now().strftime("%H:%M:%S"))
        logging.info('This will get logged to a file')
        db = load_mongo_client()
        persona = db.personas.find({"id":int(id)})
        print("read_persona:", datetime.now().strftime("%H:%M:%S"))
        
        
        s = json.loads(dumps(list(persona)))
        s2 = process_data_json(s)
        print("read_persona:", datetime.now().strftime("%H:%M:%S"))
        return s2[0]
    def get_vacante(self,id):
        logging.info('This will get logged to a file')
        db = load_mongo_client()
        vacante = db.vacantes.find({"id":int(id)})
        
        
        s = json.loads(dumps(list(vacante)))
        s2 = process_data_json(s)
        return s2[0]
    def read_personas(self,id_sesion):
        print("read_personasin_tm11:", datetime.now().strftime("%H:%M:%S"))
        logging.info('This will get logged to a file')
        db = load_mongo_client()
        print("read_personasin_tm14:", datetime.now().strftime("%H:%M:%S"))
        personas = db.personas.find()
        print("read_personasin_tm16:", datetime.now().strftime("%H:%M:%S"))
        
        
        s = process_data_persona(json.loads(dumps(list(personas))),id_sesion)
        s2 = process_data_persona_seguimiento(json.loads(dumps(list(copy.deepcopy(personas)))),id_sesion)
        print("read_personasin_tm16:", datetime.now().strftime("%H:%M:%S"))
        #s2 = process_data_json(s,"contacto")
        return {"total":s,"seguimiento":s2}
    def read_servicios(self,id_sesion):
        logging.info('This will get logged to a file')
        db = load_mongo_client()
        servicios = db.servicios.find({"id_usuario":int(id_sesion)})
        
        s = json.loads(dumps(list(servicios)))
        s2 = process_data_json(s)
        for o in s2:
            
            tmp = db.vacantes.find_one({"id":int(o["id_vacante"])})
            o["data1"] = tmp["cargo"]
            o["data2"] = tmp["empresa"]
        #s2 = process_data_json(s,"contacto")
        return s2
    def read_vacantes(self,id_sesion):
        db = load_mongo_client()
        vacantes = db.vacantes.find()
        s = process_data_vacante(json.loads(dumps(list(vacantes))),id_sesion)
        return s
    def read_ciudades(self):
        print("read_ciudades1:", datetime.now().strftime("%H:%M:%S"))
        db = load_mongo_client()
        ciudades = db.ciudades.find()
        print("read_ciudades2:", datetime.now().strftime("%H:%M:%S"))
        s = process_data_ciudades(json.loads(dumps(list(ciudades))))
        print("read_ciudades3:", datetime.now().strftime("%H:%M:%S"))
        return s
class create_update(object):
    
    """def load_mongo_client():
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
    """
    
    def actualizacion_info_vacante(self,id_con,id_user,id_et,resp,id_com,tipo):
        try:
            xx = int(float(id_com))
        except:
            id_com = "-1"
        #try:
        mensaje = "ok"
        fecha = datetime.now().strftime("%Y-%m-%d")
        hora = (datetime.now()+ timedelta(hours=-5)).strftime("%H:%M:%S")
        try:
            id_con_int = int(float(id_con))
            data = load_mongo_client().personas.find_one({"id":id_con_int})
            linkedin_contacto = data["linkedin"]
            nombre = data["nombre"]
            cargo = data["ultimo_cargo"]
        except:
            id_con_int = ""
            linkedin_contacto = ""
            nombre = ""
            cargo = ""
            data = {}
        print(id_user,id_com,tipo)
        param = "label[[contacto]]id[["+str(id_con_int)+"]]fecha[["+fecha+"]]verificacion_contacto[[]]nivel[[1]]obs[[]]"
        if id_con_int != "":
            self.conector_crear_actualizar_etiqueta(param,int(id_user),0)
        print("haber si por aca si",id_con,id_user,id_et,resp,id_com,tipo)
        if tipo == "representacion":
            if str(int(float(id_com))) != "-1":
                eliminar_comentario(id_user,id_et,id_com,id_user)
            data2 = load_mongo_client().personas.find_one({"id":int(id_user)})
            cargo_vac = ""
            empresa_vac = ""
            for o in data2["etiquetas"]:
                if o["id"] == int(id_et):
                    vac = load_mongo_client().vacantes.find_one({"id":int(o["id_objeto"])})
                    cargo_vac = vac["cargo"]
                    empresa_vac = vac["empresa"]
            res_mail = envio_correo("representado",id_user,{"linkedin_con":linkedin_contacto,"nombre_con":nombre,"cargo_con":cargo,"nombre":data2["nombre"].split(" ")[0].strip(),"mensaje":resp,"cargo":cargo_vac,"empresa":empresa_vac},data2["mail"])
            
            mensaje = "ok "+res_mail["mensaje"]
            load_mongo_client().servicios.update_one({"id":str(id_user)+"."+str(id_et)+"_1"},{"$set":{"estatus":"respondido"}})
        elif tipo == "si":
            if str(int(float(id_com))) != "-1":
                eliminar_comentario(id_user,id_et,id_com,id_user)
            data2 = load_mongo_client().personas.find_one({"id":int(id_user)})
            cargo_vac = ""
            empresa_vac = ""
            for o in data2["etiquetas"]:
                if o["id"] == int(id_et):
                    vac = load_mongo_client().vacantes.find_one({"id":int(o["id_objeto"])})
                    cargo_vac = vac["cargo"]
                    empresa_vac = vac["empresa"]
            res_mail = envio_correo("representado",id_user,{"linkedin_con":linkedin_contacto,"nombre_con":nombre,"cargo_con":cargo,"nombre":data2["nombre"].split(" ")[0].strip(),"mensaje":resp,"cargo":cargo_vac,"empresa":empresa_vac},data2["mail"])
            
            mensaje = "ok "+res_mail["mensaje"]
        elif tipo == "no" or tipo == "contacto":
            if str(int(float(id_com))) != "-1":
                eliminar_comentario(id_user,id_et,id_com,id_user)
            data2 = load_mongo_client().personas.find_one({"id":int(id_user)})
            cargo_vac = ""
            empresa_vac = ""
            for o in data2["etiquetas"]:
                if o["id"] == int(id_et):
                    vac = load_mongo_client().vacantes.find_one({"id":int(o["id_objeto"])})
                    cargo_vac = vac["cargo"]
                    empresa_vac = vac["empresa"]
            resp_salida = ""

            if resp.strip().lower() == "confidencial":
                resp_salida = "Debido a que esta vacante es confidencial no hemos podido gestionar ningun contacto. Estamos pendientes a que nos comentes si te llaman para este cargo"
                res_mail = {"mensaje":"sin correo"}
            elif resp.strip().lower() == "inhospito":
                resp_salida = "Lo sentimos, no encontramos información de esta empresa. Apenas tengamos alguna novedad del equipo de investigación te comentaremos."
                res_mail = envio_correo("contacto_vacante_sin_info",id_user,{"nombre":data2["nombre"].split(" ")[0].strip(),"mensaje":resp_salida,"cargo":cargo_vac,"empresa":empresa_vac},data2["mail"])
            elif resp.strip().lower() == "encontrado":
                resp_salida = "Hemos asociado este contactos para ti. "+nombre+", "+cargo+" en "+empresa_vac
                datos_con = str(data["mail"])+"<br>"+str(data["telefono"])+"<br>"+str(data["linkedin"])
                res_mail = envio_correo("contacto_vacante",id_user,{"nombre":data2["nombre"].split(" ")[0].strip(),"datos_con":datos_con,"crystal_con":data["crystal"],"nombre_con":nombre,"cargo_con":cargo,"id_con":int(float(id_con)),"cargo":cargo_vac,"empresa":empresa_vac},data2["mail"])
            else :
                return {"ok":"no","mensaje":"tipo de respuesta debe ser 'confidencial', 'inospito' o 'encontrado'"}
            
            
            mensaje = "ok "+res_mail["mensaje"]
            resp = resp_salida
        obj = json.loads(crear_comentario(fecha,resp,id_user,id_et,-1))
        hora = hora+"."+str(obj["return"]["obj_comentario"]["id"])
        #except:
        #    return {"ok":"no"}
        return {"ok":"si","fecha":fecha,"hora":hora,"nombre":nombre,"cargo":cargo,"mensaje":mensaje,"link":linkedin_contacto}
    def registro_logs(self,id_user):
        now = datetime.now()
        param_fecha = now.strftime("%Y-%m-%d")
        load_mongo_client().logs.insert_one({"fecha":param_fecha,"parametro":"","accion":"login","id_retorno":"","tipo":"recarga","etiqueta":"","id_user":id_user,"id_sesion":""})
        actualiza_usuario_login(id_user,param_fecha)
    def guarda_datos_perfil(self,id,parametro):
        dato_solo = True
        #update
        
        cargo = parametro.split("ultimo_cargo[[")[1].split("]]")[0].strip()
        id_persona = int(id)
        objeto_salida_u = {
            
            "ultimo_cargo":cargo,
            "ultima_empresa":parametro.split("ultima_empresa[[")[1].split("]]")[0].strip(),
            "aspiracion_min":parametro.split("aspiracion_min[[")[1].split("]]")[0].strip(),
            "aspiracion_max":parametro.split("aspiracion_max[[")[1].split("]]")[0].strip(),
            
            
            "fecha_update":parametro.split("fecha[[")[1].split("]]")[0].strip()
            }
        faltante_busqueda = ""
        if "]]faltante_busqueda[[" in parametro:
            objeto_salida_u["faltante_busqueda"]= parametro.split("faltante_busqueda[[")[1].split("]]")[0].strip()
            faltante_busqueda = parametro.split("faltante_busqueda[[")[1].split("]]")[0].strip()
        print(faltante_busqueda,parametro)
        if "incompleto[[]]" not in parametro:
            objeto_salida_u["cargos_aplica"]=parametro.split("cargos_aplica[[")[1].split("]]")[0].strip()
            objeto_salida_u["linkedin"]= parametro.split("linkedin[[")[1].split("]]")[0].strip()
            objeto_salida_u["logros"]=parametro.split("logros[[")[1].split("]]")[0].strip()
            objeto_salida_u["telefono"]=parametro.split("telefono[[")[1].split("]]")[0].strip()
            objeto_salida_u["mail"]=parametro.split("mail[[")[1].split("]]")[0].strip()
            objeto_salida_u["area"]=parametro.split("area[[")[1].split("]]")[0].strip()
            objeto_salida_u["ciudad"]=parametro.split("ciudad[[")[1].split("]]")[0].strip()
            objeto_salida_u["sector"]=parametro.split("sector[[")[1].split("]]")[0].strip()
            objeto_salida_u["subsector"]=parametro.split("subsector[[")[1].split("]]")[0].strip()
        load_mongo_client().personas.update_one(
            {"id":id_persona},
            {"$set":objeto_salida_u
            })
        if "incompleto[[]]" not in parametro:
            linkedin = parametro.split("linkedin[[")[1].split("]]")[0].strip()
            telefono = parametro.split("telefono[[")[1].split("]]")[0].strip()
            mail =  parametro.split("mail[[")[1].split("]]")[0].strip()
            area =parametro.split("area[[")[1].split("]]")[0].strip()
            ciudad = parametro.split("ciudad[[")[1].split("]]")[0].strip()
            sector = parametro.split("sector[[")[1].split("]]")[0].strip()
            subsector = parametro.split("subsector[[")[1].split("]]")[0].strip()
            cargos = parametro.split("cargos_aplica[[")[1].split("]]")[0].strip()
        else:
            tmp_o = load_mongo_client().personas.find_one({"id":int(id)})
            telefono = tmp_o["telefono"]
            mail = tmp_o["mail"]
            area = ""#tmp_o["area"]
            ciudad = ""#tmp_o["ciudad"]
            sector = ""#tmp_o["sector"]
            subsector = ""
            linkedin = ""
            cargos = ""

        empresa = parametro.split("ultima_empresa[[")[1].split("]]")[0].strip()
        aspiracion = parametro.split("aspiracion_min[[")[1].split("]]")[0].strip()
        

        actualiza_usuarios(id_persona,telefono,mail,linkedin,area,cargo,empresa,aspiracion,ciudad,sector,subsector,cargos,faltante_busqueda)
        return {"retorno":"ok"}
        
    def crear_comentario(self,fecha,texto,id,id_et,id_user):

        ret = load_mongo_client().personas.find_one({"id":int(id)})
        id_m = 0
        label = ""
        for o in ret["etiquetas"]:
            if int(o["id"]) == int(id_et) and "comentarios" in o:
                label = o["label"]
                for u in o["comentarios"]:
                    if u["id"] > id_m:
                        id_m = u["id"]
                break
        tmp = {"id":int(id_m+1),"fecha":fecha,"comentario":texto}
        print("controladooo!",label,fecha,texto,id,id_et,id_user)
        #if label == "oportunidad":
        #    responde_vacante(id,id_et,str(fecha)+" "+(datetime.now() + timedelta(hours=-5)).strftime("%H:%M:%S"),texto,id_user)
        load_mongo_client().personas.update({"id" : int(id), "etiquetas.id": int(id_et)},{"$push":{"etiquetas.$.comentarios":tmp}})
        ret = load_mongo_client().personas.find_one({"id":int(id)})
        print("control etiqueta...",id_et)

        for o in ret["etiquetas"]:
            if int(o["id"]) == int(id_et):
                return {"lista_completa":json.loads(dumps(list(o["comentarios"]))),"obj_comentario":tmp}
        return {"lista_completa":[],"obj_comentario":{"id":"0","comentario":"no se encontró la vacante"}}

    def crear_actualizar_objeto(self,parametro,tipo,etiqueta,id_user,id_adm):
        #valores para etiqueta: -1 es objeto sin asociar a usuario, 0 es crear etiqueta, >0 es el id de la etiqueta
        id_retorno = -1
        param_fecha = parametro.split("fecha[[")[1].split("]]")[0].strip()
        accion = ""
        data_persona = {}
        
        accion_perfil = False
        if tipo == "crear_contacto_perfil":
            accion_perfil = True
            tipo = "crear_contacto"

        objeto_salida = {}
        object_update = []
        dato_solo = False
        if tipo == "crear_job_hacker":
            dato_solo = True
            linkedin = parametro.split("linkedin[[")[1].split("]]")[0].strip()
            nombre = parametro.split("nombre[[")[1].split("]]")[0].strip()
            cargo = parametro.split("cargo[[")[1].split("]]")[0].strip()
            ps2 = load_mongo_client().personas.find()
            esta = 0
            id_personas = -1
            for w in ps2:
                if linkedin.strip() != "":
                    if w["linkedin"].strip().lower() == linkedin.strip().lower():
                        id_persona = w["id"]
                        esta = 1
                        break
                if nombre.strip() != "" and cargo.strip() != "":
                    if w["nombre"].strip().lower() == nombre.strip().lower() and w["ultimo_cargo"].strip().lower() == cargo.strip().lower(): 
                        id_persona = w["id"]
                        esta = 1
                        break
            if esta == 1:
                #update
                linkedin = parametro.split("linkedin[[")[1].split("]]")[0].strip()
                nombre = parametro.split("nombre[[")[1].split("]]")[0].strip()
                cargo = parametro.split("cargo[[")[1].split("]]")[0].strip()
                objeto_salida_u = {
                    "nombre":nombre,
                    "telefono":parametro.split("telefono[[")[1].split("]]")[0].strip(),
                    "mail":parametro.split("mail[[")[1].split("]]")[0].strip(),
                    "linkedin":linkedin,
                    "ultimo_cargo":cargo,
                    "crystal":parametro.split("crystal[[")[1].split("]]")[0].strip(),
                    "ultima_empresa":parametro.split("empresa[[")[1].split("]]")[0].strip(),
                    "fecha":parametro.split("fecha[[")[1].split("]]")[0].strip()
                    }
                load_mongo_client().personas.update_one(
                    {"id":id_persona},
                    {"$set":objeto_salida_u
                    })
                object_update.append({"tipo":"personas","objeto":process_data_json(process_data_persona(json.loads(dumps(load_mongo_client().personas.find({"id":id_persona}))),-1))[0]})
                id_retorno = id_persona
                accion = "update"
            else:
                #insert
                id_persona =  load_mongo_client().personas.find_one(sort=[("id", -1)])["id"]+1
                usuario_id = nombre.split(" ")[0].lower()+"."+nombre.split(" ")[1].lower()
                password = nombre.split(" ")[0].lower()+"."+nombre.split(" ")[1].lower()+"_2020"
                objeto_salida = {
                    "id":id_persona,
                    "nombre":nombre,
                    "telefono":parametro.split("telefono[[")[1].split("]]")[0].strip(),
                    "mail":parametro.split("mail[[")[1].split("]]")[0].strip(),
                    "linkedin":linkedin,
                    "usuario":usuario_id,
                    "password":password,
                    "tipo":1,
                    "job_hacker":"",
                    "estado":"",
                    "aspiracion_min":"",
                    "aspiracion_max":"",
                    "area":"",
                    "etiquetas":[],
                    "ultimo_cargo":cargo,
                    "ultima_empresa":parametro.split("empresa[[")[1].split("]]")[0].strip(),
                    "crystal":parametro.split("crystal[[")[1].split("]]")[0].strip(),
                    "fecha":parametro.split("fecha[[")[1].split("]]")[0].strip()
                    }
                load_mongo_client().personas.insert_one(objeto_salida)
                objeto_salida = process_data_json([objeto_salida])[0]
                id_retorno = id_persona
                accion = "create"
        if tipo == "editar_job_hacker":
            dato_solo = True
            #update
            linkedin = parametro.split("linkedin[[")[1].split("]]")[0].strip()
            nombre = parametro.split("nombre[[")[1].split("]]")[0].strip()
            cargo = parametro.split("cargo[[")[1].split("]]")[0].strip()
            id_persona = int(parametro.split("id[[")[1].split("]]")[0].strip())
            objeto_salida_u = {
                "nombre":nombre,
                "telefono":parametro.split("telefono[[")[1].split("]]")[0].strip(),
                "mail":parametro.split("mail[[")[1].split("]]")[0].strip(),
                "linkedin":linkedin,
                "ultimo_cargo":cargo,
                "crystal":parametro.split("crystal[[")[1].split("]]")[0].strip(),
                "ultima_empresa":parametro.split("empresa[[")[1].split("]]")[0].strip(),
                "fecha":parametro.split("fecha[[")[1].split("]]")[0].strip()
                }
            load_mongo_client().personas.update_one(
                {"id":id_persona},
                {"$set":objeto_salida_u
                })
            id_retorno = id_persona
            object_update.append({"tipo":"personas","objeto":process_data_json(process_data_persona(json.loads(dumps(load_mongo_client().personas.find({"id":id_persona}))),-1))[0]})
            accion = "update"
        if tipo == "crear_usuario":
            dato_solo = True
            nombre = parametro.split("nombre[[")[1].split("]]")[0].strip()
            correo = parametro.split("mail[[")[1].split("]]")[0].strip()
            password = parametro.split("pass[[")[1].split("]]")[0].strip()

            ps2 = load_mongo_client().personas.find()
            esta = 0
            perfil_empresa = parametro.split("perfil_empresa[[")[1].split("]]")[0].strip()
            tipo_perfil = 8
            if perfil_empresa == "true":
                tipo_perfil = 13
            id_personas = -1
            for w in ps2:
                if str(w["mail"]).strip().lower() == correo.strip().lower():
                    id_persona = w["id"]
                    if int(w["tipo"]) != 4:
                        esta = 1
                        break
                    else:
                        esta = 2
                        accion = "create"
                        id_retorno = id_persona
                        objeto_salida = {
                            "id":id_persona,
                            "nombre":nombre,
                            "telefono":"",
                            "mail":correo,
                            "linkedin":parametro.split("linkedin[[")[1].split("]]")[0].strip(),
                            "area":"",
                            "aspiracion_min":"",
                            "aspiracion_max":"",
                            "usuario":correo,
                            "password_tmp":password,
                            "tipo":tipo_perfil,
                            "codigo_pago":"",
                            "ultimo_cargo":"",
                            "ultima_empresa":"",
                            "crystal":"",
                            "job_hacker":"",
                            "ciudad":"",
                            "sector":"",
                            "representaciones":"",
                            "subsector":"",
                            "satisfaccion":"",
                            "estado":"pendiente activacion cuenta",
                            }
                        load_mongo_client().personas.update({"id":int(w["id"])},{"$set":objeto_salida})
                        objeto_salida = process_data_json([objeto_salida])[0]
                        id_retorno = id_persona
                        accion = "create"
                        print("usuario creado... va a enviar mail")

                        envio_correo("registro",id_persona,{"nombre":nombre.split(" ")[0].strip()},correo)
                        crea_usuario(objeto_salida)
            if esta == 1:
                #update
                id_retorno = id_persona
                accion = "repeat"
            elif esta == 0:
                #insert
                id_persona =  load_mongo_client().personas.find_one(sort=[("id", -1)])["id"]+1
                usuario_id = correo
                objeto_salida = {
                    "id":id_persona,
                    "nombre":nombre,
                    "telefono":"",
                    "mail":correo,
                    "linkedin":parametro.split("linkedin[[")[1].split("]]")[0].strip(),
                    "area":"",
                    "aspiracion_min":"",
                    "aspiracion_max":"",
                    "usuario":usuario_id,
                    "password_tmp":password,
                    "tipo":tipo_perfil,
                    "codigo_pago":"",
                    "etiquetas":[],
                    "ultimo_cargo":"",
                    "ultima_empresa":"",
                    "crystal":"",
                    "job_hacker":"",
                    "ciudad":"",
                    "sector":"",
                    "subsector":"",
                    "satisfaccion":"",
                    "estado":"pendiente activacion cuenta",
                    "fecha":parametro.split("fecha[[")[1].split("]]")[0].strip()
                    }
                load_mongo_client().personas.insert_one(objeto_salida)
                objeto_salida = process_data_json([objeto_salida])[0]
                id_retorno = id_persona
                accion = "create"
                print("usuario creado... va a enviar mail")

                envio_correo("registro",id_persona,{"nombre":nombre.split(" ")[0].strip()},correo)
                crea_usuario(objeto_salida)
        if tipo == "editar_usuario":
            dato_solo = True
            #update
            linkedin = parametro.split("linkedin[[")[1].split("]]")[0].strip()
            nombre = parametro.split("nombre[[")[1].split("]]")[0].strip()
            cargo = parametro.split("cargo[[")[1].split("]]")[0].strip()
            id_persona = int(parametro.split("id[[")[1].split("]]")[0].strip())
            objeto_salida_u = {
                "nombre":nombre,
                "telefono":parametro.split("telefono[[")[1].split("]]")[0].strip(),
                "mail":parametro.split("mail[[")[1].split("]]")[0].strip(),
                "linkedin":linkedin,
                "ultimo_cargo":cargo,
                "crystal":parametro.split("crystal[[")[1].split("]]")[0].strip(),
                "ultima_empresa":parametro.split("empresa[[")[1].split("]]")[0].strip(),
                "job_hacker":parametro.split("job_hacker[[")[1].split("]]")[0].strip(),
                "estado":parametro.split("estado[[")[1].split("]]")[0].strip(),
                "aspiracion_min":parametro.split("aspiracion_min[[")[1].split("]]")[0].strip(),
                "aspiracion_max":parametro.split("aspiracion_max[[")[1].split("]]")[0].strip(),
                "area":parametro.split("area[[")[1].split("]]")[0].strip(),
                "fecha":parametro.split("fecha[[")[1].split("]]")[0].strip()
                }
            load_mongo_client().personas.update_one(
                {"id":id_persona},
                {"$set":objeto_salida_u
                })
            id_retorno = id_persona
            object_update.append({"tipo":"personas","objeto":process_data_json(process_data_persona(json.loads(dumps(load_mongo_client().personas.find({"id":id_persona}))),-1))[0]})
            accion = "update"
        if tipo == "crear_contacto":
            linkedin = parametro.split("linkedin[[")[1].split("]]")[0].strip()
            nombre = parametro.split("nombre[[")[1].split("]]")[0].strip()

            cargo = parametro.split("cargo[[")[1].split("]]")[0].strip()
            ps2 = load_mongo_client().personas.find()
            esta = 0
            id_personas = -1
            
            for w in ps2:
                if linkedin.strip() != "":
                    if compare_strings(w["linkedin"],linkedin,"link"):
                        id_persona = w["id"]
                        esta = 1
                        objeto_salida = process_data_json([w])[0]
                        break
                if nombre.strip() != "" and cargo.strip() != "":
                    if compare_strings(w["nombre"],nombre,"name") and compare_strings(w["ultimo_cargo"],cargo,"text"):
                        id_persona = w["id"]
                        esta = 1
                        objeto_salida = process_data_json([w])[0]
                        break
            if esta == 1:
                #update
                if accion_perfil == True:
                    nombre = parametro.split("nombre[[")[1].split("]]")[0].strip()
                    cargo = parametro.split("cargo[[")[1].split("]]")[0].strip()
                    objeto_salida_u = {
                        "nombre":nombre,
                        "ultimo_cargo":cargo,
                        "crystal":parametro.split("crystal[[")[1].split("]]")[0].strip(),
                        "ultima_empresa":parametro.split("empresa[[")[1].split("]]")[0].strip(),
                        "fecha":parametro.split("fecha[[")[1].split("]]")[0].strip()
                        }
                    load_mongo_client().personas.update_one(
                        {"id":id_persona},
                        {"$set":objeto_salida_u
                        })

                    if parametro.split("personalidad[[")[1].split("]]")[0].strip() != "":
                        load_mongo_client().personas.update_one({"id":int(id_persona)},{"$push":{"comentarios" : {"id":id_adm,"observacion":parametro.split("personalidad[[")[1].split("]]")[0].strip()}}})
                    object_update.append({"tipo":"personas","objeto":process_data_json(process_data_persona(json.loads(dumps(load_mongo_client().personas.find({"id":id_persona}))),-1))[0]})
                    id_retorno = id_persona
                    accion = "update"


                else:
                    id_retorno = id_persona
                    accion = "repeat"
            else:
                #insert
                id_persona =  load_mongo_client().personas.find_one(sort=[("id", -1)])["id"]+1
                objeto_salida = {
                    "id":id_persona,
                    "nombre":nombre,
                    "telefono":parametro.split("telefono[[")[1].split("]]")[0].strip(),
                    "mail":parametro.split("mail[[")[1].split("]]")[0].strip(),
                    "linkedin":linkedin,
                    "area":"nan",
                    "aspiracion_min":0,
                    "aspiracion_max":0,
                    "usuario":"",
                    "password":"",
                    "tipo":4,
                    "comentarios":[{"id":id_adm,"observacion":parametro.split("personalidad[[")[1].split("]]")[0].strip()}],
                    "etiquetas":[],
                    "ultimo_cargo":cargo,
                    "ultima_empresa":parametro.split("empresa[[")[1].split("]]")[0].strip(),
                    "crystal":parametro.split("crystal[[")[1].split("]]")[0].strip(),
                    "job_hacker":"",
                    "estado":"nan",
                    "fecha":parametro.split("fecha[[")[1].split("]]")[0].strip()
                    }

                load_mongo_client().personas.insert_one(objeto_salida)
                objeto_salida = process_data_json([objeto_salida])[0]
                id_retorno = id_persona
                accion = "create"
            data_persona["nombre"] = nombre
            data_persona["correo"] = parametro.split("mail[[")[1].split("]]")[0].strip()
            data_persona["verifica"] = parametro.split("verificacion_contacto[[")[1].split("]]")[0].strip()
            data_persona["id_contacto"] = int(id_persona)
            oculto = (parametro.split("oculto[[")[1].split("]]")[0].strip().lower() == "true")
            tmp = {"oculto":oculto,"fecha":param_fecha,"id":etiqueta,"label":"contacto","id_objeto":id_persona,"personalidad":parametro.split("personalidad[[")[1].split("]]")[0].strip(),"nivel":int(parametro.split("nivel[[")[1].split("]]")[0].strip()),"obs":parametro.split("obs[[")[1].split("]]")[0].strip()}
        if tipo == "editar_contacto":
            #update
            linkedin = parametro.split("linkedin[[")[1].split("]]")[0].strip()
            nombre = parametro.split("nombre[[")[1].split("]]")[0].strip()
            cargo = parametro.split("cargo[[")[1].split("]]")[0].strip()
            id_persona = int(parametro.split("id[[")[1].split("]]")[0].strip())
            objeto_salida_u = {
                "nombre":nombre,
                "telefono":parametro.split("telefono[[")[1].split("]]")[0].strip(),
                "mail":parametro.split("mail[[")[1].split("]]")[0].strip(),
                "linkedin":linkedin,
                "ultimo_cargo":cargo,
                "crystal":parametro.split("crystal[[")[1].split("]]")[0].strip(),
                "ultima_empresa":parametro.split("empresa[[")[1].split("]]")[0].strip(),
                "fecha":parametro.split("fecha[[")[1].split("]]")[0].strip()
                }
            load_mongo_client().personas.update_one(
                {"id":id_persona},
                {"$set":objeto_salida_u
                })

            if parametro.split("personalidad[[")[1].split("]]")[0].strip() != "":
                load_mongo_client().personas.update_one({"id":int(id_persona)},{"$push":{"comentarios" : {"id":id_adm,"observacion":parametro.split("personalidad[[")[1].split("]]")[0].strip()}}})
            object_update.append({"tipo":"personas","objeto":process_data_json(process_data_persona(json.loads(dumps(load_mongo_client().personas.find({"id":id_persona}))),-1))[0]})
            id_retorno = id_persona
            accion = "update"
            oculto = (parametro.split("oculto[[")[1].split("]]")[0].strip().lower() == "true")
            tmp = {"oculto":oculto,"fecha":param_fecha,"id":etiqueta,"label":"contacto","id_objeto":id_persona,"personalidad":parametro.split("personalidad[[")[1].split("]]")[0].strip(),"nivel":int(parametro.split("nivel[[")[1].split("]]")[0].strip()),"obs":parametro.split("obs[[")[1].split("]]")[0].strip()}
        if tipo == "crear_oportunidad":
            link = parametro.split("link[[")[1].split("]]")[0].strip()
            if link.strip().lower() == "undefined":
                link = ""
            cargo = parametro.split("cargo[[")[1].split("]]")[0].strip()
            empresa = parametro.split("empresa[[")[1].split("]]")[0].strip()
            cumple_param = False
            if parametro.split("cumple[[")[1].split("]]")[0].strip() == 'true':
                cumple_param = True
            elif parametro.split("cumple[[")[1].split("]]")[0].strip() == 'false':
                cumple_param = False
            else :
                cumple_param = parametro.split("cumple[[")[1].split("]]")[0].strip()
                
            ps2 = load_mongo_client().vacantes.find()
            esta = 0
            id_vacante = -1
            for w in ps2:
                if link.strip() != "":
                    if compare_strings(w["link"],link,"link"):
                        if "oculta" in w:
                            if w["oculta"] == False:
                                id_vacante = w["id"]
                                esta = 1
                                objeto_salida = process_data_json([w])[0]
                                break
                        else:
                            id_vacante = w["id"]
                            esta = 1
                            objeto_salida = process_data_json([w])[0]
                            break
            prot_param = False
            oculta = False
            if esta == 1:
                #update
                id_retorno = id_vacante
                accion = "repeat"
            else:
                #insert
                id_user_opo = id_adm
                if parametro.split("oculta[[")[1].split("]]")[0].strip() == 'true':
                    oculta = True
                try:
                    if parametro.split("protegido[[")[1].split("]]")[0].strip() == 'true':
                        id_user_opo = id_user
                        prot_param = True
                except:
                    print("no es usuario admin")
                id_vacante =  load_mongo_client().vacantes.find_one(sort=[("id", -1)])["id"]+1
                objeto_salida = {
                    "id":id_vacante,
                    "empresa":empresa,
                    "cargo":cargo,
                    "link":link,
                    "ciudad":parametro.split("ciudad[[")[1].split("]]")[0].strip(),
                    "rango_mayor":parametro.split("rango_mayor_oportunidad[[")[1].split("]]")[0].strip(),
                    "rango_menor":parametro.split("rango_menor_oportunidad[[")[1].split("]]")[0].strip(),
                    "tipo":parametro.split("tipo_oportunidad[[")[1].split("]]")[0].strip(),
                    "postulacion":parametro.split("postulacion[[")[1].split("]]")[0].strip(),
                    "recompensa":parametro.split("recompensa[[")[1].split("]]")[0].strip(),
                    "obs":parametro.split("obs[[")[1].split("]]")[0].strip(),
                    "req":parametro.split("req[[")[1].split("]]")[0].strip(),
                    "fecha":parametro.split("fecha[[")[1].split("]]")[0].strip(),
                    "id_user":id_user_opo,
                    "oculta":oculta
                    }
                load_mongo_client().vacantes.insert_one(objeto_salida)
                objeto_salida = process_data_json([objeto_salida])[0]
                id_retorno = id_vacante
                accion = "create"
            data_persona["cargo"] = cargo
            data_persona["empresa"] = empresa
            tmp = {"fecha":param_fecha,"id":etiqueta,"label":"oportunidad","id_objeto":id_vacante,"protegido":prot_param,"cumple":cumple_param} 
        if tipo == "editar_oportunidad":
            #update
            link = parametro.split("link[[")[1].split("]]")[0].strip()
            cargo = parametro.split("cargo[[")[1].split("]]")[0].strip()
            empresa = parametro.split("empresa[[")[1].split("]]")[0].strip()
            id_vacante = int(parametro.split("id[[")[1].split("]]")[0].strip())
            oculta = False
            id_user_opo = id_adm
            prot_param = False
            if parametro.split("oculta[[")[1].split("]]")[0].strip() == 'true':
                oculta = True
            cumple_param = False
            if parametro.split("cumple[[")[1].split("]]")[0].strip() == 'true':
                cumple_param = True
                id_user_opo = id_user
            elif parametro.split("cumple[[")[1].split("]]")[0].strip() == 'false':
                cumple_param = False
            else :
                cumple_param = parametro.split("cumple[[")[1].split("]]")[0].strip()
            try:
                if parametro.split("protegido[[")[1].split("]]")[0].strip() == 'true':
                    prot_param = True
            except:
                print("no es usuario admin")
            objeto_salida_u = {
                "empresa":empresa,
                "cargo":cargo,
                "link":link,
                "ciudad":parametro.split("ciudad[[")[1].split("]]")[0].strip(),
                "rango_mayor":parametro.split("rango_mayor_oportunidad[[")[1].split("]]")[0].strip(),
                "rango_menor":parametro.split("rango_menor_oportunidad[[")[1].split("]]")[0].strip(),
                "tipo":parametro.split("tipo_oportunidad[[")[1].split("]]")[0].strip(),
                "postulacion":parametro.split("postulacion[[")[1].split("]]")[0].strip(),
                "recompensa":parametro.split("recompensa[[")[1].split("]]")[0].strip(),
                "obs":parametro.split("obs[[")[1].split("]]")[0].strip(),
                "req":parametro.split("req[[")[1].split("]]")[0].strip(),
                "fecha":parametro.split("fecha[[")[1].split("]]")[0].strip(),
                "id_user":id_user_opo,
                "oculta":oculta
                }
            load_mongo_client().vacantes.update_one(
                {"id":id_vacante},
                {"$set":objeto_salida_u
                })
            object_update.append({"tipo":"vacantes","objeto":process_data_json([json.loads(dumps(load_mongo_client().vacantes.find_one({"id":id_vacante})))])[0]})
            id_retorno = id_vacante
            accion = "update"
            tmp = {"fecha":param_fecha,"id":etiqueta,"label":"oportunidad","id_objeto":id_vacante,"protegido":prot_param,"cumple":cumple_param} 


        if tipo == "crear_proceso" or tipo == "editar_proceso":
            servicio = parametro.split("servicio[[")[1].split("]]")[0].strip()
            obs = parametro.split("obs[[")[1].split("]]")[0].strip()
            cargo = parametro.split("cargo[[")[1].split("]]")[0].strip()
            cargo_v = parametro.split("cargo[[")[1].split("]]")[0].strip()
            empresa = parametro.split("empresa[[")[1].split("]]")[0].strip()
            empresa_v = parametro.split("empresa[[")[1].split("]]")[0].strip()
            ps2 = load_mongo_client().vacantes.find()
            esta = 0
            objeto_salida = [{},{}]
            id_vacante = -1
            for w in ps2:
                if empresa.strip() != "" and cargo.strip() != "":
                    if compare_strings(w["empresa"],empresa,"name") and compare_strings(w["cargo"],cargo,"text"):
                        id_vacante = w["id"]
                        esta = 1
                        objeto_salida_t = process_data_json([w])[0]
                        break
            if esta == 1:
                print(id_vacante,"id_vacante")
            else:
                #insert
                id_vacante =  load_mongo_client().vacantes.find_one(sort=[("id", -1)])["id"]+1
                objeto_salida_t = {
                    "id":id_vacante,
                    "empresa":empresa,
                    "cargo":cargo,
                    "link":"",
                    "ciudad":"Bogotá",
                    "rango_mayor":0,
                    "rango_menor":0,
                    "tipo":1,
                    "oculta":True,
                    "obs":obs,
                    "fecha":parametro.split("fecha[[")[1].split("]]")[0].strip(),
                    "id_user":id_user
                    }
                load_mongo_client().vacantes.insert_one(objeto_salida_t)
                objeto_salida[0] = objeto_salida_t
                accion = "create"
            linkedin = parametro.split("linkedin[[")[1].split("]]")[0].strip()
            nombre = parametro.split("nombre_contacto[[")[1].split("]]")[0].strip()
            nombre_c = parametro.split("nombre_contacto[[")[1].split("]]")[0].strip()
            cargo = parametro.split("cargo_contacto[[")[1].split("]]")[0].strip()
            cargo_c = parametro.split("cargo_contacto[[")[1].split("]]")[0].strip()
            ps2 = load_mongo_client().personas.find()
            esta = 0
            id_personas = -1
            for w in ps2:
                if linkedin.strip() != "":
                    if compare_strings(w["linkedin"],linkedin,"link"):
                        id_persona = w["id"]
                        esta = 1
                        objeto_salida_t = process_data_json([w])[0]
                        break
                if nombre.strip() != "" and cargo.strip() != "":
                    if compare_strings(w["nombre"],nombre,"name") and compare_strings(w["ultimo_cargo"],cargo,"text"):
                        id_persona = w["id"]
                        esta = 1
                        objeto_salida_t = process_data_json([w])[0]
                        break
            if esta == 1:
                if tipo == "editar_proceso":
                    objeto_salida_u = {
                        "nombre":nombre,
                        "telefono":parametro.split("telefono[[")[1].split("]]")[0].strip(),
                        "mail":parametro.split("mail[[")[1].split("]]")[0].strip(),
                        "linkedin":linkedin,
                        "ultimo_cargo":cargo,
                        "crystal":parametro.split("crystal[[")[1].split("]]")[0].strip(),
                        "ultima_empresa":parametro.split("empresa[[")[1].split("]]")[0].strip(),
                        "fecha":parametro.split("fecha[[")[1].split("]]")[0].strip()
                        }
                    load_mongo_client().personas.update_one(
                        {"id":id_persona},
                        {"$set":objeto_salida_u
                        })

                    object_update.append({"tipo":"personas","objeto":process_data_json(process_data_persona(json.loads(dumps(load_mongo_client().personas.find({"id":id_persona}))),-1))[0]})
                    id_retorno = id_persona
                    accion = "update"
            
            else:
                #insert
                id_persona =  load_mongo_client().personas.find_one(sort=[("id", -1)])["id"]+1
                objeto_salida_t ={
                    "id":id_persona,
                    "nombre":nombre,
                    "telefono":parametro.split("telefono[[")[1].split("]]")[0].strip(),
                    "mail":parametro.split("mail[[")[1].split("]]")[0].strip(),
                    "linkedin":linkedin,
                    "area":"nan",
                    "aspiracion_min":0,
                    "aspiracion_max":0,
                    "usuario":"",
                    "password":"",
                    "tipo":4,
                    "etiquetas":[],
                    "ultimo_cargo":cargo,
                    "ultima_empresa":parametro.split("empresa[[")[1].split("]]")[0].strip(),
                    "crystal":parametro.split("crystal[[")[1].split("]]")[0].strip(),
                    "job_hacker":"",
                    "estado":"nan",
                    "fecha":parametro.split("fecha[[")[1].split("]]")[0].strip()
                    }
                load_mongo_client().personas.insert_one(objeto_salida_t)
                accion = "create"
                objeto_salida[1] = objeto_salida_t
            objeto_salida = process_data_json(objeto_salida)
            tipo_proceso = parametro.split("tipo_proceso[[")[1].split("]]")[0].strip()
            obs = parametro.split("obs[[")[1].split("]]")[0].strip()
            data_persona["cargo_vac"] = cargo_v
            data_persona["empresa_vac"] = empresa_v
            data_persona["nombre_con"] = nombre_c
            data_persona["cargo_con"] = cargo_c
            data_persona["fecha"] = parametro.split("fecha_proceso[[")[1].split("]]")[0].strip()
            tmp = {"servicio":servicio,"fecha":param_fecha,"fecha_proceso":parametro.split("fecha_proceso[[")[1].split("]]")[0].strip(),"id":etiqueta,"label":"proceso","id_objeto":id_vacante,"id_persona":id_persona,"tipo_proceso":tipo_proceso,"obs":obs} 
        if tipo == "crear_observacion" or tipo == "editar_observacion":
            tmp = {"fecha":param_fecha,"id":etiqueta,"label":"observacion","valor":parametro.split("obs[[")[1].split("]]")[0].strip()}
        if tipo == "crear_sesion":
            dato_solo = True
            num_sesion = int(parametro.split("num_sesion[[")[1].split("]]")[0].strip())
            cont_preguntas = parametro.split("preguntas[[")[1].split("]]")[0].strip()
            preguntas = cont_preguntas.split("pregunta_")
            cont_prs = 0
            load_mongo_client().personas.update( {"id":int(id_user)}, { "$pull": { "etiquetas": { "id_sesion": str(num_sesion) } } } )
            load_mongo_client().personas.update( {"id":int(id_user)}, { "$pull": { "etiquetas": { "id_sesion": int(num_sesion) } } } )
            print("borrando las sesiones con id:::::",str(num_sesion))

            for o in preguntas :
                if o.strip() != "":
                    pregunta = o.split(str(cont_prs)+"+++")[1].split("+++")[0].strip()
                    tmp = {"fecha":param_fecha,"id":etiqueta,"label":"sesion","id_sesion":num_sesion,"valor":pregunta}
                    self.crear_actualizar_etiqueta(tmp,id_user,etiqueta,{"id_adm":id_adm})

                    cont_prs = cont_prs+1
            if cont_prs > 0:
                object_update.append({"tipo":"personas","objeto":process_data_json(process_data_persona(json.loads(dumps(load_mongo_client().personas.find({"id":int(id_user)}))),-1))[0]})
        if accion != "repeat" and dato_solo == False:
            print("va a crear una etiqueta!!!...",id_user,etiqueta,data_persona)
            data_persona["id_adm"] = id_adm
            self.crear_actualizar_etiqueta(tmp,id_user,etiqueta,data_persona)
            object_update.append({"tipo":"personas","objeto":process_data_json(process_data_persona(json.loads(dumps(load_mongo_client().personas.find({"id":int(id_user)}))),-1))[0]})
        load_mongo_client().logs.insert_one({"fecha":param_fecha,"parametro":parametro,"accion":accion,"id_retorno":id_retorno,"tipo":tipo,"etiqueta":etiqueta,"id_user":id_user,"id_sesion":id_adm})
        salida_definitiva = {"accion":accion,"id":id_retorno,"object_create":objeto_salida,"object_update":object_update}
        return salida_definitiva
    def conector_crear_actualizar_etiqueta(self,parametro,id_user,etiqueta,id_adm = -3):
        object_salida = {}
        data_persona = {}
        
        label = parametro.split("label[[")[1].split("]]")[0].strip()

        id_objeto = int(parametro.split("id[[")[1].split("]]")[0].strip())
        param_fecha = parametro.split("fecha[[")[1].split("]]")[0].strip()

        if label == "contacto":
            
            object_salida = process_data_json(process_data_persona(json.loads(dumps(load_mongo_client().personas.find({"id":int(id_objeto)}))),-1))[0]
            data_persona["nombre"] = object_salida["nombre"]
            data_persona["correo"] = object_salida["mail"]
            data_persona["verifica"] = parametro.split("verificacion_contacto[[")[1].split("]]")[0].strip()
            data_persona["id_contacto"] = int(id_objeto)
            obj = {"fecha":param_fecha,"id":etiqueta,"label":label,"id_objeto":id_objeto,"nivel":int(parametro.split("nivel[[")[1].split("]]")[0].strip()),"obs":parametro.split("obs[[")[1].split("]]")[0].strip()}
        
        elif label == "oportunidad":
            object_salida = process_data_json(json.loads(dumps(load_mongo_client().vacantes.find({"id":int(id_objeto)}))))[0]
            cumple_param = False
            if parametro.split("cumple[[")[1].split("]]")[0].strip() == 'true':
                cumple_param = True
            elif parametro.split("cumple[[")[1].split("]]")[0].strip() == 'false':
                cumple_param = False
            else:
                cumple_param = parametro.split("cumple[[")[1].split("]]")[0].strip()

            data_persona["cargo"] = object_salida["cargo"]
            data_persona["empresa"] = object_salida["empresa"]
            obj = {"fecha":param_fecha,"id":etiqueta,"label":label,"id_objeto":id_objeto,"protegido":False,"cumple":cumple_param}
        elif label == "proceso":
            obj = {"fecha":param_fecha,"id":etiqueta,"label":label,"id_objeto":id_objeto,"servicio":parametro.split("servicio[[")[1].split("]]")[0].strip()}
        data_persona["id_adm"] = id_adm
        res_etiqueta = self.crear_actualizar_etiqueta(obj,int(id_user),int(etiqueta),data_persona)
        #object_update.append({"tipo":"personas","objeto":process_data_json(process_data_persona(json.loads(dumps(load_mongo_client().personas.find({"id":int(id_user)}))),-1))[0]})
        salida_definitiva = {"id_etiqueta":res_etiqueta,"tipo_etiqueta":label,"accion":"create","id":int(id_user),"object_create":object_salida,"object_update":[]}
        
        return salida_definitiva
        
    def crear_actualizar_servicio(self,id_servicio,id_user,estatus,fecet,label,tserv,data,id_cv):
        print(id_servicio,id_user,estatus,fecet,label,tserv,data,id_cv)
        tipo_servicio = ""
        if label == "oportunidad":
            if tserv == "representacion":
                tipo_servicio = "representacion"
            elif tserv == "analisis":
                tipo_servicio = "analisis_postulacion"
            elif tserv == "contacto":
                tipo_servicio = "contacto"
        elif label == "proceso":
            if tserv == "analisis":
                tipo_servicio = "analisis_comunicacion"
        if tipo_servicio != "":
            fec = fecet.split(" ")[0]
            tim = fecet.split(" ")[1]
            serv =  load_mongo_client().servicios.find_one({"id":id_servicio})
            vac = load_mongo_client().vacantes.find_one({"id":int(data["id_vacante"])})
            print(serv, serv== None)
            salida_persona = ""
            if "id_persona" in data:
                salida_persona = int(data["id_persona"])
            else:
                salida_persona = ""
            data_object = {
                "id_cv":id_cv,
                "id":id_servicio,
                "estatus":estatus,
                "id_usuario":int(id_user),
                "id_vacante":int(data["id_vacante"]),
                "id_contacto":salida_persona,
                "fecha_hora":fecet,
                "fecha":fec,
                "hora":tim,
                "tipo":tipo_servicio,
                "descripcion":""}
            if serv == None:#no esta
                if tipo_servicio == "contacto":#logica temporal para compensar
                    r = {"mensaje":"ok"}
                else:
                    r = descuenta_devuelve_credito(id_user,True)
                print(r,"pto2")
                if r["mensaje"] == "ok":
                    load_mongo_client().servicios.insert_one(data_object)
                    print(r,"pto3")
                    carga_servicio(data_object)
                    print(r,"pto4")
                else:
                    return r["mensaje"]
                
            else:#edita el servicio
                load_mongo_client().servicios.update_one({"id":id_servicio},{"$set":data_object})
                #carga_servicio(data_object)
            
            return {"mensaje":"servicio_ok"}
        else:
            return {"mensaje":"error_servicio"}
            
    def crear_actualizar_etiqueta(self,tmp,id_user,etiqueta,data={"id_adm":-4}):

        
        accion = ""
        id_retorno = ""
        etiqueta = int(etiqueta)   
        print(id_user,etiqueta,".....CREAR ACTUALIZAR ETIQUETA....")
        tmp_per = load_mongo_client().personas.find_one({"id":int(id_user)})


        if "id_objeto" in tmp and etiqueta <= 0 and "tipo_proceso" not in tmp:
            for i in tmp_per["etiquetas"]:
                if i["label"] == tmp["label"] and i["id_objeto"] == tmp["id_objeto"]:
                    etiqueta = int(i["id"])
                    break
        if etiqueta == 0:
            print("ENTRO ACÁ")

            max_id = 0
            
            for i in tmp_per["etiquetas"]:
                if int(i["id"]) > max_id :
                    max_id = int(i["id"])
            max_id = max_id+1
            tmp["id"] = max_id
            load_mongo_client().personas.update({"id":int(id_user)},{"$push":{"etiquetas" : tmp}})
            accion = "insert"
            id_retorno = max_id 
            print(tmp)
            if tmp["label"] == "oportunidad" and ("empresa" in str(tmp["cumple"]) or "contacto" in str(tmp["cumple"])):

                datas = {"id":str(id_user)+"."+str(tmp["id"])+"_5","id_usuario":id_user,"id_vacante":tmp["id_objeto"],"id_contacto":"","id_cv":"","fecha":tmp["fecha"],"hora":"","tipo":tmp["cumple"],"estatus":"abierto"}
                print("entro",datas)
                carga_servicio(datas)
            if tmp["label"] == "proceso" and "analisis" in tmp["servicio"]:
                id_servicio = str(id_user)+"."+str(id_retorno)+"_3"
                today = (datetime.now()+ timedelta(hours=-5))
                today_f = today.strftime("%Y-%m-%d")
                today_t = today_f+" "+today.strftime("%H:%M:%S")
                datas = {"id_vacante":tmp["id_objeto"],"id_persona":tmp["id_persona"]}
                crear_actualizar_servicio(id_servicio,id_user,"abierto",today_t,"proceso","analisis",datas,"")
            if tmp["label"] == "contacto" and data != None and tmp["nivel"] > 1 and data["verifica"] == "true":
                data["nombrec"] = tmp_per["nombre"]  
                data["comentario"]  = tmp["obs"]     
                envio_correo("contacto",id_user,data,data["correo"])
        if etiqueta > 0:
            print("ENTRO POR ESTE OTRO LADO")
            
            cumple = ""
            max_id = 0
            usa_nuevo_credito = True
            for u in tmp_per["etiquetas"]:
                
                if u["id"] == int(etiqueta):
                    break
                max_id = max_id +1
            tmp["id"] = int(etiqueta)
            print("ID_MAXIMO!!!...",max_id)
            load_mongo_client().personas.update({"id":int(id_user)},{"$set":{"etiquetas."+str(max_id) : tmp}})
            accion = "update"
            id_retorno = tmp["id"]
            if tmp["label"] == "proceso" and "analisis" in tmp["servicio"]:
                id_servicio = str(id_user)+"."+str(id_retorno)+"_3"
                today = (datetime.now()+ timedelta(hours=-5))
                today_f = today.strftime("%Y-%m-%d")
                today_t = today_f+" "+today.strftime("%H:%M:%S")
                datas = {"id_vacante":tmp["id_objeto"],"id_persona":tmp["id_persona"]}
                crear_actualizar_servicio(id_servicio,id_user,"abierto",today_t,"proceso","analisis",datas,"")
                
        
        load_mongo_client().logs.insert_one({"parametro":tmp,"accion":accion,"id_retorno":id_retorno,"tipo":"etiqueta","etiqueta":etiqueta,"id_user":id_user,"id_sesion":data["id_adm"]})
        return id_retorno
class delete(object):
    def load_mongo_client():
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
    def eliminar_comentario(self,id,id_et,id_com,id_user):
        
        load_mongo_client().personas.update({"id":int(id_user),"etiquetas.id":int(id_et)},{"$pull":{"etiquetas.$.comentarios" : {"id":int(id_com)}}})
        load_mongo_client().logs.insert_one({"parametro":{},"accion":"delete","id_retorno":id_et,"tipo":"comentario","etiqueta":id_et,"comentario":id_com,"id_user":id_user,"id_sesion":id_user})
        ret = load_mongo_client().personas.find_one({"id":int(id)})
        for o in ret["etiquetas"]:
            if int(o["id"]) == int(id_et):
                if "comentarios" in o:
                    return json.loads(dumps(list(o["comentarios"])))
                else:
                    return []

    def eliminar_etiqueta(self,id_user,id_etiqueta):
        
        load_mongo_client().personas.update({"id":int(id_user)},{"$pull":{"etiquetas" : {"id":int(id_etiqueta)}}})
        self.eliminar_servicio(int(id_user),int(id_etiqueta))
        load_mongo_client().logs.insert_one({"parametro":{},"accion":"delete","id_retorno":id_etiqueta,"tipo":"etiqueta","etiqueta":id_etiqueta,"id_user":id_user,"id_sesion":id_user})
        
        #elimina_vacante(id_user,id_etiqueta)

        object_update = [{"tipo":"personas","objeto":process_data_json([json.loads(dumps(load_mongo_client().personas.find_one({"id":int(id_user)})))])[0]}]        
        return {"accion":"delete","id":int(id_etiqueta),"object_create":{},"object_update":object_update}
    def eliminar_servicio(self,id_user,id_etiqueta,id_servicio =""):
        creditosdev = 0
        servsasoc = 0
        print("va a eliminar",id_servicio)
        if id_servicio == "":
            id_servicio = str(id_user)+"."+str(id_etiqueta)+"_1"
            s = load_mongo_client().servicios.find_one({"id":id_servicio})
            if s != None:
                servsasoc = servsasoc+1
                id_user = s["id_usuario"]
                estatus = s["estatus"]
                load_mongo_client().servicios.update_one({"id":id_servicio},{"$set":{"estatus":"eliminado","id":str(id_servicio)+"_E"}})
                if estatus == "abierto":
                    creditosdev = creditosdev+1
                    r = descuenta_devuelve_credito(id_user,False)
                    elimina_servicio(id_servicio,id_user,str(id_servicio)+"_E")
            
            id_servicio = str(id_user)+"."+str(id_etiqueta)+"_2"
            s = load_mongo_client().servicios.find_one({"id":id_servicio})
            if s != None:
                servsasoc = servsasoc+1
                id_user = s["id_usuario"]
                estatus = s["estatus"]
                load_mongo_client().servicios.update_one({"id":id_servicio},{"$set":{"estatus":"eliminado","id":str(id_servicio)+"_E"}})
                if estatus == "abierto":
                    creditosdev = creditosdev+1
                    r = descuenta_devuelve_credito(id_user,False)
                    elimina_servicio(id_servicio,id_user,str(id_servicio)+"_E")
            id_servicio = str(id_user)+"."+str(id_etiqueta)+"_3"
            s = load_mongo_client().servicios.find_one({"id":id_servicio})
            if s != None:
                servsasoc = servsasoc+1
                id_user = s["id_usuario"]
                estatus = s["estatus"]
                load_mongo_client().servicios.update_one({"id":id_servicio},{"$set":{"estatus":"eliminado","id":str(id_servicio)+"_E"}})
                if estatus == "abierto":
                    creditosdev = creditosdev+1
                    r = descuenta_devuelve_credito(id_user,False)
                    elimina_servicio(id_servicio,id_user,str(id_servicio)+"_E")
            
            id_servicio = str(id_user)+"."+str(id_etiqueta)+"_4"
            s = load_mongo_client().servicios.find_one({"id":id_servicio})
            if s != None:
                servsasoc = servsasoc+1
                id_user = s["id_usuario"]
                estatus = s["estatus"]
                load_mongo_client().servicios.update_one({"id":id_servicio},{"$set":{"estatus":"eliminado","id":str(id_servicio)+"_E"}})
                if estatus == "abierto":
                    creditosdev = creditosdev+1
                    r = descuenta_devuelve_credito(id_user,False)
                    elimina_servicio(id_servicio,id_user,str(id_servicio)+"_E")
        else:
            s = load_mongo_client().servicios.find_one({"id":id_servicio})
            print("va a eliminar este obj",s)
            if s != None:
                servsasoc = servsasoc+1
                id_user = s["id_usuario"]
                estatus = s["estatus"]
                load_mongo_client().servicios.update_one({"id":id_servicio},{"$set":{"estatus":"eliminado","id":str(id_servicio)+"_E"}})
                if estatus == "abierto":
                    creditosdev = creditosdev+1
                    r = descuenta_devuelve_credito(id_user,False)
                    elimina_servicio(id_servicio,id_user,str(id_servicio)+"_E")
        if servsasoc > 0:
            mensaje = "ok"
        else:
            mensaje = "sin servicios"
        return {"servicios":servsasoc,"retornados":creditosdev,"mensaje":mensaje}

def read_servicios(id_sesion):
    import gc
    gc.collect()
    rcm = read()
    try:
        obj = rcm.read_servicios(id_sesion)
        json_data = {"return":obj}
    except:
        print("error lectura servicios")
        json_data = {"return":"error"}
    return json_data

def read_personas(id_sesion):
    import gc
    print("read_personas_tm220:", datetime.now().strftime("%H:%M:%S"))
    gc.collect()
    rcm = read()
    obj = rcm.read_personas(id_sesion)
    print("read_personas_tm224:", datetime.now().strftime("%H:%M:%S"))
    json_data = {"return":obj}
    print("read_personas_tm226:", datetime.now().strftime("%H:%M:%S"))
    return json_data

def get_persona(id):
    import gc
    gc.collect()
    rcm = read()
    obj = rcm.get_persona(id)
    json_data = json.dumps({"return":obj}, sort_keys=False, ensure_ascii=False) 
    return json_data
def get_vacante(id):
    import gc
    gc.collect()
    rcm = read()
    obj = rcm.get_vacante(id)
    json_data = json.dumps({"return":obj}, sort_keys=False, ensure_ascii=False) 
    return json_data
def read_ciudades():
    import gc
    print("read_ciudades_tm220:", datetime.now().strftime("%H:%M:%S"))
    gc.collect()
    rcm = read()
    obj = rcm.read_ciudades()
    print("read_ciudades_tm224:", datetime.now().strftime("%H:%M:%S"))
    json_data = json.dumps({"return":obj}, sort_keys=False, ensure_ascii=False) 
    print("read_ciudades_tm226:", datetime.now().strftime("%H:%M:%S"))
    return json_data
def read_vacantes(id_sesion):
    import gc
    gc.collect()
    rcm = read()
    obj = rcm.read_vacantes(id_sesion)
    json_data = {"return":obj}
    return json_data


def guarda_datos_perfil(id,params):
    import gc
    gc.collect()
    rcm = create_update()
    obj = rcm.guarda_datos_perfil(id,params);
    json_data = json.dumps({"return":obj}, sort_keys=False, ensure_ascii=False) 
    return json_data


def crear_comentario(fecha,texto,id,id_et,id_adm):
    import gc
    gc.collect()
    rcm = create_update()
    obj = rcm.crear_comentario(fecha,texto,id,id_et,id_adm);
    json_data = json.dumps({"return":obj}, sort_keys=False, ensure_ascii=False) 
    return json_data
def eliminar_comentario(id,id_et,id_com,id_adm):
    import gc
    gc.collect()
    rcm = delete()
    obj = rcm.eliminar_comentario(id,id_et,id_com,id_adm)
    json_data = json.dumps({"return":obj}, sort_keys=False, ensure_ascii=False) 
    return json_data
def actualizacion_info_vacante(id_con,id_user,id_et,resp,id_com,tipo):
    import gc
    gc.collect()
    rcm = create_update()
    print("por aca ok")
    obj = rcm.actualizacion_info_vacante(id_con,id_user,id_et,resp,id_com,tipo);
    json_data = json.dumps({"return":obj}, sort_keys=False, ensure_ascii=False) 
    return json_data
def crear_actualizar_objeto_perfil(parametro,tipo,etiqueta,id_user,id_adm):
    import gc
    gc.collect()
    print("entrando a linkedin_profile")
    obj_lin = get_linkedin_profile(parametro.split("linkedin[[")[1].split("]]")[0].strip())
    print("linkedin_extraido")
    retorno_cr = get_crystal_profile(obj_lin["pnombre"],obj_lin["snombre"],obj_lin["desc"],obj_lin["expe"])
    print("crystal_extraido")
    salida_def = {"nombre":obj_lin["nombre"],"cargo":obj_lin["cargo"],"empresa":obj_lin["empresa"],"crystal":retorno_cr["cr"]}
    

    parametro2  = parametro + "nombre[["+obj_lin["nombre"]+"]]oculto[["+parametro.split("oculto[[")[1].split("]]")[0].strip()+"]]verifica[[]]verificacion_contacto[["+parametro.split("verificacion_contacto[[")[1].split("]]")[0].strip()+"]]cargo[["+obj_lin["cargo"]+"]]empresa[["+obj_lin["empresa"]+"]]crystal[["+retorno_cr["cr"]+"]]"
    print("salio de linkedin_profile",parametro2)
    rcm = create_update()
    obj = rcm.crear_actualizar_objeto(parametro2,tipo,etiqueta,id_user,id_adm)
    json_data = json.dumps({"return":obj}, sort_keys=False, ensure_ascii=False) 
    return json_data
def crear_actualizar_objeto(parametro,tipo,etiqueta,id_user,id_adm):
    import gc
    gc.collect()
    rcm = create_update()
    obj = rcm.crear_actualizar_objeto(parametro,tipo,etiqueta,id_user,id_adm)
    json_data = json.dumps({"return":obj}, sort_keys=False, ensure_ascii=False) 
    return json_data
def eliminar_etiqueta(id_user,id_etiqueta):
    import gc
    gc.collect()
    rcm = delete()
    obj = rcm.eliminar_etiqueta(id_user,id_etiqueta)
    json_data = json.dumps({"return":obj}, sort_keys=False, ensure_ascii=False) 
    return json_data
def eliminar_servicio(id_user,id_etiqueta,id_servicio = ""):
    import gc
    gc.collect()
    rcm = delete()
    print(id_servicio)
    obj = rcm.eliminar_servicio(id_user,id_etiqueta,id_servicio)
    json_data = json.dumps({"return":obj}, sort_keys=False, ensure_ascii=False) 
    return json_data
def crear_actualizar_servicio(id_servicio,id_user,estatus,fecet,label,serv,data,id_cv = ""):
    import gc
    gc.collect()
    rcm = create_update()
    obj = rcm.crear_actualizar_servicio(id_servicio,id_user,estatus,fecet,label,serv,data,id_cv)
    json_data = json.dumps({"return":obj}, sort_keys=False, ensure_ascii=False) 
    return json_data
def conector_crear_actualizar_etiqueta(tmp,id_user,etiqueta,id_adm = -3):
    import gc
    gc.collect()
    rcm = create_update()
    obj = rcm.conector_crear_actualizar_etiqueta(tmp,id_user,etiqueta,id_adm)
    json_data = json.dumps({"return":obj}, sort_keys=False, ensure_ascii=False) 
    return json_data
def registro_logs(id):
    import gc
    gc.collect()
    rcm = create_update()
    obj = rcm.registro_logs(id)
    json_data = json.dumps({"return":obj}, sort_keys=False, ensure_ascii=False) 
    return json_data

