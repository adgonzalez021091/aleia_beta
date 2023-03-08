
from EPE.business import logic
import json
import requests
from datetime import *
integration_on = False
boards = {
    "Postulaciones Aleia":"2227711067",
    "Inscritos Aleia":"2304389509",
    "Vacantes Aleia":"2433932792",
    "Preguntas":"3574302574"
}
def registro_usuario(obj):
    if integration_on is False:
        return ""
    o = {
    "id":str(obj["id"]),
    "nombre":obj["nombre"],
    "mail":obj["mail"],
    "fecha":obj["fecha"]
    
    }
    if "telefono" in obj:
        o["telefono"] = obj["telefono"]
    else:
        o["telefono"] = ""
    if "ultimo_cargo" in obj:
        o["ultimo_cargo"] = obj["ultimo_cargo"]
    else:
        o["ultimo_cargo"] = ""
    if "convenio" in obj:
        o["acuerdo"] = obj["convenio"]
    else:
        o["acuerdo"] = ""
    if "convenio" in obj:
        o["acuerdo"] = obj["convenio"]
    else:
        o["acuerdo"] = ""
    if "cargos_aspira" in obj:
        o["cargos_aspira"] = obj["cargos_aspira"]
    else:
        o["cargos_aspira"] = ""
    if "aspiracion_max" in obj:
        o["aspiracion_max"] = obj["aspiracion_max"]
    else:
        o["aspiracion_max"] = ""
    if "numero_identificacion" in obj:
        o["numero_identificacion"] = obj["numero_identificacion"]
    else:
        o["numero_identificacion"] = ""
    if "nivel_ingles" in obj:
        o["nivel_ingles"] = obj["nivel_ingles"]
    else:
        o["nivel_ingles"] = ""
    if "nivel_estudio" in obj:
        o["nivel_estudio"] = obj["nivel_estudio"]
    else:
        o["nivel_estudio"] = ""
    if "contenido_cv" in obj:
        o["contenido_hv"] = obj["contenido_cv"]
    else:
        o["contenido_hv"] = ""
    if "id_cv" in obj:
        o["id_cv"] = obj["id_cv"]
        o["link_hv"] = {"url" : "https://drive.google.com/file/d/"+str(obj["id_cv"]) , "text" : "https://drive.google.com/file/d/"+str(obj["id_cv"])}
        
    else:
        o["id_cv"] = ""
        o["link_hv"] = ""
    if "ciudad" in obj:
        o["ciudad"] = obj["ciudad"]
    else:
        o["ciudad"] = ""
    if "ultima_empresa" in obj:
        o["ultima_empresa"] = obj["ultima_empresa"]
    else:
        o["ultima_empresa"] = ""
    if "sector" in obj:
        o["sector"] = obj["sector"]
    else:
        o["sector"] = ""
    if "ultima_empresa" in obj:
        o["ultima_empresa"] = obj["ultima_empresa"]
    else:
        o["sector"] = ""
    if "relocaliza" in obj:
        o["relocaliza"] = ', '.join([str(elem) for elem in obj["relocaliza"]])
    else:
        o["relocaliza"] = ""
    if "pass" in obj:
        o["pass"] = obj["pass"]
    else:
        o["pass"] = ""
    if "aspiracion_min" in obj:
        o["aspiracion_min"] = obj["aspiracion_min"]
    else:
        o["aspiracion_min"] = ""
    if "aspiracion_max_rango" in obj:
        o["aspiracion_max_rango"] = obj["aspiracion_max_rango"]
    else:
        o["aspiracion_max_rango"] = ""
    if "carrera" in obj:
        o["carrera"] = obj["carrera"]
    else:
        o["carrera"] = ""
    o["mond_ac"] = "No acepto"
    if o["acuerdo"] == "si":
        o["mond_ac"] = "Estoy de acuerdo y acepto los términos y condiciones"
    
    mapeo={
        "id2":"id"
        ,"texto5":"telefono"
        ,"texto7":"mail"
        ,"n_meros":"aspiracion_max"
        ,"salario_actual":"aspiracion_min"
        ,"enlace":"link_hv"
        ,"texto0":"contenido_hv"
        ,"dup__of_documento":"nivel_ingles"
        ,"dup__of_nivel_ingles":"nivel_estudio"
        #,"dup__of_aspiraci_n_salarial":"aspiracion_max_rango"
        ,"texto9":"sector"
        ,"dup__of_nivel_ingles5":"carrera"
        ,"texto14":"ultima_empresa"
        ,"texto8":"ultimo_cargo"
        ,"relocaliza4":"relocaliza"
        ,"date":"fecha"
        ,"texto13":"ciudad"
        ,"texto54":"numero_identificacion"
        ,"dup__of_dup__of_texto_hoja_de_vida":"cargos_aspira"
        ,"label":"mond_ac"
        ,"texto11":"pass"
        }

    ret = envio_monday(o,mapeo,"Inscritos Aleia","nombre")
    retorno = "error"

    if "error_code" not in ret:
        retorno = "ok"
        
        logic.load_mongo_client().personas.update_one({"id":int(obj["id"])},{"$set":{"id_monday":ret["data"]["create_item"]["id"]}})
    
    return retorno
def registro_pregunta(obj):
    if integration_on is False:
        return ""
    vac = logic.load_mongo_client().vacantes.find_one({"id":obj["id_vacante"]})
    per = logic.load_mongo_client().personas.find_one({"id":vac["id_user"]})
    obj["id_vacante"] = str(obj["id_vacante"])
    obj["id"] = str(obj["id"])
    obj["cargo"] = vac["cargo"]
    obj["nombre"] = per["nombre"]
    obj["mail"] = per["mail"]
    mapeo={
        "date":"fecha_pregunta"
        ,"texto_largo":"pregunta"
        ,"texto2":"cargo"
        ,"texto0":"id_vacante"
        ,"texto6":"nombre"
        ,"texto":"mail"
        ,"texto3":"id"
        }
    ret = envio_monday(obj,mapeo,"Preguntas","nombre")
    retorno = "error"

    if "error_code" not in ret:
        retorno = "ok"
        print(obj,ret)
        logic.load_mongo_client().preguntas.update_one({"id":int(obj["id"])},{"$set":{"id_monday":ret["data"]["create_item"]["id"]}})
    
    return retorno
def registro_vacante(obj):
    if integration_on is False:
        return ""
    tipo = {"remoto":"Remoto","presencial":"Presencial","semipresencial":"Mixto", "":"NA"}
    o = {
    "nombre": str(obj["id"])+". "+ str(obj["empresa"])+"-"+obj["cargo"],
    "cargo":obj["cargo"],
    "empresa":obj["empresa"],
    "ciudad":obj["ciudad"],
    "obs":obj["obs"],
    "tipo":tipo[obj["tipo"]],
    "telefono_contacto":obj["telefono_contacto"],
    "nombre_contacto":obj["nombre_contacto"],
    "correo_contacto":obj["correo_contacto"],
    "req1":"",
    "req2":"",
    "req3":"",
    "req4":"",
    "servicio":obj["servicio"],
    "req5":"",
    "req6":"",
    "req7":"",
    "fecha":obj["fecha"],
    "link":{"url" : "https://portal.aleia.app/?id_vacante="+str(obj["id"]) , "text" : "https://portal.aleia.app/?id_vacante="+str(obj["id"])}
    
    }
    for (i,r) in enumerate(obj["lista_reqs"]):
        o["req"+str(i+1)] = r
    if "cargos_relacionados" in obj:
        o["cargos_relacionados"] = ','.join([str(elem) for elem in obj["cargos_relacionados"]])
    else:
        o["cargos_relacionados"] = ""
    
    if "lista_industrias" in obj:
        o["industrias"] = ','.join([str(elem) for elem in obj["lista_industrias"]])
    else:
        o["industrias"] = ""
    for ca in obj["lista_cats"]:
        o["obs"] = o["obs"]+ca["tit"]+" : "+ca["des"]+"\n"
    if "rango_menor" in obj and "rango_mayor in obj":
        o["salario"] = str(obj["rango_menor"])+"-"+str(obj["rango_mayor"])
    elif "rango_mayor" in obj :
        o["salario"] = str(obj["rango_mayor"])
    else:
        o["salario"] = "a convenir"
    

    mapeo={
        "texto":"cargo"
        ,"texto3":"empresa"
        ,"cargos_relacionados":"cargos_relacionados"
        ,"salario_mensual":"salario"
        ,"estado9":"ciudad"
        ,"dup__of_ciudad_en_categor_a":"tipo"
        ,"industrias":"industrias"
        ,"texto96":"req1"
        ,"dup__of_1__requerimiento":"req2"
        ,"dup__of_2__requerimiento":"req3"
        ,"dup__of_3__requerimiento":"req4"
        ,"dup__of_4__requerimiento":"req5"
        ,"dup__of_5__requerimiento":"req6"
        ,"dup__of_6__requerimiento":"req7"
        ,"texto5":"obs"
        ,"estado":"servicio"
        ,"enlace":"link"
        ,"texto7":"nombre_contacto"
        ,"celular":"telefono_contacto"
        ,"texto10":"correo_contacto"
        ,"fecha6":"fecha"
        }
    ret = envio_monday(o,mapeo,"Vacantes Aleia","nombre")
    retorno = "error"

    if "error_code" not in ret:
        retorno = "ok"
        print(o,ret)
        logic.load_mongo_client().vacantes.update_one({"id":int(obj["id"])},{"$set":{"id_monday":ret["data"]["create_item"]["id"]}})
    
    return retorno

def registro_postulacion(obj):
    if integration_on is False:
        return ""

    print(obj)
    obj_vac = logic.load_mongo_client().vacantes.find_one({"id":int(obj["id_vac"])})
    obj_emp = logic.load_mongo_client().personas.find_one({"id":int(obj_vac["id_user"])})
    mail_emp = ""
    if obj_emp is not None and "mail" in obj_emp:
        mail_emp = obj_emp["mail"]
    vac_ag = ""
    if "gratuito" in obj_vac["servicio"]:
        vac_ag = "Gratuito (Agentes)"
    if "pago" in obj_vac["servicio"]:
        vac_ag = "Pago (Reclutamiento)"
    if "no" in obj_vac["servicio"]:
        vac_ag = "Gratuito"
    o={
    "id_postulacion":obj["id"],
    "mail_empresa":mail_emp,
    "nombre":obj["nombre"],
    "telefono":obj["telefono"],
    "mail":obj["mail"],
    "aspiracion_max":str(obj["aspiracion_max"]),
    "aspiracion_min":obj["aspiracion_min"],
    "link_hv":{"url":"https://drive.google.com/file/d/"+obj["id_cv"],"text":"https://drive.google.com/file/d/"+obj["id_cv"]},
    "contenido_hv":obj["contenido_cv"],
    "id_vacante":obj["id_vac"],
    "cargo_vacante":obj_vac["cargo"],
    "empresa_vacante":obj_vac["empresa"],
    "tiene_convenio":obj["convenio"],
    "vacante_agentes":vac_ag,
    "fecha_envio":obj["fecha"],
    "req1":"",
    "cum1":"",
    "mot1":"",
    "req2":"",
    "cum2":"",
    "mot2":"",
    "req3":"",
    "cum3":"",
    "mot3":"",
    "req4":"",
    "cum4":"",
    "mot4":"",
    "req5":"",
    "cum5":"",
    "mot5":"",
    "req6":"",
    "cum6":"",
    "mot6":"",
    "req7":"",
    "cum7":"",
    "mot7":"",
    "nombre_referido":obj["nombre_referido"]
    }
    if "mail_referido" in obj:
        o["mail_referido"] = obj["mail_referido"]
    else:
        o["mail_referido"] = ""
    if "telefono_referido" in obj:
        o["telefono_referido"] = obj["telefono_referido"]
    else:
        o["telefono_referido"] = ""
    for (i,r) in enumerate(obj["reqs"]):
        o["req"+str(i+1)] = r["req"]
        if r["cumple"]:
            o["cum"+str(i+1)] = "Cumple"
        else:
            o["cum"+str(i+1)] = "No cumple"
        o["mot"+str(i+1)] = r["motivo"]
        
    mapeo={
        "texto":"id_postulacion"
        ,"texto817":"mail_empresa"
        ,"texto5":"telefono"
        ,"texto7":"mail"
        ,"texto1":"aspiracion_max"
        ,"texto6":"aspiracion_min"
        ,"enlace":"link_hv"
        ,"texto0":"contenido_hv"
        ,"texto9":"id_vacante"
        ,"texto14":"cargo_vacante"
        ,"texto3":"empresa_vacante"
        #,"estado_1":"tiene_convenio"
        ,"estado_17":"vacante_agentes"
        ,"date":"fecha_envio"
        ,"texto51":"nombre_referido"
        ,"dup__of_persona_que_referencia":"mail_referido"
        ,"dup__of_correo_persona_referencia":"telefono_referido"
        ,"texto81":"req1"
        ,"estado_12":"cum1"
        ,"texto38":"mot1"
        ,"texto2":"req2"
        ,"estado_16":"cum2"
        ,"texto18":"mot2"
        ,"texto4":"req3"
        ,"estado_15":"cum3"
        ,"texto76":"mot3"
        ,"texto26":"req4"
        ,"estado_159":"cum4"
        ,"texto88":"mot4"
        ,"texto55":"req5"
        ,"dup__of_4__cumple_requerimiento":"cum5"
        ,"texto47":"mot5"
        ,"texto17":"req6"
        ,"dup__of_5__cumple_requerimiento":"cum6"
        ,"texto141":"mot6"
        ,"texto54":"req7"
        ,"dup__of_6__cumple_requerimiento":"cum7"
        ,"texto470":"mot7"
        }
    ret = envio_monday(o,mapeo,"Postulaciones Aleia","nombre")
    retorno = "error"

    if "error_code" not in ret:
        retorno = "ok"
        print(o,ret)
        logic.load_mongo_client().postulaciones.update_one({"id":obj["id"]},{"$set":{"id_monday":ret["data"]["create_item"]["id"]}})
    
    return retorno
def envio_monday(o,mapeo,board,name):
    if integration_on is False:
        return ""
    parametros = {}
    for i in mapeo:
        parametros[i] = o[mapeo[i]]
    
    apiKey = "eyJhbGciOiJIUzI1NiJ9.eyJ0aWQiOjEyNDkzNzMyNiwidWlkIjoyNDY4MjEwOSwiaWFkIjoiMjAyMS0wOS0xNlQxNjowNjo0OS4wMDBaIiwicGVyIjoibWU6d3JpdGUiLCJhY3RpZCI6OTkyNDQwMywicmduIjoidXNlMSJ9.0lOSSKdAVTmEvzWxl1ag19AWhzjNeZgA_ucbC7iQvSE"
    apiUrl = "https://api.monday.com/v2"
    headers = {"Authorization" : apiKey}
    print("params a enviar a monday....",parametros)
    query5 = 'mutation ($myItemName: String!, $columnVals: JSON!) { create_item (board_id:'+boards[board]+', item_name:$myItemName, column_values:$columnVals) { id } }'
    vars = {
    'myItemName' : o[name],
    'columnVals' : json.dumps(parametros)
    }

    data = {'query' : query5, 'variables' : vars}
    r = requests.post(url=apiUrl, json=data, headers=headers) # make request
    print("RESPUESTA DE MONDAY....",r.json())
    return r.json()
def get_item_data(id,ret):
    if integration_on is False:
        return ""
    query = "query{items(ids:["+str(id)+"]){id name column_values{id type value text}}}"
    apiKey = "eyJhbGciOiJIUzI1NiJ9.eyJ0aWQiOjEyNDkzNzMyNiwidWlkIjoyNDY4MjEwOSwiaWFkIjoiMjAyMS0wOS0xNlQxNjowNjo0OS4wMDBaIiwicGVyIjoibWU6d3JpdGUiLCJhY3RpZCI6OTkyNDQwMywicmduIjoidXNlMSJ9.0lOSSKdAVTmEvzWxl1ag19AWhzjNeZgA_ucbC7iQvSE"
    apiUrl = "https://api.monday.com/v2"
    headers = {"Authorization" : apiKey}
    data = {'query' : query}
    r = requests.post(url=apiUrl, json=data, headers=headers) # make request
    print("RESPUESTA DE MONDAY QUERY....",r.json())
    for o in r.json()["data"]["items"][0]["column_values"]:
        if o["id"] ==ret:
            return o["value"]
            