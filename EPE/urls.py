from django.urls import path
from django.conf.urls import url
from django.views.decorators.csrf import csrf_exempt
from django.views.generic import TemplateView

from . import views

urlpatterns = [
path('', views.index, name='index'),

url(r'^/enviar_pregunta', csrf_exempt(views.logic_preguntas.enviar_pregunta), name = 'enviar_pregunta'),
url(r'^/enviar_respuesta', csrf_exempt(views.logic_preguntas.enviar_respuesta), name = 'enviar_respuesta'),


url(r'^/get_more_items', csrf_exempt(views.get_more_items), name = 'get_more_items'),
url(r'^/script', csrf_exempt(views.script), name = 'script'),


url(r'^/read_postulaciones_usuario', csrf_exempt(views.read_postulaciones_usuario), name = 'read_postulaciones_usuario'),

url(r'^/acepta_acuerdo', csrf_exempt(views.acepta_acuerdo), name = 'acepta_acuerdo'),
url(r'^/registro_usuario', csrf_exempt(views.registro_usuario), name = 'registro_usuario'),
url(r'^/envia_vacante', csrf_exempt(views.envia_vacante), name = 'envia_vacante'),
url(r'^/actualiza_vacante_monday', csrf_exempt(views.actualiza_vacante_monday), name = 'actualiza_vacante_monday'),

url(r'^/test_textract', csrf_exempt(views.test_textract), name = 'test_textract'),
url(r'^/get_recoms', csrf_exempt(views.get_recoms), name = 'get_recoms'),
url(r'^/postulacion', csrf_exempt(views.postulacion), name = 'postulacion'),

url(r'^/validate_session', csrf_exempt(views.validate_session), name = 'validate_session'),
url(r'^/order_array_items', csrf_exempt(views.order_array_items), name = 'order_array_items'),
url(r'^/filter_array_items', csrf_exempt(views.filter_array_items), name = 'filter_array_items'),
url(r'^/eliminar_servicio', csrf_exempt(views.eliminar_servicio), name = 'eliminar_servicio'),


url(r'^/update_info_vacante_sheet', csrf_exempt(views.update_info_vacante_sheet), name = 'update_info_vacante_sheet'),
url(r'^/loading_service', csrf_exempt(views.loading_service), name = 'loading_service'),
url(r'^/servicio_sin_archivo', csrf_exempt(views.servicio_sin_archivo), name = 'servicio_sin_archivo'),


url(r'^/solicitud_index', csrf_exempt(views.solicitud_index), name = 'solicitud_index'),

url(r'^/activacion_usuario', csrf_exempt(views.activacion_usuario), name = 'activacion_usuario'),
url(r'^/request_pass', csrf_exempt(views.request_pass), name = 'request_pass'),
url(r'^/enviar_datos_perfil', csrf_exempt(views.guarda_datos_perfil), name = 'guarda_datos_perfil'),
url(r'^/envio_respuesta_verificacion', csrf_exempt(views.envio_respuesta_verificacion), name = 'envio_respuesta_verificacion'),

url(r'^/satisfaccion_sesiones', csrf_exempt(views.satisfaccion_sesiones), name = 'satisfaccion_sesiones'),

url(r'^/satisfaccion_programa', csrf_exempt(views.satisfaccion_programa), name = 'satisfaccion_programa'),
url(r'^/get_login', csrf_exempt(views.get_login), name = 'get_login'),
url(r'^/check_session', csrf_exempt(views.check_session), name = 'check_session'),
url(r'^/cerrar_sesion', csrf_exempt(views.cerrar_sesion), name = 'cerrar_sesion'),


url(r'^/get_last_cv', csrf_exempt(views.get_last_cv), name = 'get_last_cv'),

url(r'^/test_epayco', csrf_exempt(views.test_epayco), name = 'test_epayco'),


url(r'^/create_comentario', csrf_exempt(views.create_comentario), name = 'create_comentario'),
url(r'^/eliminar_comentario', csrf_exempt(views.eliminar_comentario), name = 'eliminar_comentario'),
url(r'^/get_persona', csrf_exempt(views.get_persona), name = 'get_persona'),
url(r'^/get_vacante', csrf_exempt(views.get_vacante), name = 'get_vacante'),

url(r'^/read_personas', csrf_exempt(views.read_personas), name = 'read_personas'),
url(r'^/read_usuarios', csrf_exempt(views.read_usuarios), name = 'read_usuarios'),
url(r'^/read_servicios', csrf_exempt(views.read_servicios), name = 'read_servicios'),
url(r'^/read_vacantes', csrf_exempt(views.read_vacantes), name = 'read_vacantes'),
url(r'^/read_empresas', csrf_exempt(views.read_empresas), name = 'read_empresas'),
url(r'^/read_configuracion', csrf_exempt(views.read_configuracion), name = 'read_configuracion'),
url(r'^/crear_actualizar_objeto', csrf_exempt(views.crear_actualizar_objeto), name = 'crear_actualizar_objeto'),


url(r'^/crear_contacto_perfil', csrf_exempt(views.crear_contacto_perfil), name = 'crear_contacto_perfil'),

url(r'^/get_full_user_info', csrf_exempt(views.get_full_user_info), name = 'get_full_user_info'),
url(r'^/get_network', csrf_exempt(views.get_network), name = 'get_network'),
url(r'^/get_statistics', csrf_exempt(views.get_statistics), name = 'get_statistics'),
url(r'^/get_red_filter', csrf_exempt(views.get_red_filter), name = 'get_red_filter'),
url(r'^/get_ciudades', csrf_exempt(views.get_ciudades), name = 'get_ciudades'),
url(r'^/get_profile_linkedin', csrf_exempt(views.get_profile_linkedin), name = 'get_profile_linkedin'),


url(r'^/eliminar_etiqueta', csrf_exempt(views.eliminar_etiqueta), name = 'eliminar_etiqueta'),
url(r'^/actualizar_integracion', csrf_exempt(views.actualizar_integracion), name = 'actualizar_integracion'),
url(r'^/conector_crear_actualizar_etiqueta', csrf_exempt(views.conector_crear_actualizar_etiqueta), name = 'conector_crear_actualizar_etiqueta')
]