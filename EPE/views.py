from django.shortcuts import render
from django.shortcuts import redirect
from EPE.business import logic
from EPE.business import cruds
from EPE.business import integracion_sheets
from EPE.business import session
from datetime import *
from .forms import CVform
from .forms import ServiceFormAp
from .forms import ServiceFormRe
import time
import copy
from pymongo import MongoClient
import pymongo
from django.http import HttpResponse
from django.http import FileResponse
import json
from fuzzywuzzy import fuzz
import re
from fuzzywuzzy import process
import logging







logging.basicConfig(filename='app2.log',level=logging.DEBUG, filemode='w', format='%(name)s - %(levelname)s - %(message)s')

def index(request):
    return render(request,'index.html')

def reclutamiento(request):
    return render(request,'reclutamiento.html')
def recomendacion(request):
    return render(request,'recomendacion.html')
def activacion(request):
    return render(request,'activacion.html')
def verificacion(request):
    return render(request,'verificacion.html')
def admin(request):
    return render(request,'admin.html')
def people(request):
	form = ServiceFormAp()
	form2 = ServiceFormRe()
	form_cv = CVform()
	return render(request,'people.html',{"formap":form,"formre":form2,"form_cv":form_cv})
def content(request):
	form = ServiceFormAp()
	form2 = ServiceFormRe()
	form_cv = CVform()
	return render(request,'content.html',{"formap":form,"formre":form2,"form_cv":form_cv})

def guarda_datos_perfil(request):
	logging.warning("::::VIEWS___tm124:"+str(datetime.now().strftime("%H:%M:%S")))
	id = request.POST.get('id', 'No data found')
	params = request.POST.get('params', 'No data found')

	retorno = cruds.guarda_datos_perfil(id,params)
	if "file" in request.FILES:
		integracion_sheets.load_file(request.FILES['file'],id)
	else:
		print("no se cargó archivo")
	return HttpResponse (
		json.dumps(retorno),
		content_type = "application/json"
	)
def profile(request):
	form = CVform()
	
	return render(request,'profile.html',{"form":form})
def loading_service(request):
	print("loading_service ppal")
	if request.method == 'POST':
		id_etiq = ""
		id_vac = ""
		tipo_etiq = ""
		tipo_serv = ""
		file = ""
		if 'id_vac_re' in request.POST:
			id_etiq = request.POST['id_etiq_re']
			id_vac = request.POST['id_vac_re']
			tipo_etiq = request.POST['tipo_etiq_re']
			tipo_serv = request.POST['tipo_serv_re']
			file = request.FILES['file_re']
		if 'id_vac_ap' in request.POST:
			id_etiq = request.POST['id_etiq_ap']
			id_vac = request.POST['id_vac_ap']
			tipo_etiq = request.POST['tipo_etiq_ap']
			tipo_serv = request.POST['tipo_serv_ap']
			file = request.FILES['file_ap']
		today = (datetime.now()+ timedelta(hours=-5))
		today_f = today.strftime("%Y-%m-%d")
		today_t = today_f+" "+today.strftime("%H:%M:%S")
		id_user = request.session['data']['data']['id']
		etiqueta = id_etiq
		tmp = "cumple[[true]]label[["+tipo_etiq+"]]id[["+id_vac+"]]fecha[["+today_f+"]]"
		retorno = cruds.conector_crear_actualizar_etiqueta(tmp,id_user,etiqueta)
		retorno = json.loads(retorno)
		ultima_parte_id = ""
		if tipo_etiq == "oportunidad":
			if tipo_serv == "representacion":
				ultima_parte_id = "1"
			elif tipo_serv == "analisis":
				ultima_parte_id = "2"
		elif tipo_etiq == "proceso":
			if tipo_serv == "analisis":
				ultima_parte_id = "3"
		id_servicio = str(retorno["return"]["id"])+"."+str(retorno["return"]["id_etiqueta"])+"_"+ultima_parte_id
		id_cv = integracion_sheets.load_file(file,id_user,id_servicio)	
		retorno2 = cruds.crear_actualizar_servicio(id_servicio,id_user,"abierto",today_t,tipo_etiq,tipo_serv,{"id_vacante":id_vac},id_cv)
		return HttpResponse (
			json.dumps({"mensaje":retorno}),
			content_type = "application/json"
		) 
def servicio_sin_archivo(request):
	if request.method == 'POST':
		
		
		id_etiq = ""
		id_vac = ""
		tipo_etiq = ""
		tipo_serv = ""
		file = ""
		if 'id_vac_re' in request.POST:
			id_etiq = request.POST['id_etiq_re']
			id_vac = request.POST['id_vac_re']
			tipo_etiq = request.POST['tipo_etiq_re']
			tipo_serv = request.POST['tipo_serv_re']
		if 'id_vac_ap' in request.POST:
			id_etiq = request.POST['id_etiq_ap']
			id_vac = request.POST['id_vac_ap']
			tipo_etiq = request.POST['tipo_etiq_ap']
			tipo_serv = request.POST['tipo_serv_ap']
		print(id_etiq,id_vac,tipo_etiq,tipo_serv,"controlado por todooo")
		today = (datetime.now()+ timedelta(hours=-5))
		today_f = today.strftime("%Y-%m-%d")
		today_t = today_f+" "+today.strftime("%H:%M:%S")
		id_user = request.session['data']['data']['id']
		etiqueta = id_etiq
		tmp = "cumple[[true]]label[["+tipo_etiq+"]]id[["+id_vac+"]]fecha[["+today_f+"]]"
		retorno = cruds.conector_crear_actualizar_etiqueta(tmp,id_user,etiqueta)
		retorno = json.loads(retorno)
		ultima_parte_id = ""
		if tipo_etiq == "oportunidad":
			if tipo_serv == "representacion":
				ultima_parte_id = "1"
			elif tipo_serv == "analisis":
				ultima_parte_id = "2"
		elif tipo_etiq == "proceso":
			if tipo_serv == "analisis":
				ultima_parte_id = "3"
		id_servicio = str(retorno["return"]["id"])+"."+str(retorno["return"]["id_etiqueta"])+"_"+ultima_parte_id
		id_cv = logic.get_last_id_cv(id_user)
		retorno2 = cruds.crear_actualizar_servicio(id_servicio,id_user,"abierto",today_t,tipo_etiq,tipo_serv,{"id_vacante":id_vac},id_cv)
		return HttpResponse (
			json.dumps({"mensaje":retorno}),
			content_type = "application/json"
		) 	

def app(request):
	form = ServiceFormAp()
	form2 = ServiceFormRe()
	form_cv = CVform()
	return render(request,'app.html',{"formap":form,"formre":form2,"form_cv":form_cv})
def data(request):
    return render(request,'data.html')

def login(request):
    return render(request,'login.html')
def health(request):
    return render(request,'health.html')
def satisfaccion_sesiones(request):
    response = redirect('https://lmodera.typeform.com/to/cz5NlG')
    return response
def satisfaccion_programa(request):
    response = redirect('https://lmodera.typeform.com/to/wE542y')
    return response

tamanio_listas_def = 20
def get_last_cv(request):
	id = request.GET.get('id', 'No data found')
	
	f = integracion_sheets.get_last_cv(int(id))
	if f == "NaN":
		return HttpResponse (
		json.dumps({"mensaje":"El usuario no tiene hoja de vida disponible"}),
		content_type = "application/json"
		)
	else:
		response = HttpResponse(f["file"], content_type=f["mime"])
		response['Content-Disposition'] = 'attachment; filename="'+f["name"]+'"'
	        
		return response



def update_info_vacante_sheet(request):
	print("ahora si!")
	id_con = request.POST.get('id_con', 'No data found')
	id_user = request.POST.get('id_user', 'No data found')
	id_et = request.POST.get('id_et', 'No data found')
	id_com = request.POST.get('id_com', 'No data found')
	tipo = request.POST.get('tipo', 'No data found')
	resp = request.POST.get('resp', 'No data found')
	print(id_con,id_user,id_et,resp,id_com,tipo)

	retorno = cruds.actualizacion_info_vacante(id_con,id_user,id_et,resp,id_com,tipo)
	return HttpResponse (
		json.dumps(retorno),
		content_type = "application/json"
	)

def get_login(request):
	print("---------",request.POST,request.body,request.method,request.content_params,request.scheme,request.path,request.path_info,request.encoding,request.content_type,request.headers)
	user = request.POST.get('user', 'No data found')
	passw = request.POST.get('pass', 'No data found')
	print("........",user,passw)
	retorno = session.login(user,passw)
	rta = json.loads(retorno)
	
	request.session['data'] = rta["retorno"]
	request.session['test'] = 192381
	
	now = datetime.now()
	date_time = now.strftime("%m/%d/%Y, %H:%M:%S")
	request.session['date'] = date_time
	print(retorno)
	request.session.modified = True
	return HttpResponse (
			json.dumps(retorno),
			content_type = "application/json"
		)

import sys
def validate_session(request):
	print(request.session['network']["nodes_indxd"][1471])
def check_session(request):
	
	request.session['cache'] = {}
	request.session['cache']['vacantes'] = []
	request.session['cache']['servicios'] = []
	request.session['cache']['vacantes_filtrado'] = []
	request.session['cache']['vacantes_indx'] = 5
	request.session['cache']['contactos'] = []
	request.session['cache']['contactos_filtrado'] = []
	request.session['cache']['contactos_indx'] = 5
	request.session['cache']['usuarios'] = []
	request.session['cache']['usuarios_filtrado'] = []
	request.session['cache']['usuarios_indx'] = 5
	try:
		cruds.registro_logs(request.session['data']['data']['id'])

		tmp = logic.get_full_user_info(request.session['data']['data']['id'])
		request.session['data']['data']['nombre'] = tmp["nombre"]
		if "cargos_aplica" in tmp:
			request.session['data']['data']['cargos_aplica'] = tmp["cargos_aplica"]+" testing!!!"
		else:
			request.session['data']['data']['cargos_aplica'] =""
		request.session.modified = True
		return HttpResponse(
			json.dumps(request.session['data']),
			content_type = "application/json"
		)
		
	
	except:
	
		return HttpResponse(
			json.dumps({"error":"si"}),
			content_type = "application/json"
		)

def cerrar_sesion(request):
	try:
		request.session['data'] = {}
		request.session['date'] = "";
		return HttpResponse (
			json.dumps([{"ok":"si"}]),
			content_type = "application/json"
		)
	except:
		return HttpResponse(
			json.dumps([{"ok":"no"}]),
			content_type = "application/json"
		)	
def read_usuarios(request):
	retorno = request.session['cache']['usuarios_filtrado'][0:request.session['cache']['usuarios_indx']]
	
	
	print("::::VIEWS___usuarios1:"+str(datetime.now().strftime("%H:%M:%S")))
	return HttpResponse (
		json.dumps(retorno),
		content_type = "application/json"
	)
def read_servicios(request):
	id_sesion = str(request.POST.get('id_sesion', 'No data found'))
	retorno = cruds.read_servicios(id_sesion)
	retorno["return"] = lista_salida =  order_array_items_local(retorno["return"],"fecha_hora",True)
	request.session['cache']['servicios'] = copy.deepcopy(lista_salida)
	return HttpResponse (
		json.dumps(retorno),
		content_type = "application/json"
	)

def read_personas(request):
	ct = str(request.POST.get('ct', 'No data found'))
	id_sesion = str(request.POST.get('id_sesion', 'No data found'))
	print(ct+"::::VIEWS___tm63:"+str(datetime.now().strftime("%H:%M:%S")))
	retorno = cruds.read_personas(id_sesion)

	lista_salida =  order_array_items_local(retorno["return"]["total"],"fecha",True)
	request.session['cache']['contactos'] = copy.deepcopy(lista_salida)
	request.session['cache']['contactos_filtrado'] = copy.deepcopy(lista_salida)
	request.session['cache']['contactos_indx'] = tamanio_listas_def
	retorno['return_total_size'] = len(request.session['cache']['contactos'])

	lista_salida2 =  order_array_items_local(retorno["return"]["seguimiento"],"fecha",True)
	request.session['cache']['usuarios'] = copy.deepcopy(lista_salida2)
	request.session['cache']['usuarios_filtrado'] = copy.deepcopy(lista_salida2)
	request.session['cache']['usuarios_indx'] = len(lista_salida2)

	retorno['return'] = request.session['cache']['contactos_filtrado'][0:request.session['cache']['contactos_indx']]
	
	request.session.modified = True
	print(ct+"::::VIEWS___tm69:"+str(datetime.now().strftime("%H:%M:%S")))
	return HttpResponse (
		json.dumps(retorno),
		content_type = "application/json"
	)

def get_persona(request):
	ct = str(request.POST.get('ct', 'No data found'))
	logging.warning(ct+"::::VIEWS___tm124:"+str(datetime.now().strftime("%H:%M:%S")))
	id = request.POST.get('id', 'No data found')
	print("get_persona....")
	retorno = cruds.get_persona(id);

	return HttpResponse (
		json.dumps(retorno),
		content_type = "application/json"
	)
def get_vacante(request):
	ct = str(request.POST.get('ct', 'No data found'))
	logging.warning(ct+"::::VIEWS___tm124:"+str(datetime.now().strftime("%H:%M:%S")))
	id = request.POST.get('id', 'No data found')
	retorno = cruds.get_vacante(id);

	return HttpResponse (
		json.dumps(retorno),
		content_type = "application/json"
	)
def filter_array_items(request):
	regex_atts = r"\#(.*?)\:"
	lista = str(request.POST.get('lista', 'No data found'))
	filters = request.POST.getlist('filters[]', 'No data found')
	if filters == "No data found":
		filters = []
	param = str(request.POST.get('param', 'No data found'))
	ascval = str(request.POST.get('asc', 'No data found'))
	if ascval == "0":
		asc = True
	else:
		asc = False
	if len(filters) == 0:
		print("sin filtros",str(datetime.now().strftime("%H:%M:%S")))
		param = "fecha"
		request.session['cache'][lista+"_filtrado"] =  order_array_items_local(request.session['cache'][lista],param,asc)
		retorno = {}
		retorno["return"] = request.session['cache'][lista+"_filtrado"][0:request.session['cache'][lista+'_indx']]
		retorno["return_total_size"] = len(request.session['cache'][lista+"_filtrado"])
		request.session.modified = True
		return HttpResponse (
			json.dumps(retorno),
			content_type = "application/json"
		)
	else:
		lista_indxd = {};
		salida = []
		listas = {"documento_completo":{}};
		print("filtrando",str(datetime.now().strftime("%H:%M:%S")),filters)
		for o in request.session['cache'][lista]:
			lista_indxd[o["id"]]= copy.deepcopy(o)
			lista_indxd[o["id"]]["coincidencia"]= 0
			y = json.dumps(o, ensure_ascii=False)
			y = re.sub(', "'," ]] [[ ",y)
			y = re.sub('": '," || ",y)
			y = re.sub('{"',"[[ ",y)
			y = re.sub('}'," ]]",y)
			y = re.sub('"','',y)
			listas["documento_completo"][o["id"]] = y
		print("filtrando 1.0",str(datetime.now().strftime("%H:%M:%S")))
		for o in filters:
			o = o.strip()
			
			if bool(re.match(regex_atts,o)):
				att1 = re.match(regex_atts,o)[1]
				fil1 = logic.normalize_text(o.split(att1+":")[1])

				if att1 != "id":
					cut = 70
				else:
					cut = 99
				
				if att1 not in listas:
					lista_data = {}
					for o in request.session['cache'][lista]:
						if "[[ "+att1+" ||" in o["consolidado"]:
							lista_data[o["id"]] = logic.normalize_text(listas["documento_completo"][o["id"]].split("[[ "+att1+" ||")[1].split("]]")[0])
					listas[att1] = lista_data;
			else:
				cut = 70
				att1 = "documento_completo"
				fil1 = logic.normalize_text(o)

			f = [r for r in process.extract(fil1, listas[att1], scorer = fuzz.token_set_ratio,limit= 300) if r[1] >= cut]
			for w in f:

				if "coincidencia" not in lista_indxd[w[2]]:
					lista_indxd[w[2]]["coincidencia"] = w[1];
				else:
					lista_indxd[w[2]]["coincidencia"] = lista_indxd[w[2]]["coincidencia"]+w[1];
		print("filtrando 1.1",str(datetime.now().strftime("%H:%M:%S")))	
		for key, o in lista_indxd.items():
			o["coincidencia"] = o["coincidencia"]/len(filters)
			if o["coincidencia"] > 40:
				salida.append(o)
		print("filtrando 1.2",str(datetime.now().strftime("%H:%M:%S")))
		request.session['cache'][lista+"_filtrado"] =  order_array_items_local(salida,"coincidencia",0)
		retorno = {}
		retorno["return"] = request.session['cache'][lista+"_filtrado"][0:request.session['cache'][lista+'_indx']]
		retorno["return_total_size"] = len(request.session['cache'][lista+"_filtrado"])
		print("filtrando 1.3",str(datetime.now().strftime("%H:%M:%S")))
		request.session.modified = True
		return HttpResponse (
			json.dumps(retorno),
			content_type = "application/json"
		)
from django.views.decorators.csrf import csrf_exempt

@csrf_exempt			
def test_epayco(request):
	descripcion = str(request.POST.get('x_description', 'No data found'))	
	monto = str(request.POST.get('x_amount', 'No data found'))
	impuesto = str(request.POST.get('x_tax', 'No data found'))
	moneda = str(request.POST.get('x_currency_code', 'No data found'))
	respuesta = str(request.POST.get('x_respuesta', 'No data found'))
	fecha = str(request.POST.get('x_fecha_transaccion', 'No data found'))
	referencia = str(request.POST.get('x_ref_payco', 'No data found'))
	
	fecha = fecha.replace("+"," ")
	fecha = fecha.replace("%3A",":")
	nombre = str(request.POST.get('x_customer_name', 'No data found'))
	mail = str(request.POST.get('x_customer_email', 'No data found'))
	celular = str(request.POST.get('x_customer_movil', 'No data found'))	
	data = {"canal":"Cuenta Epayco","descripcion":descripcion,"monto":monto,"referencia":referencia,"impuesto":impuesto,"moneda":moneda,"respuesta":respuesta,"fecha":fecha,"nombre":nombre,"mail":mail,"celular":celular}
	if respuesta == "Aceptada":
		retorno = integracion_sheets.registro_ingreso_epayco(data)
		return HttpResponse (
			json.dumps({"ok":True}),
			content_type = "application/json"
		)
	else:
		return HttpResponse (
			json.dumps({"ok":False}),
			content_type = "application/json"
		)
def order_array_items(request):
	lista = str(request.POST.get('lista', 'No data found'))
	param = str(request.POST.get('param', 'No data found'))
	ascval = str(request.POST.get('asc', 'No data found'))
	if ascval == "0":
		asc = True
	else:
		asc = False
	request.session['cache'][lista+"_filtrado"] =  order_array_items_local(request.session['cache'][lista+"_filtrado"],param,asc)
	retorno = request.session['cache'][lista+"_filtrado"][0:request.session['cache'][lista+'_indx']]
	request.session.modified = True
	return HttpResponse (
		json.dumps(retorno),
		content_type = "application/json"
	)
def order_array_items_local(lista,param,asc):
	lista = sorted(lista, key=lambda x: x["id"],reverse=True)
	if param == "fecha_hora":
		return sorted(lista, key=lambda x: datetime.strptime(x[param], '%Y-%m-%d %H:%M:%S'),reverse=asc)	
	else:
		return sorted(lista, key=lambda x: str(x[param]),reverse=asc)
def get_more_items(request):
	lista = str(request.POST.get('lista', 'No data found'))
	request.session['cache'][lista+'_indx'] = request.session['cache'][lista+'_indx'] + tamanio_listas_def
	print(request.session['cache'][lista+'_indx'])
	retorno = {}
	retorno['return_total_size'] = len(request.session['cache'][lista])
	
	retorno['return'] = request.session['cache'][lista+"_filtrado"][0:request.session['cache'][lista+'_indx']]
	request.session.modified = True
	return HttpResponse (
		json.dumps(retorno),
		content_type = "application/json"
	)
def read_vacantes(request):
	ct = str(request.POST.get('ct', 'No data found'))
	id_sesion = str(request.POST.get('id_sesion', 'No data found'))
	if id_sesion == '':
		request.session['cache'] = {}
		request.session['cache']['vacantes'] = []
		request.session['cache']['vacantes_filtrado'] = []
		request.session['cache']['vacantes_indx'] = 5
		
	retorno = cruds.read_vacantes(id_sesion)
	lista_salida =  order_array_items_local(retorno["return"],"fecha",True)
	request.session['cache']['vacantes'] = copy.deepcopy(lista_salida)
	request.session['cache']['vacantes_filtrado'] = copy.deepcopy(lista_salida)
	request.session['cache']['vacantes_indx'] = tamanio_listas_def

	retorno['return_total_size'] = len(request.session['cache']['vacantes'])
	retorno['return'] = request.session['cache']['vacantes_filtrado'][0:request.session['cache']['vacantes_indx']]
	
	request.session.modified = True
	return HttpResponse (
		json.dumps(retorno),
		content_type = "application/json"
	)
def get_ciudades(request):
	
	retorno = cruds.read_ciudades();
	return HttpResponse (
		json.dumps(retorno),
		content_type = "application/json"
	)
def read_empresas(request):
	
	retorno = cruds.read_empresas();
	return HttpResponse (
		json.dumps(retorno),
		content_type = "application/json"
	)

def read_configuracion(request):
	
	retorno = cruds.read_configuracion();
	return HttpResponse (
		json.dumps(retorno),
		content_type = "application/json"
	)
def actualizar_integracion(request):
	
	retorno = integracion_sheets.integra_todo();
	return HttpResponse (
		json.dumps(retorno),
		content_type = "application/json"
	)
def create_comentario(request):
	fecha = request.POST.get('fecha', 'No data found')
	texto = request.POST.get('texto', 'No data found')
	id = request.POST.get('id', 'No data found')
	id_et = request.POST.get('id_et', 'No data found')
	id_adm = request.session['data']['data']['id']
	retorno = cruds.crear_comentario(fecha,texto,id,id_et,id_adm)
	return HttpResponse (
		json.dumps(retorno),
		content_type = "application/json"
	)

def eliminar_servicio(request):
	id_s = request.POST.get('id', 'No data found')
	id_u = request.POST.get('id_user', 'No data found')
	print(id_u,id_s)
	retorno = cruds.eliminar_servicio(id_u,"",id_s)
	return HttpResponse (
		json.dumps(retorno),
		content_type = "application/json"
	)
def eliminar_comentario(request):
	id = request.POST.get('id', 'No data found')
	id_et = request.POST.get('id_et', 'No data found')
	id_com = request.POST.get('id_com', 'No data found')
	id_adm = request.session['data']['data']['id']
	retorno = cruds.eliminar_comentario(id,id_et,id_com,id_adm)
	return HttpResponse (
		json.dumps(retorno),
		content_type = "application/json"
	)
def crear_contacto_perfil(request):
	print(".........crear_actualizar_objeto_perfil")
	parametro = request.POST.get('parametro', 'No data found')
	tipo = request.POST.get('tipo', 'No data found')
	etiqueta = request.POST.get('etiqueta', 'No data found')
	id_user = request.POST.get('id_user', 'No data found')
	id_adm = request.session['data']['data']['id']
	retorno = cruds.crear_actualizar_objeto_perfil(parametro,tipo,etiqueta,id_user,id_adm);
	return HttpResponse (
		json.dumps(retorno),
		content_type = "application/json"
	)
def crear_actualizar_objeto(request):
	print(".........crear_actualizar_objeto")
	parametro = request.POST.get('parametro', 'No data found')
	tipo = request.POST.get('tipo', 'No data found')
	etiqueta = request.POST.get('etiqueta', 'No data found')
	id_user = request.POST.get('id_user', 'No data found')
	x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
	ip = ""
	if x_forwarded_for:
		ip = x_forwarded_for.split(',')[0]
	else:
		ip = request.META.get('REMOTE_ADDR')
	print(ip)
	try:
		id_adm = request.session['data']['data']['id']
	except:
		id_adm = -2
	retorno = cruds.crear_actualizar_objeto(parametro,tipo,etiqueta,id_user,id_adm);
	return HttpResponse (
		json.dumps(retorno),
		content_type = "application/json"
	)
def conector_crear_actualizar_etiqueta(request):

	tmp = request.POST.get('tmp', 'No data found')
	etiqueta = request.POST.get('etiqueta', 'No data found')
	id_user = request.POST.get('id_user', 'No data found')
	try:
		id_adm = request.session['data']['data']['id']
	except:
		id_adm = -2
	retorno = cruds.conector_crear_actualizar_etiqueta(tmp,id_user,etiqueta,id_adm);
	return HttpResponse (
		json.dumps(retorno),
		content_type = "application/json"
	)
def request_pass(request):
	mail = request.POST.get('mail', 'No data found')
	retorno = logic.request_pass(mail);
	return HttpResponse (
		json.dumps(retorno),
		content_type = "application/json"
	)
def activacion_usuario(request):
	id = request.POST.get('id', 'No data found')
	retorno = logic.activacion_usuario(id);
	return HttpResponse (
		json.dumps(retorno),
		content_type = "application/json"
	)
def get_recoms(request):
	vac = request.POST.get('vac', 'No data found')
	res = logic.get_recoms(vac)
	return HttpResponse (
		json.dumps({"resultado":res}),
		content_type = "application/json"
	)
def test_textract(request):
	logic.test_textract()
	return HttpResponse (
		json.dumps({"ok":"ok"}),
		content_type = "application/json"
	)
def envio_respuesta_verificacion(request):
	id = request.POST.get('id', 'No data found')
	nivel = request.POST.get('nivel', 'No data found')
	idt = request.POST.get('idt', 'No data found')
	retorno = logic.envio_respuesta_verificacion(id,idt, nivel);
	return HttpResponse (
		json.dumps(retorno),
		content_type = "application/json"
	)
def get_full_user_info(request):
	ct = str(request.POST.get('ct', 'No data found'))
	logging.warning(ct+"::::VIEWS___tm124:"+str(datetime.now().strftime("%H:%M:%S")))
	id = request.POST.get('id_user', 'No data found')
	try:
		retorno = logic.get_full_user_info(id);
	except:
		retorno = {"return":"error"}
	
	return HttpResponse (
		json.dumps(retorno),
		content_type = "application/json"
	)
def solicitud_index(request):
	f = request.POST.get('fecha', 'No data found')
	n = request.POST.get('nombre', 'No data found')
	e = request.POST.get('empresa', 'No data found')
	t = request.POST.get('telefono', 'No data found')
	c = request.POST.get('cargo', 'No data found')
	o = request.POST.get('comentario', 'No data found')
	retorno1 = logic.solicitud_index(n,e,c,o,f)
	retorno2 = integracion_sheets.respuesta_formulario(n,e,c,o,f,t)
	return HttpResponse (
		json.dumps({"r1":retorno1,"r2":retorno2}),
		content_type = "application/json"
	)
def get_profile_linkedin(request):
	
	ct = str(request.POST.get('ct', 'No data found'))
	logging.warning(ct+"::::VIEWS___tmplin:"+str(datetime.now().strftime("%H:%M:%S")))
	url = request.POST.get('url', 'No data found')

	retorno = logic.get_linkedin_profile(url)
	retorno_cr = logic.get_crystal_profile(retorno["pnombre"],retorno["snombre"],retorno["desc"],retorno["expe"])
	salida_def = {"nombre":retorno["nombrec"],"cargo":retorno["cargo"],"empresa":retorno["empresa"],"crystal":retorno_cr["cr"]}
	logging.warning(ct+"::::VIEWS___tm158:"+str(datetime.now().strftime("%H:%M:%S")))
	return HttpResponse (
		json.dumps(salida_def),
		content_type = "application/json"
	)


def get_statistics(request):
	
	ct = str(request.POST.get('ct', 'No data found'))
	logging.warning(ct+"::::VIEWS___tm174:"+str(datetime.now().strftime("%H:%M:%S")))
	print("get_statistics___")
	retorno = logic.get_statistics();
	logging.warning(ct+"::::VIEWS___tm175:"+str(datetime.now().strftime("%H:%M:%S")))
	return HttpResponse (
		json.dumps(retorno),
		content_type = "application/json"
	)
def get_red_filter(request):
	
	ct = str(request.POST.get('ct', 'No data found'))
	logging.warning(ct+"::::VIEWS___tm153:"+str(datetime.now().strftime("%H:%M:%S")))
	id = request.POST.get('id', 'No data found')
	arr = request.POST.getlist('arr[]', 'No data found')
	print(arr)
	print("get_red_filter____",arr,id)
	retorno = logic.buscar_grafo(request.session['network']["links_indxd"],request.session['network']["nodes_indxd"],request.session['network']["adyacencias"],id,arr);
	logging.warning(ct+"::::VIEWS___tm158:"+str(datetime.now().strftime("%H:%M:%S")))
	return HttpResponse (
		json.dumps(retorno),
		content_type = "application/json"
	)

def get_network(request):
	print("haber por aca")
	ct = str(request.POST.get('ct', 'No data found'))
	print(ct+"::::VIEWS___tm125:"+str(datetime.now().strftime("%H:%M:%S")))
	id = request.POST.get('id', 'No data found')
	print("get_network....")
	retorno = logic.get_3level_network(id);
	print(ct+"::::VIEWS___tm126:"+str(datetime.now().strftime("%H:%M:%S")))
	request.session['network'] = retorno
	lista_salida=retorno["data"]
	request.session['cache']['contactos'] = copy.deepcopy(lista_salida)
	request.session['cache']['contactos_filtrado'] = copy.deepcopy(lista_salida)
	request.session['cache']['contactos_indx'] = tamanio_listas_def
	retorno['return_total_size'] = len(request.session['cache']['contactos'])
	retorno['data'] = request.session['cache']['contactos_filtrado'][0:request.session['cache']['contactos_indx']]
	print(ct+"::::VIEWS___tm127:"+str(datetime.now().strftime("%H:%M:%S")))
	return HttpResponse (
		json.dumps({"links":retorno["links"],"nodes":retorno["nodes"],"data":retorno["data"],"return_total_size":retorno['return_total_size']}),
		content_type = "application/json"
	)

def eliminar_etiqueta(request):

	id_user = request.POST.get('id_user', 'No data found')
	id_etiqueta = request.POST.get('id_etiqueta', 'No data found')
	retorno = cruds.eliminar_etiqueta(id_user,id_etiqueta);
	return HttpResponse (
		json.dumps(retorno),
		content_type = "application/json"
	)
