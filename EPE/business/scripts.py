from EPE.business.integracion_sheets import *
#from EPE.business.integracion_monday import *
from EPE.business.logic import *

def test_textract():
    lista = load_mongo_client().cvs.find({"$or": [{ "contenido": { "$exists": False }},{ "contenido": {  "$eq": ''  }}]})
    count = 1
    #jd = process_file(vac)
    for o in lista:
        status = 'ok'
        extraer_contenido_archivo(o["id_file"])
        count = count + 1
        print("extrayendo data archivos",count)


def REPROCESAR_usuarios():
    c = load_mongo_client().personas.find()
    count = 1
    for o in c:
        
        load_mongo_client().personas.update_one({"id":o["id"]},{"$set":{"usuario":o["usuario"].lower().strip()}})
        print("repro",count)
        count=count+1
def REPROCESAR_identify_agentes():
    c = load_mongo_client().vacantes.find()
    count = 1
    for o in c:
        if "agente" in o["empresa"].lower():
            load_mongo_client().vacantes.update_one({"id":o["id"]},{"$set":{"servicio":"gratuito","postulacion":True,"confidencial":"servicio"}})
        elif "reclutamiento" in o["empresa"].lower():
            load_mongo_client().vacantes.update_one({"id":o["id"]},{"$set":{"servicio":"pago","postulacion":True,"confidencial":"servicio"}})
        elif "servicio" not in o or o["servicio"] == "no":
            load_mongo_client().vacantes.update_one({"id":o["id"]},{"$set":{"servicio":"no","postulacion":False}}) 
        count = count + 1
        print("identificando agentes",count)
def REPROCESA_reqs():
    c = load_mongo_client().vacantes.find()
    count = 1
    for s2 in c:
        if "req" in s2:
            tmp_list = []
            tmp_req = s2["req"].split(",")
            for tmp_o in tmp_req:
                if tmp_o.strip() != "":
                    tmp_list.append(tmp_o)
            
        else:
            tmp_list = []
        load_mongo_client().vacantes.update_one({"id":s2["id"]},{"$set":{"lista_reqs":tmp_list}}) 
        count = count + 1
        print("arreglando reqs",count)
def REPROCESA_login():
    c = load_mongo_client().personas.find()
    for o in c:
        load_mongo_client().personas.update_one({"id":o["id"]},{"$set":{"usuario":o["usuario"].lower().strip()}})
def REPROCESA_aceptacion_tipo5():
    c = load_mongo_client().personas.update_many({"tipo":5},{"$set":{"convenio_busco":"si"}})
def PENDIENTE_SCRIPT_MIGRAR_USUARIOS_ALEIA_EN_MONDAY():
    return ""
def REPROCESA_EXTRACCION_SALARIOS():
    options_sueldo = [
        {"name":"$ 1.000.000 a $ 2.000.000","valm":1,"valt":2},
        {"name":"$ 2.000.000 a $ 3.000.000","valm":2,"valt":3},
        {"name":"$ 3.000.000 a $ 4.000.000","valm":3,"valt":4},
        {"name":"$ 4.000.000 a $ 5.000.000","valm":4,"valt":5},
        {"name":"$ 5.000.000 a $ 6.000.000","valm":5,"valt":6},
        {"name":"$ 6.000.000 a $ 8.000.000","valm":6,"valt":8},
        {"name":"$ 8.000.000 a $ 10.000.000","valm":8,"valt":10},
        {"name":"$ 10.000.000 a $ 12.000.000","valm":10,"valt":12},
        {"name":"$ 12.000.000 a $ 15.000.000","valm":12,"valt":15},
        {"name":"$ 15.000.000 a $ 20.000.000","valm":15,"valt":20},
        {"name":"$ 20.000.000 a $ 25.000.000","valm":20,"valt":25},
        {"name":"$ 25.000.000 a $ 30.000.000","valm":25,"valt":30},
        {"name":"$ 30.000.000 a $ 35.000.000","valm":30,"valt":35},
        {"name":"$ 35.000.000 a $ 45.000.000","valm":35,"valt":45},
        {"name":"$ 45.000.000 a $ 60.000.000","valm":45,"valt":60},
        {"name":"Más de $60.000.000","valm":60,"valt":1000}
    ]
    c = load_mongo_client().vacantes.find()
    
    for o in c:
        print("ok")
        sal = ""
        if "rango_mayor" in o and  str(o["rango_mayor"]) != "":
            temp_string = str(o["rango_mayor"])
    
        elif "rango_menor" in o  and  str(o["rango_menor"]) != "":
            temp_string = str(o["rango_menor"])
        sal= ""
        nums = []
        indx = 0
        nuevo = True
        if temp_string == "0":
            sal = ""
        elif "integral" in str(temp_string).lower():
            sal = 10000000
        else:
            for o2 in temp_string:
                #print(o,indx)
                if o2.isdigit():
                    if len(nums) == 0 or nuevo:
                        nums.append(str(o2))
                        nuevo = False
                        
                    else:
                        #print(nums,indx)
                        nums[indx] = nums[indx] + str(o2)
                elif (o2.isalpha() or o2 == "-" or o2 == "a") and nuevo == False:
                    nuevo = True
                    indx = indx+1
                    
            #numbers = [int(temp)for temp in temp_string if temp.isalpha()]
            if len(nums) > 0:
                if len(nums[0]) > 2:
                    if len(nums[0]) > 8:
                        sal = int(nums[0][0:8])
                    else:
                        sal = int(nums[0])
                else:
                    sal =int(nums[0])*1000000
                    
        if sal != "":
            for n in options_sueldo:
                if sal/1000000 >= n["valm"] and sal/1000000 < n["valt"]:
                    sal = n["name"]
                    c = load_mongo_client().vacantes.update_one({"id":int(o["id"])},{"$set":{"rango_mayor":[sal]}})
                    break
        else:
            c = load_mongo_client().vacantes.update_one({"id":int(o["id"])},{"$set":{"rango_mayor":[]}})
    c = load_mongo_client().personas.find()
    for o in c:
        print("ok2")
        sal = ""
        if "aspiracion_max" in o and  str(o["aspiracion_max"]) != "":
            temp_string = str(o["aspiracion_max"])
        elif "aspiracion_min" in o  and  str(o["aspiracion_min"]) != "":
            temp_string = str(o["aspiracion_min"])
        sal= ""
        nums = []
        indx = 0
        nuevo = True
        if temp_string == "0":
            sal = ""
        elif "integral" in str(temp_string).lower():
            sal = 10000000
        else:
            for o2 in temp_string:
                #print(o,indx)
                if o2.isdigit():
                    if len(nums) == 0 or nuevo:
                        nums.append(str(o2))
                        nuevo = False
                        
                    else:
                        #print(nums,indx)
                        nums[indx] = nums[indx] + str(o2)
                elif (o2.isalpha() or o2 == "-" or o2 == "a") and nuevo == False:
                    nuevo = True
                    indx = indx+1
                    
            #numbers = [int(temp)for temp in temp_string if temp.isalpha()]
            if len(nums) > 0:
                if len(nums[0]) > 2:
                    if len(nums[0]) > 8:
                        sal = int(nums[0][0:8])
                    else:
                        sal = int(nums[0])
                else:
                    sal =int(nums[0])*1000000
                    
        if sal != "":
            for n in options_sueldo:
                if sal/1000000 >= n["valm"] and sal/1000000 < n["valt"]:
                    sal = n["name"]
                    c = load_mongo_client().vacantes.update_one({"id":int(o["id"])},{"$set":{"aspiracion_max":[sal]}})
                    break
        else:
            c = load_mongo_client().vacantes.update_one({"id":int(o["id"])},{"$set":{"aspiracion_max":[]}})
def REPROCESA_CVS_OK():
    c = load_mongo_client().personas.find()
    for o in c:
        if "id_last_cv" in o:
            cv = logic.load_mongo_client().cvs.find_one({"id_file":o["id_last_cv"]})
            if cv is None:
                load_mongo_client().personas.update_one({"id":o["id"]},{"$unset":{"id_last_cv":""}})
                print("ok3")
        if "numero_identificacion" not in o:
            load_mongo_client().personas.update_one({"id":o["id"]},{"$set":{"numero_identificacion":""}})
            print("ok4")
        if "convenio_busco" not in o:
            load_mongo_client().personas.update_one({"id":o["id"]},{"$set":{"convenio_busco":""}})
            print("ok5")
def arreglo_juli():
    c = load_mongo_client().vacantes.find_one({"id":12604})
    c["telefono_contacto"] = ""
    c["nombre_contacto"] = ""
    c["correo_contacto"] = ""
    c["cargos_relacionados"] = c["cargos_relacionado"]
    registro_vacante(c)
def consulta_compensar():
    import urllib.parse
    username = urllib.parse.quote_plus('aleja_user')
    password = urllib.parse.quote_plus('02-10-91aldigovE')
    mongo_client = MongoClient('mongodb://%s:%s@3.137.57.40' % (username, password))
    db = mongo_client.aleja_bd

    res = db.logs.find({"accion":"login"})
    import datetime
    datref = datetime.datetime(2022,9,30)
    #datref = datetime.datetime(2020,9,30)
    print("empezando...")
    lista_ids = []
    lista_vals = {}
    for p in res:
        tmp = p["fecha"].split("-")
        dat = datetime.datetime(int(tmp[0]), int(tmp[1]), int(tmp[2])) 
        #print(p["fecha"],dat)
        usr = db.personas.find_one({"id":p["id_user"]})
        if dat > datref and usr["tipo"] == 6:
            if usr["id"] not in lista_ids:
                lista_ids.append(usr["id"])
                lista_vals[usr["id"]] ={"nombre": usr["nombre"],"id":usr["id"],"ultimo_login":p["fecha"],"mail":usr["mail"],"telefono":usr["telefono"],"estado":usr["estado"],"fecha":usr["fecha"]}
                #b = lista_vals[usr["id"]]
                #print(b["nombre"],";",b["id"],";",b["ultimo_login"],";",b["mail"],";",b["telefono"],";",b["estado"],";",b["fecha"])
            else:
                lista_vals[usr["id"]]["ultimo_login"] = p["fecha"]
    for o in lista_vals:
        b = lista_vals[o]
        print(b["nombre"],";",b["id"],";",b["ultimo_login"],";",b["mail"],";",b["telefono"],";",b["estado"],";",b["fecha"])
    print("acabóo....")
def ejecucion_branch_v1():
    #test_textract()
    #REPROCESA_reqs()
    #REPROCESAR_usuarios()
    #arreglo_juli()
    consulta_compensar()
    #REPROCESA_login
    
    #REPROCESA_aceptacion_tipo5()
    #REPROCESA_EXTRACCION_SALARIOS()
    #REPROCESA_CVS_OK()
    #PENDIENTE_SCRIPT_MIGRAR_USUARIOS_ALEIA_EN_MONDAY()



