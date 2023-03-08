from pymongo import MongoClient
import pymongo
import json
from bson.json_util import dumps
import copy
from bson.raw_bson import RawBSONDocument
import math
import datetime
#import unidecode
#from linkedin_api import Linkedin
import requests 
import re
from EPE.business.integracion_sheets import *

from fuzzywuzzy import fuzz
stop_words_regex = r"(\bvacante\b|\bde\b|\bun\b|\buna\b|\bunas\b|\bunos\b|\buno\b|\bsobre\b|\btodo\b|\btambién\b|\btras\b|\botro\b|\balgún\b|\balguno\b|\balguna\b|\balgunos\b|\balgunas\b|\bser\b|\bes\b|\bsoy\b|\beres\b|\bsomos\b|\bsois\b|\bestoy\b|\besta\b|\bestamos\b|\bestais\b|\bestan\b|\bcomo\b|\ben\b|\bpara\b|\batras\b|\bporque\b|\bpor qué\b|\bestado\b|\bestaba\b|\bante\b|\bantes\b|\bsiendo\b|\bambos\b|\bpero\b|\bpor\b|\bpoder\b|\bpuede\b|\bpuedo\b|\bpodemos\b|\bpodeis\b|\bpueden\b|\bfui\b|\bfue\b|\bfuimos\b|\bfueron\b|\bhacer\b|\bhago\b|\bhace\b|\bhacemos\b|\bhaceis\b|\bhacen\b|\bcada\b|\bfin\b|\bincluso\b|\bprimero\b|\bdesde\b|\bconseguir\b|\bconsigo\b|\bconsigue\b|\bconsigues\b|\bconseguimos\b|\bconsiguen\b|\bir\b|\bvoy\b|\bva\b|\bvamos\b|\bvais\b|\bvan\b|\bvaya\b|\bgueno\b|\bha\b|\btener\b|\btengo\b|\btiene\b|\btenemos\b|\bteneis\b|\btienen\b|\bel\b|\bla\b|\blo\b|\blas\b|\blos\b|\bsu\b|\baqui\b|\bmio\b|\btuyo\b|\bellos\b|\bellas\b|\bnos\b|\bnosotros\b|\bvosotros\b|\bvosotras\b|\bsi\b|\bdentro\b|\bsolo\b|\bsolamente\b|\bsaber\b|\bsabes\b|\bsabe\b|\bsabemos\b|\bsabeis\b|\bsaben\b|\bultimo\b|\blargo\b|\bbastante\b|\bhaces\b|\bmuchos\b|\baquellos\b|\baquellas\b|\bsus\b|\bentonces\b|\btiempo\b|\bverdad\b|\bverdadero\b|\bverdadera\b|\bcierto\b|\bciertos\b|\bcierta\b|\bciertas\b|\bintentar\b|\bintento\b|\bintenta\b|\bintentas\b|\bintentamos\b|\bintentais\b|\bintentan\b|\bdos\b|\bbajo\b|\barriba\b|\bencima\b|\busar\b|\buso\b|\busas\b|\busa\b|\busamos\b|\busais\b|\busan\b|\bemplear\b|\bempleo\b|\bempleas\b|\bemplean\b|\bampleamos\b|\bempleais\b|\bvalor\b|\bmuy\b|\bera\b|\beras\b|\beramos\b|\beran\b|\bmodo\b|\bbien\b|\bcual\b|\bcuando\b|\bdonde\b|\bmientras\b|\bquien\b|\bcon\b|\bentre\b|\bsin\b|\btrabajo\b|\btrabajar\b|\btrabajas\b|\btrabaja\b|\btrabajamos\b|\btrabajais\b|\btrabajan\b|\bpodria\b|\bpodrias\b|\bpodriamos\b|\bpodrian\b|\bpodriais\b|\byo\b|\baquel\b)"
stop_text_link = r"(https:|http:|www.|\/$|\/\/)"
crystal_styles ={
1:{'code':'Dc','name':'Architect','color':1,'advise':'-Es un rojo asi que  el tiende a dirigir a otros y monitorear de cerca su avance, si tienes experiencias haciendo esto ponlas sobre la mesa ya que vas a generar una empatía a nivel profesional. Cuéntale alguna experiencia monitoreando equipos y obteniendo resultados positivos por medio de esto.<br> -Cuestiona practicas ineficientes y no dudes en criticar un producto que no te parezca bueno.<br> -Es de comunicación rápida así que llega al punto ágilmente y se conciso. Puedes llegar a perder su atención si divagas o contextualizas mucho así que si te hace una pregunta responde específicamente lo que preguntó.<br> - Es muy orientado a resultados así que háblale de que puedes mejorar en su empresa o de qué forma puedes catapultar sus objetivos. <br> <br> Recuerda muy bien que debes leer su dolor, que es lo que necesita para estar buscando un cargo, más allá de los requerimientos que tengan en la persona es que dolor tienen en la empresa para estar buscando a alguien con tu perfil y pon sobre la mesa alternativas para aliviar ese dolor, el lo va a tomar muy positivamente ya que su comunicación abierta nos permite ser propositivos.'},
2:{'code':'D','name':'Captain','color':1,'advise':'-Es un rojo asi que se directo y lógico al comunicarte <br> - Demuestra seguridad y rapidez en tu comunicación. <br> - Identifica experiencias que resalten los resultados finales siendo concreto. <br> - Si ves alguna oportunidad debate y refuta sus argumentos, él va a tomar ese reto positivamente.- Habla de una situación de adaptación al cambio y de trabajo rápido.'},
3:{'code':'Di','name':'Driver','color':1,'advise':'-Es un rojo asi que tiende a ser muy directo en tu comunicación<br> - Evita estar callado, toma la iniciativa y habla apasionadamente de tus ideas.<br> - Habla en términos de un objetivo que tuviste y de forma muy rápida como lograste el resultado.<br> - Proyecta mucha confianza y asertividad.'},
4:{'code':'DI','name':'Initiator','color':1,'advise':'-Es un rojo asi que debes mostrar tu personalidad y hablar con coraje. <br>- Es una persona que le gusta asumir riesgos, dice lo que piensa y lo motivan las oportunidades de hacer algo nuevo y excitante. Con el tenemos que hablar en términos de expectativa y podemos plantear un escenario futuro deslumbrante para captar su atención.<br>- Si le hablas en terminos de metas ambiciosas seguramente vamos a generar empatía pero procura ser muy directo acorde al entrenamiento para el contacto con head hunters<br> Te recomiendo enviarle un correo comentándole alguna anécdota pequeña de tu trabajo y proyectando ese mismo trabajo a futuro en algo deslumbrante.'},

5:{'code':'Is','name':'Encourager','color':2,'advise':'-Es un amarillo asi que tiende a ser social, cálida y extrovertida con gente nueva. <br> - Prefiere la conversación informal a la discusión formal. <br> - Ella es habladora, amigable y apreciará que bajes la guardia así que háblale de algo personal o algo que te cueste. <br> - Usa un lenguaje expresivo para igualar su entusiasmo natural usando expresiones como maravilloso o increíble.<br> - Háblale sobre ideas abstractas en un tono informal, usa humor autocritico.'},
6:{'code':'SI','name':'Harmonizer','color':2,'advise':'-Es un amarillo asi que es una persona que podríamos llegar a considerar fresca así que relájate bastante hablando con ella<br> - Procura conectar profundamente con otros, la motiva el reconocimiento verbal positivo y crear armonía así que cuéntale algo personal tuyo y reconoce su labor. <br> - Responde muy bien al optimismo<br> - Dale tiempo para hablar, procura no interrumpirla a menos de que vayas a validar algo que ella diga'},
7:{'code':'Id','name':'Influencer','color':2,'advise':'-Es un amarillo asi que  tiende a confiar en la gente, es muy creativo.<br> - Responde positivamente si cambias de tema en la conversación para mantenerla dinámica. <br> - Es bastante visual y le motiva el trabajo en equipo y las relaciones sociales.<br> - Cuéntale historias personales, ellos van a responder muy positivamente'},
8:{'code':'I','name':'Motivator','color':2,'advise':'-Es un amarillo asi que es una persona con grandes habilidades comunicativas muy abierta, procura ser muy abierta en tu comunicación, da contexto, cuéntale algo tuyo personal.<br> - Puede ser un poco dispersa así que si pierde el foco no te molestes, piérdelo con ella y retoma el tema principal. <br> - Busca ser colaborativa y para una comunicación efectiva con ella puedes usar humor auto-crítico y usar descripciones coloridas de lo que hables<br> - Le interesa el reconocimiento de pares y la energía social así que háblale dentro de lo posible bien de su trabajo y reconócele su labor<br> <br> Te recomiendo que le envíes un correo comentándole con mucha energía que cumples con el perfil y que viste su perfil de LinkedIn y te llama la atención ser parte del equipo.'},

9:{'code':'C','name':'Analyst','color':3,'advise':'- Es un azul asi que es una persona muy lógica y un poco cerrada en su comunicación, no va a responder positivamente si le hablas en términos más personales ya que va a sentir que pierdes el foco. <br>- Debes ser de comunicación muy clara y efectiva explicando cuál es tu objetivo y por qué, no responde bien a la exageración. <br>- No le gusta la ineficiencia y el desperdicio de recursos o tiempo, así que intenta pensar en alguna experiencia que hayas tenido donde optimizaras algún proceso con una estrategia bien definida y especifica.'},
10:{'code':'Cs','name':'Editor','color':3,'advise':'Es un azul así que se fija mucho en los detalles y las formulas previamente verificadas - Debes mantenerte bastante serio y evitar el sarcasmo, ser muy objetivo y hacerle varias preguntas para mantener su atención, - Te recomiendo contactarlo y comentarle que siempre has tenido buenos resultados, abriendo un espacio para que indague sobre tu experiencia, algo como ¿Crees que mi perfil se puede adaptar a lo que necesitan? - Enfócate en 2 o 3 indicadores que hayas logrado mejorar en tu experiencia y menciónalos de forma abierta, sin mucho detalle, dejando espacio para que quiera averiguar más.'},
11:{'code':'Cd','name':'Skeptic','color':3,'advise':'- Es un azul asi que es una persona escéptica y se basa mucho en datos previos, debes soportar cada afirmación que hagas con datos o evidencia<br> - Enfatiza en tu nivel de experiencia y estudios.<br> - Piensa en alguna experiencia donde hayas aplicando conocimiento muy específico para construir o ejecutar algún proceso exitoso.<br> - Cuando los contactes coméntale claramente para que lo contactas y que esperas.'},
12:{'code':'CD','name':'Questioner','color':3,'advise':'- Es un azul asi que es de estructuras un poco rígidas<br> - Debes ser muy directo en tu comunicación sin dar mucho contexto.<br> - Cuenta alguna experiencia en donde haya implicado una planeación estratégica que acabara en un resultado exitoso'},

13:{'code':'Si','name':'Counselor','color':4,'advise':'- Es un verde asi que habla con amabilidad y dulzura, ella va a responder muy positivamente a este lenguaje<br> - Coméntale que te gusta trabajar en grupo.<br> - Ella es muy perceptiva respecto a las emociones de los demás.<br> - Reconoce su labor y apréciala, ella procura esto en las personas.<br> - Si tienes el espacio indaga sobre su vida personal.'},
14:{'code':'Sc','name':'Planner','color':4,'advise':'- Es un verde asi que el responde bastante bien a la estabilidad y la consistencia, coméntale que buscas eso<br> - Aprecia bastante la formalidad<br> - Haz feedback de su atención y de su labor, mientras sea constructivo lo va a recibir bastante bien<br> - Guía la conversación con preguntas'},
15:{'code':'SC','name':'Stabilizer','color':4,'advise':'- Es un verde asi que es una persona un poco rígida, muy metódico y de estructuras fijas. <br> - Cuando te comuniques con el enfatiza en resultados que hayas tenido en el pasado como indicadores cumplidos o metas alcanzadas<br> - Guía la conversación con preguntas y toma el liderazgo ya que probablemente será de pocas palabras<br> - Pregúntale por las habilidades que requieren'},
16:{'code':'S','name':'Supporter','color':4,'advise':'- Es un verde asi que con él hay que ser cálidos y hacer varias preguntas<br> - No le gusta llamar la atención y le gusta escuchar, valora mucho la lealtad con la compañía y valora también la confianza a largo plazo. Háblale de esto. <br> - Debes proyectar respeto, nunca lo interrumpas, siempre espera a que acabe su idea para decir la tuya .<br> - Te recomiendo preguntarle por los retos que están llevando en la empresa, por sus preocupaciones, enfatiza en tu experiencia y en tus títulos y cuando hablen de algún producto enfócate en la estabilidad y seguridad del mismo.'},
17:{'code':'NaN','name':'NaN','color':5,'advise':'Recuerda que debes generar un contacto asertivo, si es por correo que sea muy corto y que le deje claro la forma en que le puedes facilitar la vida'}
}
permisos_usuario_micros = [4,8,9]
permisos_usuario_seguimiento = [5,6,11]
permisos_usuario_admin = [0,1,2,9]
ciudades_tmp = []
paises_tmp = []
sectores_tmp = []
cargos_tmp = []
import smtplib
from string import Template
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

import re
import string

MY_ADDRESS = 'a.gonzalez@seligo.co'
PASSWORD = 'bmhykrsyohhfzhzw'
#from langdetect import detect
#from rake_nltk import Rake
def normalize_text(txt):
    return re.sub("[\u0300-\u036f]","", re.sub(r"\n+",'',re.sub(' +', ' ',re.sub(stop_words_regex,'',txt.lower().translate(str.maketrans('', '', string.punctuation)))))).strip()
def validaciones(par,txt):
    if par == "largo_frase":
        x = txt.split(" ")
        if len(x) < 7:
            return True
    if par == "terminos":
        terminos = ["experiencia","sector","industria","a cargo","encargado","años","equipo","maestria","master","postgrado","especializacion","especialista"]
        for o in terminos:
            if o in unidecode(txt.lower()):
                return True
    
    if par == "dato":
        for o in ciudades_tmp:
            if o.lower().strip() in txt.lower():
                return True
        for o in paises_tmp:
            if o.lower().strip() in txt.lower():
                return True
        for o in sectores_tmp:
            if o.lower().strip() in txt.lower():
                return True
        for o in cargos_tmp:
            if o.lower().strip() in txt.lower():
                return True


def rake_evaluator(txt):
    if len(txt) > 50 and len(txt.split(" ")) > 10:
        
        lan = detect(txt)
        langs = {"es":"spanish","en":"english","pt":"portuguese"}
        
        if lan in langs:
            r = Rake(language=langs[lan]) # Uses stopwords for english from NLTK, and all puntuation characters.
        else:
            r = Rake() # Uses stopwords for english from NLTK, and all puntuation characters.
        r.extract_keywords_from_text(txt)
        pre_calificado = []
        pre = r.get_ranked_phrases() 
        for o in pre:
            if validaciones("terminos",o):
                pre_calificado.append({"keyword":o,"score":5})
            elif validaciones("dato",o):
                pre_calificado.append({"keyword":o,"score":3})
            elif validaciones("largo_frase",o):
                pre_calificado.append({"keyword":o,"score":1})
            else:
                pre_calificado.append({"keyword":o,"score":0})
        return pre_calificado
    else:
        return []
import textract
def test_textract_comp():
    #SEGUNDO DESARROLLO EXTRACCIÓN DATOS CON CVS
    rel_per_vac = []
    rel_per_pro = []
    now = datetime.datetime.now()
    param_fecha = now.strftime("%Y-%m-%d")
    lista = load_mongo_client().personas.find()
    for o in lista:
        id_c ="no_tiene"
        if "id_last_cv" in o:
            id_c = o["id_last_cv"]
        for e in o["etiquetas"]:
            if "id_objeto" in e:
                id_d = str(o["id"])+"."+str(e["id_objeto"]) 
                vac = load_mongo_client().vacantes.find_one({"id":int(e["id_objeto"])})
                if vac != None:
                    req = ""
                    if "req" in vac and vac["req"] != "":
                        req = vac["req"]
                    res = req+" "+vac["obs"]
                    if res.strip() == "" and len(res.strip().split(" ")) > 10:
                        res = "no_tiene"
                if e["label"] == "oportunidad":
                    if id_d not in rel_per_vac:

                        dataj = {
                            "id_data":id_d,
                            "fecha":param_fecha,
                            "fecha_reg":e["fecha"],
                            "id_usuario":o["id"],
                            "id_vacante":e["id_objeto"],
                            "nombre":o["nombre"],
                            "correo":o["mail"],
                            "cargo":o["ultimo_cargo"],
                            "empresa":o["ultima_empresa"],
                            "pasa_entrevista":0,
                            "cv":id_c,
                            "info_vac":res
                            }
                        load_mongo_client().data_previa.insert_one(dataj)
                        rel_per_vac.append(id_d)
                        print("tam_vacsv2",len(rel_per_vac))
                if e["label"] == "proceso":
                    
                    if load_mongo_client().data_previa.find_one({"id_data":id_d}) != None:
                        load_mongo_client().data_previa.update_one({"id_data":id_d},{"$set":{"pasa_entrevista":1}})
                    elif id_d not in rel_per_pro:
                        rel_per_pro.append(id_d)
                        print("tam_procsv2",len(rel_per_pro))
    procesos_sin_vacante = []
    for o in rel_per_pro:
        if o in rel_per_vac:
            load_mongo_client().data_previa.update_one({"id_data":o},{"$set":{"pasa_entrevista":1}})
        else: 
            load_mongo_client().procesos_sin_vacante.insert_one({"id_data":o,"id_usuario":o.split(".")[0],"id_vacante":o.split(".")[1]})
          
    
    """PRIMER DESARROLLO PRUEBA LECTURA
    lista = load_mongo_client().cvs.find()
    for o in lista:
        obj = get_file(o["id_file"])
        with open(os.path.join("/home/ec2-user/temp_downloads/",obj["name"]), 'wb') as f:
        #for data in file_size_request.iter_content(block_size):         
            f.write(obj["file"])     
            f.close()
        
        print("archivo cargados en el servidor")
        
        text = textract.process(os.path.join("/home/ec2-user/temp_downloads/",obj["name"]),method="pdfminer").decode("utf-8", "strict")  
        os.remove(os.path.join("/home/ec2-user/temp_downloads/",obj["name"]))
        print("ok.....",text[0:20])
    """
def request_pass(mail):

    obj = load_mongo_client().personas.find_one({"usuario":str(mail.strip())})
    if "password" not in obj:
        if "password_tmp" in obj:
            return {"return":"inactivo"}
        return {"return":"error"}
    envio_correo("password",obj["password"],{"nombre":obj["nombre"].split(" ")[0].strip()},mail)
    return {"return":"ok"}
def envio_respuesta_verificacion(id,idt,nivel):
    max_id = 0
    tmp_per = load_mongo_client().personas.find_one({"id":int(id)})
    tmp = {}
    encontrado = False
    for u in tmp_per["etiquetas"]:
        if u["label"] == "contacto" and int(u["id_objeto"]) == int(idt):
            encontrado = True
            tmp = u
            tmp["verificado"] = True
            tmp["nivel_verificado"] = int(nivel)
            break
        max_id = max_id +1
    if encontrado == True:
        load_mongo_client().personas.update({"id":int(id)},{"$set":{"etiquetas."+str(max_id) : tmp}})
    tmp_per2 = load_mongo_client().personas.find_one({"id":int(idt)})

    if tmp_per2 != None:
        encontrado = False
        max_id = 0

        for u in tmp_per2["etiquetas"]:
            if u["label"] == "contacto" and int(u["id_objeto"]) == int(id):
                encontrado = True
                tmp = u
                tmp["verificado"] = True
                tmp["nivel_verificado"] = int(nivel)
                break
            max_id = max_id +1
        if encontrado == True:
            load_mongo_client().personas.update({"id":int(idt)},{"$set":{"etiquetas."+str(max_id) : tmp}})
        else:
            max_id = 0
            
            for i in tmp_per2["etiquetas"]:
                if int(i["id"]) > max_id :
                    max_id = int(i["id"])
            
            tmp = {
            "fecha":str(datetime.datetime.now().strftime("%Y-%m-%d")),
            "id":max_id +1,
            "label":"contacto",
            "verificado" :True,
            "nivel_verificado":int(nivel),
            "id_objeto":int(id),
            "nivel":int(nivel),
            "obs":"Creado por verificación de usuario"
            }
            load_mongo_client().personas.update({"id":int(idt)},{"$push":{"etiquetas" : tmp}})
def descuenta_devuelve_credito(id_user,descuenta):
    t = load_mongo_client().personas.find_one({"id":int(id_user)})
    r = 0
    nw_r = 0
    if "representaciones" in t:
        r = int(t["representaciones"])
        print(r)
        if descuenta == True:
            if r != 0:
                nw_r = r-1
                
            else:
                return {"mensaje":"no_tiene"}
        else:
            nw_r = r+1

        load_mongo_client().personas.update_one({"id":int(id_user)},{"$set":{"representaciones":nw_r}})
        actualiza_representaciones(id_user,nw_r)
        

        return {"mensaje":"ok"}
    else:
        return {"mensaje":"campo_vacio"}

def get_last_id_cv(id):
    
    return load_mongo_client().personas.find_one({"id":int(id)})["id_last_cv"]
    
def activacion_usuario(id):
    #try:
    pass_tmp = load_mongo_client().personas.find_one({"id":int(id)})["password_tmp"]
    load_mongo_client().personas.update_one({"id":int(id)},{"$set":{"password":pass_tmp,"estado":"activo"}})
    activacion_usuario_sheet(int(id),"activo",pass_tmp)
    return {"retorno":"ok"}
    #except:
    #    return {"retorno":"error"}
def envio_correo(plantilla,id_user,data,destinatario):
    s = smtplib.SMTP('smtp.gmail.com', 587)
    s.ehlo()
    s.starttls()
    s.login(MY_ADDRESS, PASSWORD)
    msg = MIMEMultipart()       # create a message
    msg['From']="Equipo de Aleja <"+MY_ADDRESS+">"
    msg['To']=destinatario
    print(id_user,data,destinatario)
    if plantilla == "alerta_usuario_compensar":
        msg['Subject']=""+data["nombre"].split(" ")[0]+", pregunta lo que quieras sobre tu búsqueda de empleo a un experto GRATIS."
        html = """\
        <html>
        <head></head>
        <body>
        <div style="font-family: verdana;width: 80%;color: #525252;">
        <p>Hola """+data["nombre"].split(" ")[0]+"""!<br><br>
        Espero te encuentres muy bien. 
        <br><br>
        Queremos recordarte que gracias al programa <b>Empleabilidad estratégica Compensar</b>, no solo tienes acceso a las capacitaciones en búsqueda de empleo con Leonardo Modera, experto en empleabilidad y COO de Séligo, sino que también tienes acceso a la plataforma <b>Aleja</b> donde podrás gestionar tu búsqueda de empleo y encontrar vacantes de todos los portales de empleo.
        <br><br>
        <p style="color:#611f61">A final de mes estamos haciendo una reunión con Leonardo Modera, exclusiva para las personas que usen activamente Aleja, en la cual resolverá todas tus dudas sobre tu búsqueda de empleo y te enseñará formas para hacer networking efectivo y llegar a ese cargo con el que sueñas.
        </p><br><br>
        Ingresa a <a href="aleia.app/login">aleia.app</a> con los siguientes datos de acceso, y en la parte inferior izquierda encontrarás la opción "Manual Aleja", donde podrás ver todas las herramientas que tendrás en la plataforma para acelerar tu búsqueda de empleo. 
        <br><br>
        Usuario: """+data["usuario"]+"""
        <br>
        Contraseña: """+data["pass"]+"""
        <br><br>
        Esperamos verte pronto en Aleja y que puedas conseguir el empleo que sueñas, y si tienes alguna duda sobre el contenido de este correo no dudes en escribirnos.
        <br><br>
        Álvaro González
        <br>
        CTO / co-founder de Séligo
        </p>
        </div>
        </body>
        </html>
        """
    if plantilla == "representacion_solicitada":
        msg['Subject']="Recibimos tu solicitúd de representación"
        html = """\
        <html>
        <head></head>
        <body>
        <div style="font-family: verdana;width: 80%;color: #525252;">
        <p>Hola """+data["nombre"]+"""!<br><br>
        Qué bueno que ya tengas la vacante a la que quieres ser representado, te queremos confirmar que su registro fue exitoso. Tu Job Hacker asignado se llama Laura y ya empezará a identificar a los tomadores de decisión para poderte representar.
        <br><br>
        Recuerda que debes enviar tu hoja de vida a.gonzalez@seligo.co con el asunto representación / tu nombre.  Si ya lo hiciste has caso omiso.
        <br><br>
        
        Atentamente.
        <br>
        Equipo de representación de Séligo
        </p>
        </div>
        </body>
        </html>
        """
    if plantilla == "contacto_vacante_sin_info":
        msg['Subject']="¡No hemos encontrado información para tu vacante en "+data["empresa"]+"!"
        html = """\
        <html>
        <head></head>
        <body>
        <div style="font-family: verdana;width: 80%;color: #525252;">
        <p>Hola """+data["nombre"]+"""!<br><br>
        Espero te encuentres muy bien. 
        <br><br>
        """+data["mensaje"]+"""
        <br><br>
        Álvaro González
        <br>
        CTO / co-founder de Séligo
        </p>
        </div>
        </body>
        </html>
        """
    if plantilla == "contacto_vacante":
        crystal_style = "Recuerda que debes generar un contacto asertivo, si es por correo que sea muy corto y que le deje claro la forma en que le puedes facilitar la vida"
        for i in crystal_styles:
            o = crystal_styles[i]
            if o["name"].lower() == data["crystal_con"].lower():
                crystal_style = o["advise"]
                break
        msg['Subject']="¡Encontramos contactos para tu vacante en "+data["empresa"]+"!"
        html = """\
        <html>
        <head></head>
        <body>
        <div style="font-family: verdana;width: 80%;color: #525252;">
        <p>Hola """+data["nombre"]+"""!<br><br>
        Espero te encuentres muy bien, dando seguimiento a la vacante de """+data["cargo"]+""" en """+data["empresa"]+"""que asociaste en Aleja,
        te compartimos el estilo de comunicación de un contacto estratégico, junto con sus datos de contacto para que, si quieres, te comuniques con el o ella en frio y abras un nuevo canal de comunicación
        que te haga resaltar sobre los otros candidatos.
        <br><br>
        """+data["nombre_con"]+""", """+data["cargo_con"]+""" en """+data["empresa"]+"""
        <br><br>
        <b>Datos de contacto.</b>
        <br>
        """+data["datos_con"]+"""
        <br><br>
        <b>¿Cual es la mejor forma de comunicarme con """+data["nombre_con"].split(" ")[0]+"""?</b>
        <br>
        """+crystal_style+"""
        <br><br>
        Este contacto esta cargado en tus contactos en Aleja, esperamos esta información te sea muy util.


        <br><br>
        Álvaro González
        <br>
        CTO / co-founder de Séligo
        </p>
        </div>
        </body>
        </html>
        """
    if plantilla == "contacto":
        msg['Subject']=data["nombre"].split(" ")[0]+", "+data["nombrec"]+" quiere que colaboren en algo distinto!";
        texto = ""
        if data["comentario"].strip() == "":
            texto = """La verificación de estos datos permite a """+data["nombrec"].split(" ")[0]+""" y a todos los usuarios de Aleja acceder a una red mas efectiva y segura para hacer networking."""
        else:
            texto = data["nombrec"].split(" ")[0]+""" te envió el siguiente mensaje.<br><div style="width:97%;
        margin-left:3%;
        position:relative;
        float:left;
        font-style: italic;
        text-align: left;
        color: #734b73;">"""+data["comentario"]+"""</div>"""
        html = """\
        <html>
        <head>
        </head>
        <body style="font-family: verdana;
        width: 80%;
        color: #525252;">
        <div>
        <p>Hola """+data["nombre"].split(" ")[0]+"""!<br><br>
        """+data["nombrec"]+""" dijo que ambos se conocen, y quisiera que verificaras esta información.
        <br><br>
        """+texto+"""
        <br><br>
        Para tu tranquilidad te invitamos a confirmar directamente con """+data["nombrec"].split(" ")[0]+""" la veracidad de esta solicitud. Una vez la confirmes podrás verificar en Aleja su relación dando clic en el siguiente botón.
        <br><br>
        <div style="width:100%; position:relative; float:left">
        
        
        <a href="https://aleia.app/verificacion?n1="""+data["nombre"].split(" ")[0]+"""&n2="""+data["nombrec"].split(" ")[0]+"""&type=ok&idt="""+str(data["id_contacto"])+"""&ids="""+str(id_user)+"""">
        <button style="padding: 10px 20px;
        cursor: pointer;
        border-radius: 25px;
        position: relative;
        float: left;
        border: 0px;
        background: #7d52bf;
        color: white;
        font-family: verdana;
        font-size: 13px;
        margin-right: 20px;
        margin-bottom: 20px;" class="mainbutton">¡Quiero verificar mi relación con """+data["nombrec"].split(" ")[0]+"""!</button></a>
        <a href="https://aleia.app/verificacion?n1="""+data["nombre"].split(" ")[0]+"""&n2="""+data["nombrec"].split(" ")[0]+"""&type=notok&idt="""+str(data["id_contacto"])+"""&ids="""+str(id_user)+"""">
        <button style="padding: 10px 20px;
        cursor: pointer;
        border-radius: 25px;
        position: relative;
        float: left;
        border: 1px solid #7d52bf;
        background: white;
        color: #604d7d;
        font-family: verdana;
        font-size: 13px;
        margin-right: 20px;
        margin-bottom: 20px;" >No conozco a """+data["nombrec"].split(" ")[0]+"""</button>
        </a>
        </div>
        Aleja es una plataforma creada por Séligo, pensada para quienes quieren aumentar su red de networking y creen que conectar en el mundo real es la mejor forma de hacerlo. Si quieres saber más sobre Aleja o Séligo te invitamos a seguirnos en redes o entrar a nuestra página web.
        <br><br>
        <a href="https://www.linkedin.com/in/juan-diego-hernandez-chavez" style="color:#076eac">Nuestro CEO, juan-diego-hernandez-chavez en Linkedin</a>
        <br><br>
        <a href="https://www.youtube.com/channel/UClMNkFB20wVSt0IAHBo-Dig" style="color:red">Canal de Youtube de Séligo</a>
        <br><br>
        <a href="https://www.instagram.com/seligo_outplacement/?hl=es-la" style="color:#da397e">@seligo_outplacement en Instagram</a>
        <br><br>
        <a href="https://seligo.co" style="color:#458a8e">seligo.co</a>
        <br><br>
        <a href="https://aleia.app" style="color:#7c458e">aleia.app</a>
        <br><br>
        Esperamos puedas ayudar a tu contacto a mejorar su relacionamiento.
        <br><br><br><br>
        Álvaro González
        <br>
        CTO / co-founder de Séligo
        <a href="https://www.linkedin.com/in/alvaro-diego-gonzalez-vesga" style="color:#076eac">alvaro-diego-gonzalez-vesga en Linkedin</a>
        </p>
        </div>
        </body>
        </html>
        """
    if plantilla == "representado":
        msg['Subject']="¡Aleja tiene noticias de tu vacante en "+data["empresa"]+"!"
        html = """\
        <html>
        <head></head>
        <body>
        <div style="font-family: verdana;width: 80%;color: #525252;">
        <p>Hola """+data["nombre"]+"""!<br><br>
        El equipo de Séligo te representó para la vacante de """+data["cargo"]+""" en """+data["empresa"]+""". Esto fue lo que obtuvimos al hablar con """+data["nombre_con"]+""", """+data["cargo_con"]+""".
        <br><br><div style="width:97%;
        margin-left:3%;
        position:relative;
        float:left;
        font-style: italic;
        text-align: left;
        color: #734b73;">"""+data["mensaje"]+"""</div>
        <br><br><br>
        Esta información está cargada en los comentarios de tu vacantes para que puedas ver la trazabilidad de tu proceso.
        <br><br>
        <b>RECOMENDACIONES PARA HACER EL MEJOR USO DE TU REPRESENTACIÓN: </b>
        <br><br>
        - Ahora que tienes identificado al tomador de decisión de los procesos, agrégalo a Linkedin y tenlo presente. Ingresa a su perfil <a href='"""+data["linkedin_con"]+"""' target="_blank">aquí</a><br>
        - Si existe alguna fecha concreta de seguimiento, ponla en tu calendario. No dejes pasar esa fecha. <br>
        - Ayuda a tu visibilidad poder saludar por Linkedin en frío a esas personas para reforzar la visibilidad que ya ganaste. Ve un ejemplo de cómo hacerlo dando clic <a href="https://www.youtube.com/watch?v=GHkE35nySOU&t" target="_blank">aquí</a><br>
        - Si la vacante sigue abierta, agrega más personas en Linkedin de la compañía y haz preguntas informativas para buscar generar relaciones que luego te permitan estar en el radar de la empresa mientras sigue activa la búsqueda. <br>
        <br>
        Nuestros mejores deseos y esperamos te llamen pronto a una entrevista. Si lo hacen, cuéntanos. 

        <br><br>¡Muchas gracias por confiar en nosotros! Por favor califica tu servicio en el siguiente botón para que así podamos mejorar constantemente para ti.
        <br><br>
        <div style="width: 100%; position: relative; float: left;">
        <a href="https://forms.gle/1jXFyUyG6NBkZvDj8" target="_blank"><button style="padding: 10px 20px;
        cursor: pointer;
        border-radius: 25px;
        position: relative;
        float: left;
        border: 0px;
        margin-left: 25%;
        width: 300px;
        background: #7d52bf;
        color: white;
        font-family: verdana;
        font-size: 13px;
        margin-right: 20px;
        margin-bottom: 20px;" class="mainbutton">Calificar mi servicio</button></a>
        </div>
        <br><br>
        Álvaro González
        <br>
        CTO / co-founder de Séligo
        </p>
        </div>
        </body>
        </html>
        """
    if plantilla == "password":
        msg['Subject']="Recuperación de contraseña de Aleja"
        html = """\
        <html>
        <head></head>
        <body>
        <div style="font-family: verdana;width: 80%;color: #525252;">
        <p>Hola """+data["nombre"]+"""!<br><br>
        Tu contraseña de Aleja es """+id_user+"""
        <br><br>
        Te recomendamos eliminar este correo para que tu contraseña no quede expuesta.
        <br><br>
        <br>
        Álvaro González
        <br>
        CTO / co-founder de Séligo
        </p>
        </div>
        </body>
        </html>
        """
    if plantilla == "registro":
        # set up the SMTP server
        
        msg['Subject']="Activación cuenta de Aleja"
        
        # add in the message body
        html = """\
        <html>
        <head></head>
        <body>
        <div style="font-family: verdana;width: 80%;color: #525252;">
        <p>Hola """+data["nombre"]+"""!<br><br>
        Te queremos dar la bienvenida a Aleja, la plataforma para gestionar tu networking y tu búsqueda de empleo.
        <br><br>
        Nos hace muy felices que hagas parte del cambio y de esta comunidad.
        <br><br>
        Para activar tu cuenta en Aleja debes dar clic <a href="http://aleia.app/activacion?id="""+str(id_user)+"""">aquí</a><br><br><br><br>
        Álvaro González
        <br>
        CTO / co-founder de Séligo
        </p>
        </div>
        </body>
        </html>
        """
    if plantilla == "creacion_usuario":
        # set up the SMTP server
        
        msg['Subject']=data["nombre"]+", te damos la bienvenida a Aleja"
        if data["tipo"] == 8:
            msg_tipo = """Ten acceso a los cursos virtuales para búsqueda de empleo ingresando <a href="https://sso.teachable.com/secure/417888/users/sign_in?clean_login=true&reset_purchase_session=1">aquí</a>. Una vez ingreses tu usuario y contraseña elige la opción "Crear cuenta MyTeachable".
            <br><br>
            Puedes loguearte en ambos servicios con los siguientes datos."""
        else:
            msg_tipo = """Ingresa con los siguientes datos."""
        # add in the message body
        html = """\
        <html>
        <head></head>
        <body>
        <div style="font-family: verdana;width: 80%;color: #525252;">
        <p>Hola """+data["nombre"]+"""!<br><br>
        Tu cuenta de Aleja se ha sido activada y ya puedes empezar a sacar el mayor provecho a todas las funcionalidades que construimos para tu búsqueda de empleo.
        <br><br>
        Ten acceso a la plataforma para gestionar tu búsqueda de empleo ingresando a <a href="http://aleia.app/login">aleia.app</a>.
        <br><br>
        """+msg_tipo+"""
        <br>
        Usuario: """+data["usuario"]+"""<br>
        Contraseña: """+str(data["password"])+"""
        <br><br><br>
        Álvaro González
        <br>
        CTO / co-founder de Séligo
        </p>
        </div>
        </body>
        </html>
        """
    part2 = MIMEText(html, 'html')
    msg.attach(part2)
    me = MY_ADDRESS
    you = msg['To']
    print("enviando correo....",you,me)
    if you.strip() != "" and you != None:
        s.sendmail(me, you, msg.as_string())
    else:
        return {"ok":"no","mensaje":"destinatario sin correo"}
    s.quit()
    load_mongo_client().logs.insert_one({"fecha":str(datetime.datetime.now().strftime("%Y-%m-%d")),"parametro":{"origen":me,"destino":you},"accion":plantilla,"id_retorno":"","tipo":"correo","etiqueta":"","id_user":me,"id_sesion":""})
    print("correo enviado",me,you)
    return {"ok":"si","mensaje":you}
def compare_strings(a,b,t):
    a = str(a).strip().lower()
    b = str(b).strip().lower()
    if t == "name":
        x = fuzz.token_set_ratio(a,b)
        return x == 100
    elif t == "text":
        a = re.sub(stop_words_regex,'',a)
        b = re.sub(stop_words_regex,'',b)
        x = fuzz.token_sort_ratio(a,b)
        return x >= 90
    elif t == "link":
        a = re.sub(stop_text_link,'',a)
        b = re.sub(stop_text_link,'',b)
        return a == b

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

def solicitud_index(n,e,c,o,f):
    load_mongo_client().solicitudes.insert_one({"empresa":e,"nombre":n,"cargo":c,"comentarios":o,"fecha":f})
def get_full_user_info(id_user):
    persona = json.loads(dumps(load_mongo_client().personas.find({"id":int(id_user)})))
    persona = process_data_json(persona,"profile")[0]

    for o in persona["etiquetas"]:
        if o["label"] == "contacto":
            tmp = json.loads(dumps(load_mongo_client().personas.find({"id":int(o["id_objeto"])})))
            if len(tmp) > 0:
                o["data"] = process_data_json(tmp)[0]
            
        if o["label"] == "oportunidad":
            tmp = json.loads(dumps(load_mongo_client().vacantes.find({"id":int(o["id_objeto"])})))
            if len(tmp) > 0:
                o["data"] = process_data_json(tmp)[0]
            else:
                o["data"] = process_data_json([{"oculto":"","cargo":"Vacante eliminada","empresa":"","ciudad":"","keywords":"","link":""}])[0]
        if o["label"] == "proceso":
            tmp = json.loads(dumps(load_mongo_client().vacantes.find({"id":int(o["id_objeto"])})))
            if len(tmp) > 0:
                o["data_vacante"] = process_data_json(tmp)[0]
            
            tmp2 = json.loads(dumps(load_mongo_client().personas.find({"id":int(o["id_persona"])})))
            if len(tmp) > 0:
                o["data_persona"] = process_data_json(tmp2)[0]
           
        
    return persona
def iniciales(obj):
    return str(obj["nombre"]+"---"+obj["ultimo_cargo"]);
    """tmp = texto.split(" ")
    if len(tmp) > 2:
        return tmp[0][:1].upper()+" "+tmp[1][:1].upper()+" "+tmp[2][:1].upper()
    elif len(tmp) > 1:
        return tmp[0][:1].upper()+" "+tmp[1][:1].upper()
    else:
        return tmp[0][:2].upper()
    """
def agrega_adyacencias(adyacencias,s,t):
    if int(s) not in adyacencias:
        adyacencias[int(s)] = [int(t)]
    else:
        adyacencias[int(s)].append(int(t))
    if int(t) not in adyacencias:
            
        adyacencias[int(t)] = [int(s)]
    else:
        adyacencias[int(t)].append(int(s))
    return adyacencias
def get_3level_network(id):
    personas = []
    persona = json.loads(dumps(load_mongo_client().personas.find_one({"id":int(id)})))
    nodes_ids = {persona["id"]:"TÚ"}
    nodes_ids_tmp = []
    adyacencias = {}
    links_ids = {}
    nodes_ids_tmp_2 = []
    nodes = [{ "id": persona["id"], "name": "TÚ","nivel":0}]
    links = []  
    cont = 0
    tmp_indxd = json.loads(dumps(load_mongo_client().personas.find()))
    indxd = {}
    index = 0
    json_structure = []
    for o in tmp_indxd:
        if index == 0:
            json_structure = prepare_item_json(o)
            index = 1
        indxd[o["id"]] = json.loads(dumps(o))
    for o in persona["etiquetas"]:
        if 'oculto' in o: 
            if o["oculto"] == True:
                continue
        cont = cont+1
        if o["label"] == "contacto" :
            if o["nivel"] > 1:
                if str(persona["id"])+"_"+str(o["id_objeto"]) not in links_ids and str(o["id_objeto"])+"_"+str(persona["id"]) not in links_ids:
                    links.append({ 'source': persona["id"], "target": int(o["id_objeto"]) ,"nivel":o["nivel"]})
                    links_ids[str(persona["id"])+"_"+str(o["id_objeto"])]=o["nivel"]
                    adyacencias = agrega_adyacencias(adyacencias,persona["id"],int(o["id_objeto"]))

                if int(o["id_objeto"]) not in nodes_ids:
                    #tmp = json.loads(dumps(load_mongo_client().personas.find_one({"id":int(o["id_objeto"])})))
                    tmp = indxd[int(o["id_objeto"])]
                    for u in tmp["etiquetas"]:
                        if 'oculto' in u: 
                            if u["oculto"] == True:
                                continue
                        cont = cont+1
                        if u["label"] == "contacto" :
                            if u["nivel"] > 1:
                                nodes_ids_tmp.append({ 'sid': int(o["id_objeto"]), "id_objeto": int(u["id_objeto"]) ,"nivel":u["nivel"]})
                    nodes_ids[int(o["id_objeto"])] = iniciales(tmp)
                    nodes.append({"id": tmp["id"], "name": iniciales(tmp),"nivel":o["nivel"]})
                    tmp["nivel_red"] = 1
    #para este punto ya tengo lleno todo lo de 1er nivel
    cont = 0
    for o in nodes_ids_tmp:
        cont = cont+1
        if str(o["sid"])+"_"+str(o["id_objeto"]) not in links_ids and str(o["id_objeto"])+"_"+str(o["sid"]) not in links_ids:
            links.append({ 'source': o["sid"], "target": o["id_objeto"] ,"nivel":o["nivel"]})
            links_ids[str(o["sid"])+"_"+str(o["id_objeto"])] = o["nivel"]
            adyacencias = agrega_adyacencias(adyacencias,o["sid"],o["id_objeto"])
        if o["id_objeto"] not in nodes_ids:
            #tmp = json.loads(dumps(load_mongo_client().personas.find_one({"id":int(o["id_objeto"])})))
            
            tmp = indxd[int(o["id_objeto"])]
            #if tmp["ultimo_cargo"].strip() != "":
            for u in tmp["etiquetas"]:
                """if u["label"] == "contacto" :
                    if int(u["id_objeto"]) == 2980:
                        print('oculto' in u, u,"adlkfbadskhfguaysdgfoiusadfliasdgfljaskufasdkfgasfg")
                """
                if  'oculto' in u:
                    if u["oculto"] == True:
                        continue
                cont = cont+1
                if u["label"] == "contacto" :
                    if u["nivel"] > 1:
                        nodes_ids_tmp_2.append({ 'sid': int(o["id_objeto"]), "id_objeto": int(u["id_objeto"]) ,"nivel":u["nivel"]})
            nodes_ids[int(o["id_objeto"])] =iniciales(tmp) 
            nodes.append({"id": tmp["id"], "name": iniciales(tmp),"nivel":o["nivel"]})
            tmp["nivel_red"] = 2
            personas.append(process_item_json(tmp,json_structure,"contacto"))
    #para este punto ya tengo lleno todo lo de 3er nivel
    cont = 0
    for o in nodes_ids_tmp_2:
        cont = cont+1
        if str(o["sid"])+"_"+str(o["id_objeto"]) not in links_ids and str(o["id_objeto"])+"_"+str(o["sid"]) not in links_ids:
            links.append({ 'source': o["sid"], "target": o["id_objeto"] ,"nivel":o["nivel"]})
            links_ids[str(o["sid"])+"_"+str(o["id_objeto"])] = o["nivel"]
            adyacencias = agrega_adyacencias(adyacencias,o["sid"],o["id_objeto"])
        if o["id_objeto"] not in nodes_ids and int(o["id_objeto"]) in indxd:
            #tmp = json.loads(dumps(load_mongo_client().personas.find_one({"id":int(o["id_objeto"])})))
            
            tmp = indxd[int(o["id_objeto"])]
            #if tmp["ultimo_cargo"].strip() != "":
            nodes_ids[int(o["id_objeto"])] = iniciales(tmp)
            nodes.append({"id": tmp["id"], "name": iniciales(tmp),"nivel":o["nivel"]})
            tmp["nivel_red"] = 3
            personas.append(process_item_json(tmp,json_structure,"contacto"))
        if int(o["id_objeto"]) not in indxd:
            print("HAY QUE HACER ALGO CON ESTE..............",o)
    for o in personas:
        o["links"] = []
        for l in links:
            if l["target"] == o["id"] and l["source"] != persona["id"]:
                o["links"].append({"id":l["source"],"nivel":l["nivel"]})
    return {"nodes":nodes,"links":links,"data":personas,"adyacencias":adyacencias,"links_indxd":links_ids,"nodes_indxd":nodes_ids}

def get_statistics():
    id_natalia = "13"
    id_vanessa = "2"
    id_laura = "10"
    team = {"natalia.vergara":"13","vanessa.daza":"2","laura.mesa":"10"}
    c2 = load_mongo_client().logs.find({"$and":[{"tipo":"etiqueta"},{"accion":"insert"}]})
    usuarios = load_mongo_client().personas.find({"$or":[{"job_hacker":"laura.mesa"},{"job_hacker":"vanessa.daza"}]})
    jhs = {}
    for w in usuarios:
        jhs[w["id"]] = w["job_hacker"]
    nsemanas = 8;
    semanas = []
    datos = {}
    datos2 = {}
    day = datetime.date.today() + datetime.timedelta(days= 6 - datetime.date.today().weekday())
    for o in range(nsemanas):
        semanas.insert(0,day)
        if o < nsemanas - 1 and o > 0:
            datos[day.strftime("%Y-%m-%d")+"--"+id_vanessa] = 0
            datos[day.strftime("%Y-%m-%d")+"--"+id_laura] = 0
            datos2[day.strftime("%Y-%m-%d")] = 0
        day = day + datetime.timedelta(days= (-7))
    for o2 in c2:
        if o2["id_user"] == id_natalia and o2["parametro"]["label"] == "contacto":
            tmp_fecha = o2['_id'].generation_time.date()
            for t in range(1,7):
                w = semanas[t-1]
                w1 = semanas[t]
                if tmp_fecha >= w and tmp_fecha < w1:
                    datos2[semanas[t].strftime("%Y-%m-%d")] = datos2[semanas[t].strftime("%Y-%m-%d")]+1
        if int(o2["id_user"]) in jhs:
            tjh = jhs[int(o2["id_user"])]
            jh = team[tjh]
            if o2["parametro"]["label"] == "proceso" and jh in [id_vanessa,id_laura]:
                tmp_fecha = o2['_id'].generation_time.date()
                for t in range(1,7):
                    w = semanas[t-1]
                    w1 = semanas[t]
                    if tmp_fecha >= w and tmp_fecha < w1:
                        datos[semanas[t].strftime("%Y-%m-%d")+"--"+jh] = datos[semanas[t].strftime("%Y-%m-%d")+"--"+jh]+1
    ret1 = []
    keys = copy.deepcopy(list(datos.keys()))
    tot2 = 0
    num2 = 0
    for u in keys:
        ret1.append({"key":u.split("--")[0],"label":u.split("--")[1],"value":datos[u]})
        tot2 = tot2 + int(datos[u])
        num2 = num2 + 1
    ret2 = []
    keys = copy.deepcopy(list(datos2.keys()))
    tot1 = 0
    num1 = 0
    for u in keys:
        ret2.append({"key":u,"label":id_natalia ,"value":datos2[u]})
        tot1 = tot1 + int(datos2[u])
        num1 = num1 + 1
    
    return {"contactos":ret2,"entrevistas":ret1,"nums":{"entrevistas":{"tot":tot2,"avg":tot2/num2},"contactos":{"tot":tot1,"avg":tot1/num1}}}

def buscar_grafo(links_indxd,nodes_indxd,ady,s,arr_temp):
    arr_t = [int(z) for z in arr_temp if int(z) in nodes_indxd]
    nodes = []
    
    nodes_ids = []
    s = int(s)
    print(".....grafeando.....",ady[s],arr_temp)
    links = []
    nodes.append({"id": int(s), "name": nodes_indxd[s],"group":0})
    nodes_ids.append(int(s))
    rutas = []
    for t in arr_t:
        ruta = [];
        suma_ruta = 0;
        nodes.append({"id": int(t), "name": nodes_indxd[t],"group":3})
        print("control2931tyiblfdasjhbokplasakbaufg829u3jie_____",t)
        nodes_ids.append(int(t))
        n1t = list(ady[s])
        n1 = [z for z in n1t if int(z) in nodes_indxd]
        if int(t) in n1:
            
            nivel = 1
            if str(s)+"_"+str(t) in links_indxd:
                nivel = links_indxd[str(s)+"_"+str(t)]
            elif str(t)+"_"+str(s) in links_indxd:
                nivel = links_indxd[str(t)+"_"+str(s)]
            rutas.append({'w':(int(nivel)*(-1))+4,'r':[{'n':int(t),'v':int(nivel)}]})
            links.append({ 'source': int(s), "target": int(t) ,"nivel":nivel})
            
        
        adys = set(ady[s])
        adyt = set(ady[t])
        n2t = list(adys & adyt)

        n2 = [z for z in n2t if int(z) in nodes_indxd]
        print(n2)
        for i in n2:
            suma_ruta = 0
            ruta = []
            if int(i) != int(s):
                if i not in nodes_ids:
                    group = 2
                    if i in list(adys):
                        group = 1
                    nodes.append({"id": i, "name": nodes_indxd[i],"group":group})
                    nodes_ids.append(i)
                nivel = 1
                if str(i)+"_"+str(s) in links_indxd:
                    nivel = links_indxd[str(i)+"_"+str(s)]
                elif str(s)+"_"+str(i) in links_indxd:
                    nivel = links_indxd[str(s)+"_"+str(i)]
                suma_ruta = suma_ruta + (int(nivel)*(-1))+4;
                ruta.append({'n':int(i),'v':int(nivel)})
                links.append({ 'source': int(s), "target": int(i) ,"nivel":nivel})
                nivel2 = 1
                if str(i)+"_"+str(t) in links_indxd:
                    nivel2 = links_indxd[str(i)+"_"+str(t)]
                elif str(t)+"_"+str(i) in links_indxd:
                    nivel2 = links_indxd[str(t)+"_"+str(i)]
                suma_ruta = suma_ruta + (int(nivel2)*(-1))+4;
                ruta.append({'n':int(t),'v':int(nivel2)})
                rutas.append({'w':suma_ruta,'r':ruta})
                links.append({ 'source': int(i), "target": int(t) ,"nivel":nivel2})
        n3 = []
        for o in adyt:
            if int(o) != int(s):
                adyt2 = set(ady[int(o)])
                n3t = list(adys & adyt2)
                n3 = [z for z in n3t if int(z) in nodes_indxd]
                for i in n3:
                    suma_ruta = 0
                    ruta = []
                    if int(i) != int(s):
                        nivel0 = 1
                        if str(t)+"_"+str(o) in links_indxd:
                            nivel0 = links_indxd[str(t)+"_"+str(o)]
                        elif str(o)+"_"+str(t) in links_indxd:
                            nivel0 = links_indxd[str(o)+"_"+str(t)]

                        links.append({ 'source': int(t), "target": int(o) ,"nivel":nivel0})
                    
                        if i not in nodes_ids:
                            group = 2
                            if i in list(adys):
                                group = 1
                            nodes.append({"id": i, "name": nodes_indxd[i],"group":group})
                            nodes_ids.append(i)
                        if o not in nodes_ids:
                            nodes.append({"id": o, "name": nodes_indxd[o],"group":2})
                            nodes_ids.append(o)
                        nivel = 1
                        if str(i)+"_"+str(s) in links_indxd:
                            nivel = links_indxd[str(i)+"_"+str(s)]
                        elif str(s)+"_"+str(i) in links_indxd:
                            nivel = links_indxd[str(s)+"_"+str(i)]
                        suma_ruta = suma_ruta + (int(nivel)*(-1))+4;
                        ruta.append({'n':int(i),'v':int(nivel)})
                        links.append({ 'source': int(s), "target": int(i) ,"nivel":nivel})
                        nivel2 = 1
                        if str(i)+"_"+str(o) in links_indxd:
                            nivel2 = links_indxd[str(i)+"_"+str(o)]
                        elif str(o)+"_"+str(i) in links_indxd:
                            nivel2 = links_indxd[str(o)+"_"+str(i)]
                        suma_ruta = suma_ruta + (int(nivel2)*(-1))+4;
                        ruta.append({'n':int(o),'v':int(nivel2)})
                        links.append({ 'source': int(i), "target": int(o) ,"nivel":nivel2})
                        suma_ruta = suma_ruta + (int(nivel0)*(-1))+4;
                        ruta.append({'n':int(t),'v':int(nivel0)})
                        rutas.append({'w':suma_ruta,'r':ruta})
        
        
    print("......buscar_grafo_saliendooo.....",len(nodes),len(links))
    return {"nodes":nodes,"links":links,"rutas":rutas}

atts_return = {"contacto":["id","nombre","ultimo_cargo","ultima_empresa","linkedin","tipo","job_hacker","nivel_red","cargos_aplica"
,"fecha_sesion","calificacion_sesion","fecha_programa","atencion_programa","informacion_programa","calificacion_programa","tiempo_inicio","vacantes_semana","vacantes_semana_internas","ultimo_dato","dias_ultimo_dato","estado"],
"vacante":["req","lista_reqs","show","oculta","id_user","fecha","id","cargo","empresa","ciudad","rango_mayor","rango_menor"]}
def prepare_item_json(o,tipo=""):
    #consolidado = ""
    salida = []
    keys = copy.deepcopy(list(o.keys()))
    bloque = ["_id","password"]
    salida.append("_id")
    salida.append("password")
    for u in keys:
        if tipo == "":

            if (u in bloque or ("'list'" in str(type(o[u])))):
                salida.append(u)
            
        elif tipo == "profile":
            if u == "_id":
                salida.append(u)
        else:
            if u not in atts_return[tipo] and (u in bloque or ("'list'" in str(type(o[u])))):
                salida.append(o)
            
    
    return salida
def process_item_json(o,json_structure,tipo=""):
    #consolidado = ""
    
    for u in json_structure:
        o.pop(u,None)
    tmp = copy.deepcopy(o)
    """y = json.dumps(tmp, ensure_ascii=False)
    y = re.sub(', "'," ]] [[ ",y)
    y = re.sub('": '," || ",y)
    y = re.sub('{"',"[[ ",y)
    y = re.sub('}'," ]]",y)
    y = re.sub('"','',y)
    o['consolidado']= y

    
    keys = copy.deepcopy(list(o.keys()))
    bloque = ["_id","password"]
    for u in keys:
        if tipo == "":

            if (u in bloque or ("'list'" in str(type(o[u])))):
                o.pop(u, None)
            else: #u != "etiquetas":
                
                consolidado= consolidado + "[[ "+normalize_text(str(u))+" || "+normalize_text(str(o[u]))+" ]]";
        elif tipo == "profile":
            if u == "_id":
                o.pop(u, None)
        else:
            if u not in atts_return[tipo] and (u in bloque or ("'list'" in str(type(o[u])))):
                o.pop(u, None)
            elif "'list'" not in str(type(o[u])): #u != "etiquetas":
                consolidado= consolidado + "[[ "+normalize_text(str(u))+" || "+normalize_text(str(o[u]))+" ]]";
    o['consolidado']= consolidado
    """
    return o

def process_data_json(objeto,tipo = ""):
    
    index= 0
    json_structure = []
    for o in objeto:
        if index == 0:
            json_structure = prepare_item_json(o,tipo)
            index = 1
        o = process_item_json(o,json_structure,tipo)
    return objeto
def tiempo_desde_fecha(fecha):

    fec = datetime.datetime.strptime(fecha, '%Y-%m-%d').date()
    dias = (datetime.date.today() - fec).days
    if dias == 0:
        return "hoy";
    
    if dias < 30:
        if dias < 7:
            return str(dias)+"d";
        
        return str(math.floor(dias/7))+"s";

    else:
        return str(math.floor(dias/30))+"m";
def process_data_ciudades(ciudades):
    retorno = []
    for o in ciudades:
        retorno.append(o["ciudad"])
    return retorno
def process_data_vacante(objeto,id_sesion):
    arr_tmp_sesion = []
    if id_sesion != 'null' and id_sesion != '':
        ets_sesion = load_mongo_client().personas.find_one({"id":int(id_sesion)})
        """
        ciudades = load_mongo_client().ciudades.find()
        for o in ciudades:
            if o["ciudad"] not in ciudades_tmp:
                ciudades_tmp.append(o["ciudad"])
            if o["pais"] not in paises_tmp:
                paises_tmp.append(o["pais"])
        personas = load_mongo_client().personas.find()
        for o in personas:
            if "sector" in o:
                if o["sector"] not in sectores_tmp and o["sector"].strip() != "":
                    sectores_tmp.append(o["sector"])  
            if "ultimo_cargo" in o:
                if o["ultimo_cargo"] not in cargos_tmp and o["ultimo_cargo"].strip() != "":
                    cargos_tmp.append(o["ultimo_cargo"])
        for o in objeto:
            if o["cargo"] not in cargos_tmp and o["cargo"].strip() != "":
                cargos_tmp.append(o["cargo"])
        """
        
        for o in ets_sesion["etiquetas"]:
            if o["label"] == "oportunidad":
                arr_tmp_sesion.append(o["id_objeto"])
    else:
        ets_sesion = {"tipo":permisos_usuario_admin[0]}
    retorno = []
    retorno2 = []
    json_structure = []
    index = 0
    prevDate = datetime.date.today() + datetime.timedelta(days=-90)
    for o in objeto:
        if index == 0:
            json_structure = prepare_item_json(o)
            index = 1
        if "req" in o:
            tmp_list = []
            tmp_req = o["req"].split(".")
            for tmp_o in tmp_req:
                if tmp_o.strip() != "":
                    tmp_list.append(tmp_o)
            o["lista_reqs"] = tmp_list
        else:
            o["lista_reqs"] = []
        if int(ets_sesion["tipo"]) in permisos_usuario_seguimiento or int(ets_sesion["tipo"]) in permisos_usuario_micros:
            tmp_fec = datetime.datetime.strptime(o["fecha"], '%Y-%m-%d').date()
            #if tmp_fec >= prevDate or o["id"] in arr_tmp_sesion:
            o["show"] = True
            if "oculta" in o:
                if o["oculta"] == True and int(o["id_user"]) != int(id_sesion) :
                    o["show"] = False 
            #o["keywords"] = rake_evaluator(o["obs"])
            #if len(o["keywords"]) < 2 and o["link"].strip() == "":
            #if  o["link"].strip() == "":
            #    o["show"] = False
            if o["id"] not in arr_tmp_sesion and o["show"]:
                retorno.append(process_item_json(o,json_structure))
        elif int(ets_sesion["tipo"]) in permisos_usuario_admin:

            o["show"] = True 
            
            if o["id"] not in arr_tmp_sesion:
                retorno.append(process_item_json(o,json_structure))
    return retorno #retorno2 + retorno
    #else:
    #    return objeto
def process_data_persona_seguimiento(objeto,id_sesion):
    prevMonday = datetime.date.today() + datetime.timedelta(days=-datetime.date.today().weekday()-7, weeks=1)
    nextSunday = datetime.date.today() + datetime.timedelta(days=datetime.date.today().weekday()-1,weeks=1)
    num_vacantes_semana = 0;
    num_vacantes_semana_jh = 0;
    index = 0
    retorno = []
    json_structure = []
    tmp_fecha = datetime.datetime.strptime("01-01-2000", '%m-%d-%Y').date()
    tmp_fecha2 = datetime.datetime.strptime("01-01-2000", '%m-%d-%Y').date()
    for o in objeto:
        if index == 0:
            json_structure = prepare_item_json(o)
            index = 1
        o["nivel_red"] = 1;
        if o["tipo"] in permisos_usuario_seguimiento:
            num_vacantes_semana = 0;
            num_vacantes_semana_jh = 0;
            o["fecha_sesion"]="";
            o["calificacion_sesion"]=-1;
            o["fecha_programa"]="";
            o["atencion_programa"]=-1;
            o["informacion_programa"]=-1;
            o["calificacion_programa"]=-1;
            o["tiempo_inicio"] = tiempo_desde_fecha(o["fecha"])
            tmp_fecha = datetime.datetime.strptime(o["fecha"], '%Y-%m-%d').date()
            tmp_fecha2 = datetime.datetime.strptime(o["fecha"], '%Y-%m-%d').date()


            if 'encuestas' in o:
                for e in o["encuestas"]:
                    if e["encuesta"] == "Satisfaccion cliente sesiones":
                        if datetime.datetime.strptime(e["fecha"], '%Y-%m-%d').date() > tmp_fecha:
                            tmp_fecha = datetime.datetime.strptime(e["fecha"], '%Y-%m-%d').date()
                            o["fecha_sesion"] = tiempo_desde_fecha(e["fecha"]);
                            o["calificacion_sesion"] = e["que_calificacion_le_darias_a_tu_sesion"];
                    elif e["encuesta"] == "Satisfaccion cliente programa":
                        if datetime.datetime.strptime(e["fecha"], '%Y-%m-%d').date() > tmp_fecha:
                            tmp_fecha = datetime.datetime.strptime(e["fecha"], '%Y-%m-%d').date()
                            o["fecha_programa"] = tiempo_desde_fecha(e["fecha"]);
                            o["atencion_programa"] = e["que_tan_oportuna_fue_la_atencion_por_canales_virtuales"];
                            o["informacion_programa"] = e["que_tan_relevante_fue_la_informacion_que_te_remitio_el_equipo_de_seligo"];
                            o["calificacion_programa"] = e["como_calificarias_el_servicio_prestado_esta_semana"];


            for t in o["etiquetas"]:

                if t["label"] != "sesion" and t["label"] != "observacion":
                    if t["label"] == "oportunidad" and datetime.datetime.strptime(t["fecha"], '%Y-%m-%d').date() >= prevMonday and datetime.datetime.strptime(t["fecha"], '%Y-%m-%d').date() <= nextSunday:
                        if t["protegido"] == True:
                            num_vacantes_semana=num_vacantes_semana+1
                        else:
                            num_vacantes_semana_jh=num_vacantes_semana_jh+1
                    if datetime.datetime.strptime(t["fecha"], '%Y-%m-%d').date() > tmp_fecha:
                        tmp_fecha = datetime.datetime.strptime(t["fecha"], '%Y-%m-%d').date()


            o["vacantes_semana"] = num_vacantes_semana;
            o["vacantes_semana_internas"] = num_vacantes_semana_jh;
            o["ultimo_dato"] = tmp_fecha.strftime('%Y/%m/%d');
            if o["estado"] == "contratado" or o["estado"] == "suspendido":
                o["dias_ultimo_dato"] = 0
            else:
                o["dias_ultimo_dato"] = (datetime.date.today() - tmp_fecha).days
            retorno.append(process_item_json(o,json_structure))
    return retorno
def process_data_persona(objeto,id_sesion):
    retorno2 = []
    index = 0
    json_structure = []
    for o in objeto:
        if index == 0:
            json_structure = prepare_item_json(o)
            index = 1
        o["nivel_red"] = 1;
        
        retorno2.append(process_item_json(o,json_structure))
    return retorno2
import urllib
import requests
from bs4 import BeautifulSoup
import json
import requests
import time
import datetime
def get_crystal_profile(pnombre,snombre,desc,expe):
    key = "XKTdoM2vo2cYScjQTsi5Sk7g8BjgYVIkFnbYudSneKk"
    url = "https://api.phantombuster.com/api/v2/agents/launch" 
    print(pnombre,snombre)
    payload = {
        "id": "6934001112093546",
        "arguments": '{     "fname":"'+pnombre+'",     "lname":"'+snombre+'", "desc":"'+desc+'", "expe":"'+expe+'" }',
        "saveArguments": True,
        "manualLaunch": True
    }
    headers = {
        "content-type": "application/json",
        "x-phantombuster-key": "XKTdoM2vo2cYScjQTsi5Sk7g8BjgYVIkFnbYudSneKk"
    }
    
    response = requests.request("POST", url, json=payload, headers=headers)
    ok = False
    t = 1
    cr = "NaN"
    while ok == False and t < 500:
        
        url = "https://api.phantombuster.com/api/v2/agents/fetch-output"
    
        querystring = {"id":"6934001112093546"}
        
        headers = {
            "accept": "application/json",
            "x-phantombuster-key": key
        }
        
        response = requests.request("GET", url, headers=headers, params=querystring)
        if "Process finished successfully (exit code: 0) " in response.text:
            ok = True
        else:
            time.sleep(0.5)
            t = t+1
        print(t)
    if ok:
        print("proceso crystal ok")
    cr = response.text.split("[[[")[1].split("]]]")[0]
    print(cr,"controlado",pnombre)
    try:
        cr = cr.split("(")[0].strip().lower()#[1].split(")")[0].strip().lower()
    except:
        cr = "nan"
    return {"cr":cr}

def get_linkedin_profile(lin):
    key = "XKTdoM2vo2cYScjQTsi5Sk7g8BjgYVIkFnbYudSneKk"
    ini = datetime.datetime.now()
    url = "https://api.phantombuster.com/api/v2/agents/launch"
    salida = {}

    payload = "{\"id\":\"7410602363963750\",\"arguments\":\"{ \\t\\\"sessionCookie\\\": \\\"AQEDAR8SbqQDZwDaAAABdyaOc2YAAAF4hGvagk4Am8wzNdjHtEre2Oq0LFlipIQ8qNOiakO63ghIdM_M9VUSmLaQOqhl_s_EGcNTSZ1a_FERqqiD572_9vrreDrzKYTUG2EAvXf5OX5XuSbn1XfGOEUr\\\", \\t\\\"spreadsheetUrl\\\": \\\""+lin+"\\\", \\t\\\"emailChooser\\\": \\\"none\\\", \\t\\\"advancedSettings\\\": true, \\t\\\"numberOfAddsPerLaunch\\\": 10, \\t\\\"filterResults\\\": false, \\t\\\"scrapeInterests\\\": false, \\t\\\"saveImg\\\": false, \\t\\\"takeScreenshot\\\": false, \\t\\\"takePartialScreenshot\\\": false, \\t\\\"onlyCurrentJson\\\": true, \\t\\\"dwellTime\\\": false }\",\"saveArguments\":true,\"manualLaunch\":true}"
    headers = {
        'content-type': "application/json",
        'x-phantombuster-key': key
        }
    
    response = requests.request("POST", url, data=payload, headers=headers)

    if "status\":\"error" not in response.text:
        print("script output ok")
        ok = False
        t = 1
        while ok == False and t < 500:
            
            url = "https://api.phantombuster.com/api/v2/agents/fetch-output"
        
            querystring = {"id":"7410602363963750"}
            
            headers = {
                "accept": "application/json",
                "x-phantombuster-key": key
            }
            
            response = requests.request("GET", url, headers=headers, params=querystring)
            if "Process finished successfully (exit code: 0) " in response.text:
                ok = True

            else:
                time.sleep(2)
                t = t+1
            print(t)
        print("proceso linkedin ok")
        if ok == False:
            print("error total 1")
            return {"error":"servicio no disponible"}
        else:
            response = requests.request("GET", "https://phantombuster.s3.amazonaws.com/FdYdITR87mI/ya0MdWFEXiDg8Te79BclZw/result.json")
            print(response.text)
            resjs = json.loads(response.text)[0]
            desc = resjs["general"]["description"]
            nombrec = resjs["general"]["fullName"]
            pnombre = resjs["general"]["firstName"]
            snombre = resjs["general"]["lastName"]
            empresa = resjs["general"]["company"]
            cargo = resjs["general"]["headline"]

            jobs = resjs["jobs"]
            expe = ""
            primero = True
            for o in jobs:
                if primero:
                    cargo = str(o["jobTitle"])
                    primero = False
                job = str(o["jobTitle"])+"\nNombre de la empresa "+str(o["companyName"])+"\nFecha de empleo "+str(o["dateRange"])+"\nUbicacion "+str(o["location"])+"\n"+str(o["description"])
                expe = expe + " "+job
            
            url = "https://api.phantombuster.com/api/v2/agents/launch"
            desc = desc.replace("–","")
            expe = expe.replace("–","")
            desc = desc.replace("’"," ")
            expe = expe.replace("’"," ")
            desc = desc.replace("“"," ")
            expe = expe.replace("“"," ")
            desc = desc.replace("”"," ")
            expe = expe.replace("”"," ")
            desc = desc.replace("\n"," ")
            expe = expe.replace("\n"," ")
            desc = desc.replace("•","-")
            expe = expe.replace("•","-")
            

            salida = {"pnombre":pnombre,"snombre":snombre,"nombre":nombrec,"cargo":cargo,"empresa":empresa,"desc":desc,"expe":expe}
        fin = datetime.datetime.now()
        t = (fin-ini).total_seconds()
        print(t,pnombre)
        return salida
"""
def get_linkedin_profile_deprec2(url):
    tmp = url.split("/")

    query = tmp[len(tmp)-1]
    if query == "":
        query = tmp[len(tmp)-2]
    query = query.replace(' ', '+')
    URL = f"https://google.com/search?q='linkedin.com/in/{query}' linkedin colombia"
    # desktop user-agent
    USER_AGENT = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.14; rv:65.0) Gecko/20100101 Firefox/65.0"
    # mobile user-agent
    #MOBILE_USER_AGENT = "Mozilla/5.0 (Linux; Android 7.0; SM-G930V Build/NRD90M) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.125 Mobile Safari/537.36"
    headers = {"user-agent" : USER_AGENT}
    resp = requests.get(URL, headers=headers)

    if resp.status_code == 200:
        file2 = open("page.html","w+") 
        file2.write(resp.text)
        file2.close()

        soup = BeautifulSoup(resp.content, "html.parser")

        
        for g in soup.find_all('div', class_='med'):
            anchors = g.find_all('a')
            for o in anchors:
                print("href_____",o["href"])
                if query in o["href"] and "search?q=" not in o["href"]:
                    
                    print(".........................")
                    u = o.parent.parent.find('div', class_='s').find('div', class_='f')
                    print("...",u)
                    a3 = ""
                    a2 = ""
                    if u != None:
                        atmp = a2 = u.text.split(" - ")[0].strip()
                        
                        a3 = u.text.split(" - ")[len(u.text.split(" - "))-1].strip()
                        if "LinkedIn, la mayor red profesional" in a3:
                            a3 = ""
                        print("a3.1...",a3)
                        a2 = u.text.split(atmp)[1].split(a3)[0].replace("-","").strip()
                        print("a3.2...",a2)
                    u = o.parent.parent.find('div', class_='s')
                    print(print("``",u))
                    x = ""
                    y = ""
                    if "Ve el perfil de " in u.text or "View " in u.text:
                        if "View " in u.text:
                            x = "View"
                            y = "'s profile"
                        else:
                            x = "Ve el perfil de "
                            y = " en "
                        a1 = u.text.split(x)[1].split(y)[0].strip()
                        print("a1.1...",a1)
                        
    
                    else:
                        a1 = u.text.split(". ")[0].strip()
                        print("a1.2...",a1)
                    
                    return {"nombre":a1,"cargo":a2,"empresa":a3,"mail":"","disc":{"data":{"personalities":{"disc_type":""}}}}
    return {"error":"No se encontró info"}
def get_linkedin_profile_depreciado(url):
    tmp = url.split("/")

    usr = tmp[len(tmp)-1]
    if usr == "":
        usr = tmp[len(tmp)-2]

    api = Linkedin('ad.gonzalez021091@gmail.com', '02-10-91aldigovE')
    print("logueado...",usr)
    # GET a profile
    try:
        profile = api.get_profile(usr)
    except:
        return {"nombre":"--","cargo":"--","empresa":"--","mail":"","disc":{"data":{"personalities":{"disc_type":"n"}}}}
    if "lastName" in profile:
        contact_info = api.get_profile_contact_info(usr)
        nombre = profile["firstName"]+" "+profile["lastName"]
        cargo = ""
        empresa = ""
        if "experience" in profile:
            if len(profile["experience"]) > 0:
                cargo = profile["experience"][0]["title"]
                empresa = profile["experience"][0]["companyName"]
        mail_lin = contact_info["email_address"]

        URL = "https://api.crystalknows.com/v1/analysis/text"
        token = "645cae230c14fb0ea4e4ece2946d6e57"
        if "summary" in profile:
            text = profile["summary"]
        else:
            text = ""
        for o in profile["experience"]:
            if "description" in o:
                text = text + " " +o["description"]

        PARAMS = {'token':token,"text":text} 
        r = requests.post(url = URL, params = PARAMS) 
        try:
            # extracting data in json format 
            data = r.json() 
            print(nombre,cargo,empresa,mail_lin,data)
        except:
            data = {}
            print("error en el consumo")
        return {"nombre":nombre,"cargo":cargo,"empresa":empresa,"mail":mail_lin,"disc":data}
    else:
        return {"error":True}

"""
def get_file(file_id):
    current_file_dir = os.path.dirname(__file__)
    other_file_path = os.path.join(current_file_dir, 'integracion aleja-a7c070957142.json')
    scope = ['https://www.googleapis.com/auth/drive']
    creds = ServiceAccountCredentials.from_json_keyfile_name(other_file_path,scope)
    drive_api = build('drive', 'v3', credentials=creds)
    #print(file_id)
    request = drive_api.files().get_media(fileId=file_id)

    #print(request)
    file_meta = drive_api.files().get(fileId=file_id).execute()
    #print(file_meta)
    file_name = file_meta['name']
    
    mime = mimetypes.MimeTypes().guess_type(file_name)[0]
    fh = io.BytesIO()
    downloader = MediaIoBaseDownload(fh, request)
    done = False
    while done is False:
        status, done = downloader.next_chunk()
        #print("Download %d%%." % int(status.progress() * 100))
    

    filename = str(datetime.datetime.now().strftime("%Y-%m-%d-%H-%M-%S"))#datetime.strftime(datetime.now(), '%Y-%m-%d-%H-%M-%S')
    extension = file_name.split(".")[len(file_name.split("."))-1]
    current_file_dir = os.path.dirname(os.path.abspath("__file__"))
    with open(os.path.join(current_file_dir,filename) + "."+extension, 'wb') as f:
        #for data in file_size_request.iter_content(block_size):         
        f.write(fh.getvalue())     
        f.close()
    with open(os.path.join(current_file_dir,filename) + "."+extension, 'rb') as f:
        data = f.read()   
    #print("archivo cargados en el servidor")
    #print("Eliminar del servidor")
    #os.remove(os.path.join(current_file_dir,filename) + extension)
    #print("archivo eliminado del servidor")
    return {"file":data,"name":file_name,"mime":mime,"ext":extension,"dir":os.path.join(current_file_dir,filename) + "."+extension,"pathname":filename+ "."+extension}
def remove_stop_words(dirty_text):
    cleaned_text = ''
    for word in dirty_text.split():
        if word in language_stopwords or word in non_words:
            continue
        else:
            cleaned_text += word + ' '
    return cleaned_text

def remove_punctuation(dirty_string):
    for word in non_words:
        dirty_string = dirty_string.replace(word, '')
    dirty_string = dirty_string.replace('á', 'a')
    dirty_string = dirty_string.replace('é', 'e')
    dirty_string = dirty_string.replace('í', 'i')
    dirty_string = dirty_string.replace('ó', 'o')
    dirty_string = dirty_string.replace('ú', 'u')
    return dirty_string

def process_file(file_content):
    # All to lower case
    file_content = file_content.lower()
    # Remove punctuation and spanish stopwords
    file_content = remove_punctuation(file_content)
    file_content = remove_stop_words(file_content)
    return file_content
from string import punctuation
from nltk.corpus import stopwords
import pandas as pd

import fitz
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import linear_kernel

language_stopwords = stopwords.words('spanish')
non_words = list(punctuation)
def get_recoms(vac):
    lista = load_mongo_client().cvs.find({"$or": [{ "contenido": { "$exists": True }}]})
    count = 0
    res = []
    tf = TfidfVectorizer(analyzer='word', ngram_range=(1, 3), min_df=0)
    ds =  pd.DataFrame(list(lista))
    del ds['_id']
    del ds["id"]
    del ds["fecha"]
    del ds["hora"]
    del ds["original_name"]
    del ds["name"]
    
    ds2 = pd.DataFrame([{"id_file":"","id_user": -1 ,"contenido":process_file(vac)}])
    #ds = ds2.apply(lambda x: process_file(x) if x.name == 'contenido' else x)

    ds=ds.append(ds2, ignore_index = True)
    ds=ds.iloc[:, [1,0,2]]
    tfidf_matrix = tf.fit_transform(ds['contenido'])
    results = []
    similarity_matrix = linear_kernel(tfidf_matrix, tfidf_matrix)
    for idx, row in ds.iterrows():
        if row["id_user"] == -1:
            similar_indices = similarity_matrix[idx].argsort()[:-100:-1]
            similar_items = [(similarity_matrix[idx][i], ds['id_user'][i]) for i in similar_indices]
            results= similar_items[1:]
        
        
    #for o in lista:
    #    count = count+1
    #    X = vectorizer.fit_transform([process_file(vac),o["contenido"]])
    #    similarity_matrix = linear_kernel(X,X)
    #    res.append({"id":o["id_user"],"sim":similarity_matrix[0][1],"id_file":o["id_file"]})
        
    #res = sorted(res, key=lambda x: x["sim"],reverse=True)
    
    resdef =[] 
    usrs_ret =[] 
    count = 0
    for o in results:
        u = {}
        id_file = ds.loc[ds['id_user'] == int(o[1])]
        id_filed = id_file['id_file']
        file = id_filed.tolist()[0]
        if o[1] not in usrs_ret:
            p = load_mongo_client().personas.find_one({"id":int(o[1])})
            if p != None:
                count = count+1
                u["usuario"] = p["usuario"]
                u["cargo"] = p["ultimo_cargo"]
                u["nombre"] = p["nombre"]
                u["telefono"] = p["telefono"]
                u["mail"] = p["mail"]
                u["mail"] = p["mail"]
                u["id"] = int(o[1])
                u["sim"] = float(o[0])
                u["id_file"] = file
                resdef.append(u)
                usrs_ret.append(o[1])

        if count  == 5:
            break
    return resdef
def test_textract():
    lista = load_mongo_client().cvs.find({"$or": [{ "contenido": { "$exists": False }},{ "contenido": {  "$eq": ''  }}]})
    count = 1
    jd = process_file(vac)
    for o in lista:
        status = 'ok'
        #print(count)
        obj = get_file(o["id_file"])
        text =''
        _, ext = os.path.splitext(obj["name"])
        ext = ext.lower()
        #print(ext)
        if (ext==".docx" or ext==".rtf"):
            try:
                

                text = textract.process(obj["dir"],method='pdfminer',).decode("utf-8", "strict")  
            except:
                print("No se pudo leer el archivo:"+obj["name"])
                status = 'fail'
        elif ext==".pdf":
            try:
                text = ""
                fFileObj = fitz.open(obj["pathname"])
                #print("Número de páginas: ", fFileObj.pageCount)
                #print("Metadatos: ", fFileObj.metadata)
                for page in fFileObj:
                    #fPageObj = fFileObj.load_page(0)
                    text = text + page.get_text("text")
                    #fFileObj.close()
            except:
                print("No se pudo leer el archivo:"+obj["name"])
                status = 'fail'
        else:
            #print("extensión de archivo no disponible para procesar...")
            print("formato no soportado",obj["name"])
        try:
            os.remove(obj["dir"])
        except:
            print("No se pudo borrar el archivo:"+obj["dir"] )

        #TF-IDF
        text = process_file(text)
        
        
        #print('Similarity')
        #print(similarity_matrix[0][1])
        #if count == totalf:
            #break
        count = count + 1
        print(count,".................................",text[0:10])
        load_mongo_client().cvs.update_one(
                    {"id":o["id"]},
                    {"$set":{"contenido":text}
                    })
    #return df
        


