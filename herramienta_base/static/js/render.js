
var label_vacante = "oportunidad"
var label_contacto = "contacto"
var label_proceso = "proceso";
var max_items_render = 600;
var link_teachable = "https://seligo.teachable.com/courses/657060/lectures/";
//var regex_atts = "\#(.*?)\:";
var permisos_usuario_admin = [0,1,2,9]
var permisos_usuario_seguimiento = [5,6]
var videos = {
	
	"inicio_gente_aleia":{"numero_consejo":2,"titulo":"Crece profesionalmente de una forma diferente","link":"nRA3iUW47QM","k":"perfil_usuario"},
	"inicio_empresa_aleia":{"numero_consejo":2,"titulo":"Crece profesionalmente de una forma diferente","link":"","k":"perfil_usuario"},
	"perfil_usuario":{"numero_consejo":2,"titulo":"Crea una hoja de vida ganadora","link":"","k":"perfil_usuario"},
	"bienvenida":{"numero_consejo":0,"titulo":"Busca empleo de una forma distinta","link":"","k":"bienvenida"},
	"analisis_postulacion":{"numero_consejo":3,"titulo":"Haz tu hoja de vida atractiva","link":"","k":"analisis_postulacion"},
	"postulacion_Aleia":{"numero_consejo":4,"titulo":"Postulate de la mejor forma","link":"","k":"postulacion_Aleia"},
	"representacion_Aleia":{"numero_consejo":5,"titulo":"Haz que vean tu hoja de vida","link":"KJi_9W2iVM4","k":"representacion_Aleia"},
	"job_hacker":{"numero_consejo":6,"titulo":"No pienses que estas solo","link":"","k":"job_hacker"},
	"asesoria_personalizada":{"numero_consejo":7,"titulo":"Asesorate con un experto","link":"","k":"asesoria_personalizada"},
	"analisis_comunicacion":{"numero_consejo":8,"titulo":"Impacta en las entrevistas","link":"","k":"analisis_comunicacion"},
	"capacitate":{"numero_consejo":9,"titulo":"¿Crees que sabes todo lo que debes saber para buscar empleo?","link":"","k":"capacitate"},
	"video_general":{"numero_consejo":1,"titulo":"Aleia es diferente. Usala diferente","link":"","k":"video_general"},
	"index_login":{"numero_consejo":10,"titulo":"¿Cómo buscar empleo?","link":"","k":"index_login"},
	"index_reclutamiento":{"numero_consejo":11,"titulo":"¿Cómo buscar candidatos?","link":"","k":"index_reclutamiento"}
}
var mensajes = {"verificacion_contacto":"Si dejas chequeada la opción 'Quiero que verifique que es mi contacto' le llegará un correo a tu contacto solicitando que confirme que te conoce.<br><br> Esto sirve inicialmente para que Aleia pueda evaluar qué relaciones creadas son reales y qué relaciones no. Esto te sirve a ti y a todos en la red para entablar un networking real con personas que realmente tengan una conexión.<br><br> En segunda instancia sirve para que tus contactos sepan que los estan agregando a Aleia y si se registran puedan agregar sus contactos y tu red crezca exponencialmente, ya que podrías hacer networking en Aleia a traves de tus contactos cercanos.<br><br>Si no tienes el correo de tu contacto o no quieres que la solicitud de confirmación llegue a su correo, puedes crearlo y una vez creado abrir el contacto y darle clic en 'Invitar'.<br><br> Esperamos te sea de mucha utilidad esta funcionalidad.",
"postulacion_oportunidad":"Al seleccionar esta opción, los usuarios de Aleia podrán postularse directo en la plataforma y te llegará al panel de Candidatos-> Mis candidatos guardados la información de los postulantes. Si seleccionas esta opción no tendrás que diligenciar el campo de 'Link externo de publicación'",
"verificacion_contacto_perfil":"Si dejas chequeada la opción 'Quiero que verifique que es mi contacto' le llegará un correo a tu contacto solicitando que confirme que te conoce.<br><br> Esto sirve inicialmente para que Aleia pueda evaluar qué relaciones creadas son reales y qué relaciones no. Esto te sirve a ti y a todos en la red para entablar un networking real con personas que realmente tengan una conexión.<br><br> En segunda instancia sirve para que tus contactos sepan que los estan agregando a Aleia y si se registran puedan agregar sus contactos y tu red crezca exponencialmente, ya que podrías hacer networking en Aleia a traves de tus contactos cercanos.<br><br>Si no tienes el correo de tu contacto o no quieres que la solicitud de confirmación llegue a su correo, puedes crearlo y una vez creado abrir el contacto y darle clic en 'Invitar'.<br><br> Esperamos te sea de mucha utilidad esta funcionalidad.",
"contacto_oculto":"Si seleccionas el check de 'Contacto oculto', este contacto no va a ser visible para nadie que tenga acceso a la red de networking de Aleia, en la opción 'Contactos que puedo llegar a conocer'.",
"contacto_oculto_perfil":"Si seleccionas el check de 'Contacto oculto', este contacto no va a ser visible para nadie que tenga acceso a la red de networking de Aleia, en la opción 'Contactos que puedo llegar a conocer'.",
"cumplimiento_100":"En este campo puedes seleccionar una de estas opciones<br><br><b>Si, quiero ser representado<b><br>Se gastará un crédito en una representación, el equipo de Séligo tomará la última hoja de vida que nos hayas enviado y contactará a la empresa de la vacante que estas cargando para hacerte visible<br><br><b>Si, quiero un análisis de postulación<b><br>Se gastará un crédito en un análisis de postulación, el equipo de Séligo tomará la última hoja de vida que nos hayas enviado y los detalles de la vacante, ya sea que hayas escrito o que estén en el link de la misma, analizará tu probabilidad de ser atractivo para el reclutador y te enviará un informe con las mejores que puedes hacer a tu HV para postularte o solicitar una representación.<br><br>Recuera que si no has enviado tu hoja de vida al equipo o tienes una versión especifica para esta vacante, la puedes envíar a a.gonzalez@seligo.co"}

var stop_words_regex = /(\bvacante\b|\bde\b|\bun\b|\buna\b|\bunas\b|\bunos\b|\buno\b|\bsobre\b|\btodo\b|\btambién\b|\btras\b|\botro\b|\balgún\b|\balguno\b|\balguna\b|\balgunos\b|\balgunas\b|\bser\b|\bes\b|\bsoy\b|\beres\b|\bsomos\b|\bsois\b|\bestoy\b|\besta\b|\bestamos\b|\bestais\b|\bestan\b|\bcomo\b|\ben\b|\bpara\b|\batras\b|\bporque\b|\bpor qué\b|\bestado\b|\bestaba\b|\bante\b|\bantes\b|\bsiendo\b|\bambos\b|\bpero\b|\bpor\b|\bpoder\b|\bpuede\b|\bpuedo\b|\bpodemos\b|\bpodeis\b|\bpueden\b|\bfui\b|\bfue\b|\bfuimos\b|\bfueron\b|\bhacer\b|\bhago\b|\bhace\b|\bhacemos\b|\bhaceis\b|\bhacen\b|\bcada\b|\bfin\b|\bincluso\b|\bprimero\b|\bdesde\b|\bconseguir\b|\bconsigo\b|\bconsigue\b|\bconsigues\b|\bconseguimos\b|\bconsiguen\b|\bir\b|\bvoy\b|\bva\b|\bvamos\b|\bvais\b|\bvan\b|\bvaya\b|\bgueno\b|\bha\b|\btener\b|\btengo\b|\btiene\b|\btenemos\b|\bteneis\b|\btienen\b|\bel\b|\bla\b|\blo\b|\blas\b|\blos\b|\bsu\b|\baqui\b|\bmio\b|\btuyo\b|\bellos\b|\bellas\b|\bnos\b|\bnosotros\b|\bvosotros\b|\bvosotras\b|\bsi\b|\bdentro\b|\bsolo\b|\bsolamente\b|\bsaber\b|\bsabes\b|\bsabe\b|\bsabemos\b|\bsabeis\b|\bsaben\b|\bultimo\b|\blargo\b|\bbastante\b|\bhaces\b|\bmuchos\b|\baquellos\b|\baquellas\b|\bsus\b|\bentonces\b|\btiempo\b|\bverdad\b|\bverdadero\b|\bverdadera\b|\bcierto\b|\bciertos\b|\bcierta\b|\bciertas\b|\bintentar\b|\bintento\b|\bintenta\b|\bintentas\b|\bintentamos\b|\bintentais\b|\bintentan\b|\bdos\b|\bbajo\b|\barriba\b|\bencima\b|\busar\b|\buso\b|\busas\b|\busa\b|\busamos\b|\busais\b|\busan\b|\bemplear\b|\bempleo\b|\bempleas\b|\bemplean\b|\bampleamos\b|\bempleais\b|\bvalor\b|\bmuy\b|\bera\b|\beras\b|\beramos\b|\beran\b|\bmodo\b|\bbien\b|\bcual\b|\bcuando\b|\bdonde\b|\bmientras\b|\bquien\b|\bcon\b|\bentre\b|\bsin\b|\btrabajo\b|\btrabajar\b|\btrabajas\b|\btrabaja\b|\btrabajamos\b|\btrabajais\b|\btrabajan\b|\bpodria\b|\bpodrias\b|\bpodriamos\b|\bpodrian\b|\bpodriais\b|\byo\b|\baquel\b)/g;
var disc_styles ={
	"amarillo":"Los que han interactuado han visto una persona abierta y que le gusta hablar. Mantente muy energico y lleno de buena actitud.",
	"rojo":"Los que han interactuado han visto una persona muy directa y orientada a objetivos. Procura mantener esta actitud cuando hablen.",
	"azul":"Los que han interactuado han visto una persona un poco reservada y rigida. Se muy directo y ve al grano sin rodeos.",
	"verde":"Los que han interactuado han visto una persona muy abierta a ayudar y con bastante calidez. Responde con calidez y amabilidad."
}
var crystal_styles ={
	1:{'code':'Dc','name':'Architect','color':1,'advise':'-Es un rojo asi que  el tiende a dirigir a otros y monitorear de cerca su avance, si tienes experiencias haciendo esto ponlas sobre la mesa ya que vas a generar una empatía a nivel profesional. Cuéntale alguna experiencia monitoreando equipos y obteniendo resultados positivos por medio de esto.\n -Cuestiona practicas ineficientes y no dudes en criticar un producto que no te parezca bueno.\n -Es de comunicación rápida así que llega al punto ágilmente y se conciso. Puedes llegar a perder su atención si divagas o contextualizas mucho así que si te hace una pregunta responde específicamente lo que preguntó.\n - Es muy orientado a resultados así que háblale de que puedes mejorar en su empresa o de qué forma puedes catapultar sus objetivos. \n \n Recuerda muy bien que debes leer su dolor, que es lo que necesita para estar buscando un cargo, más allá de los requerimientos que tengan en la persona es que dolor tienen en la empresa para estar buscando a alguien con tu perfil y pon sobre la mesa alternativas para aliviar ese dolor, el lo va a tomar muy positivamente ya que su comunicación abierta nos permite ser propositivos.'},
	2:{'code':'D','name':'Captain','color':1,'advise':'-Es un rojo asi que se directo y lógico al comunicarte \n - Demuestra seguridad y rapidez en tu comunicación. \n - Identifica experiencias que resalten los resultados finales siendo concreto. \n - Si ves alguna oportunidad debate y refuta sus argumentos, él va a tomar ese reto positivamente.- Habla de una situación de adaptación al cambio y de trabajo rápido.'},
	3:{'code':'Di','name':'Driver','color':1,'advise':'-Es un rojo asi que tiende a ser muy directo en tu comunicación\n - Evita estar callado, toma la iniciativa y habla apasionadamente de tus ideas.\n - Habla en términos de un objetivo que tuviste y de forma muy rápida como lograste el resultado.\n - Proyecta mucha confianza y asertividad.'},
	4:{'code':'DI','name':'Initiator','color':1,'advise':'-Es un rojo asi que debes mostrar tu personalidad y hablar con coraje. \n- Es una persona que le gusta asumir riesgos, dice lo que piensa y lo motivan las oportunidades de hacer algo nuevo y excitante. Con el tenemos que hablar en términos de expectativa y podemos plantear un escenario futuro deslumbrante para captar su atención.\n- Si le hablas en terminos de metas ambiciosas seguramente vamos a generar empatía pero procura ser muy directo acorde al entrenamiento para el contacto con head hunters\n Te recomiendo enviarle un correo comentándole alguna anécdota pequeña de tu trabajo y proyectando ese mismo trabajo a futuro en algo deslumbrante.'},
	
	5:{'code':'Is','name':'Encourager','color':2,'advise':'-Es un amarillo asi que tiende a ser social, cálida y extrovertida con gente nueva. \n - Prefiere la conversación informal a la discusión formal. \n - Ella es habladora, amigable y apreciará que bajes la guardia así que háblale de algo personal o algo que te cueste. \n - Usa un lenguaje expresivo para igualar su entusiasmo natural usando expresiones como maravilloso o increíble.\n - Háblale sobre ideas abstractas en un tono informal, usa humor autocritico.'},
	6:{'code':'SI','name':'Harmonizer','color':2,'advise':'-Es un amarillo asi que es una persona que podríamos llegar a considerar fresca así que relájate bastante hablando con ella\n - Procura conectar profundamente con otros, la motiva el reconocimiento verbal positivo y crear armonía así que cuéntale algo personal tuyo y reconoce su labor. \n - Responde muy bien al optimismo\n - Dale tiempo para hablar, procura no interrumpirla a menos de que vayas a validar algo que ella diga'},
	7:{'code':'Id','name':'Influencer','color':2,'advise':'-Es un amarillo asi que  tiende a confiar en la gente, es muy creativo.\n - Responde positivamente si cambias de tema en la conversación para mantenerla dinámica. \n - Es bastante visual y le motiva el trabajo en equipo y las relaciones sociales.\n - Cuéntale historias personales, ellos van a responder muy positivamente'},
	8:{'code':'I','name':'Motivator','color':2,'advise':'-Es un amarillo asi que es una persona con grandes habilidades comunicativas muy abierta, procura ser muy abierta en tu comunicación, da contexto, cuéntale algo tuyo personal.\n - Puede ser un poco dispersa así que si pierde el foco no te molestes, piérdelo con ella y retoma el tema principal. \n - Busca ser colaborativa y para una comunicación efectiva con ella puedes usar humor auto-crítico y usar descripciones coloridas de lo que hables\n - Le interesa el reconocimiento de pares y la energía social así que háblale dentro de lo posible bien de su trabajo y reconócele su labor\n \n Te recomiendo que le envíes un correo comentándole con mucha energía que cumples con el perfil y que viste su perfil de LinkedIn y te llama la atención ser parte del equipo.'},
	
	9:{'code':'C','name':'Analyst','color':3,'advise':'- Es un azul asi que es una persona muy lógica y un poco cerrada en su comunicación, no va a responder positivamente si le hablas en términos más personales ya que va a sentir que pierdes el foco. \n- Debes ser de comunicación muy clara y efectiva explicando cuál es tu objetivo y por qué, no responde bien a la exageración. \n- No le gusta la ineficiencia y el desperdicio de recursos o tiempo, así que intenta pensar en alguna experiencia que hayas tenido donde optimizaras algún proceso con una estrategia bien definida y especifica.'},
	10:{'code':'Cs','name':'Editor','color':3,'advise':'Es un azul así que se fija mucho en los detalles y las formulas previamente verificadas - Debes mantenerte bastante serio y evitar el sarcasmo, ser muy objetivo y hacerle varias preguntas para mantener su atención, - Te recomiendo contactarlo y comentarle que siempre has tenido buenos resultados, abriendo un espacio para que indague sobre tu experiencia, algo como ¿Crees que mi perfil se puede adaptar a lo que necesitan? - Enfócate en 2 o 3 indicadores que hayas logrado mejorar en tu experiencia y menciónalos de forma abierta, sin mucho detalle, dejando espacio para que quiera averiguar más.'},
	11:{'code':'Cd','name':'Skeptic','color':3,'advise':'- Es un azul asi que es una persona escéptica y se basa mucho en datos previos, debes soportar cada afirmación que hagas con datos o evidencia\n - Enfatiza en tu nivel de experiencia y estudios.\n - Piensa en alguna experiencia donde hayas aplicando conocimiento muy específico para construir o ejecutar algún proceso exitoso.\n - Cuando los contactes coméntale claramente para que lo contactas y que esperas.'},
	12:{'code':'CD','name':'Questioner','color':3,'advise':'- Es un azul asi que es de estructuras un poco rígidas\n - Debes ser muy directo en tu comunicación sin dar mucho contexto.\n - Cuenta alguna experiencia en donde haya implicado una planeación estratégica que acabara en un resultado exitoso'},
	
	13:{'code':'Si','name':'Counselor','color':4,'advise':'- Es un verde asi que habla con amabilidad y dulzura, ella va a responder muy positivamente a este lenguaje\n - Coméntale que te gusta trabajar en grupo.\n - Ella es muy perceptiva respecto a las emociones de los demás.\n - Reconoce su labor y apréciala, ella procura esto en las personas.\n - Si tienes el espacio indaga sobre su vida personal.'},
	14:{'code':'Sc','name':'Planner','color':4,'advise':'- Es un verde asi que el responde bastante bien a la estabilidad y la consistencia, coméntale que buscas eso\n - Aprecia bastante la formalidad\n - Haz feedback de su atención y de su labor, mientras sea constructivo lo va a recibir bastante bien\n - Guía la conversación con preguntas'},
	15:{'code':'SC','name':'Stabilizer','color':4,'advise':'- Es un verde asi que es una persona un poco rígida, muy metódico y de estructuras fijas. \n - Cuando te comuniques con el enfatiza en resultados que hayas tenido en el pasado como indicadores cumplidos o metas alcanzadas\n - Guía la conversación con preguntas y toma el liderazgo ya que probablemente será de pocas palabras\n - Pregúntale por las habilidades que requieren'},
	16:{'code':'S','name':'Supporter','color':4,'advise':'- Es un verde asi que con él hay que ser cálidos y hacer varias preguntas\n - No le gusta llamar la atención y le gusta escuchar, valora mucho la lealtad con la compañía y valora también la confianza a largo plazo. Háblale de esto. \n - Debes proyectar respeto, nunca lo interrumpas, siempre espera a que acabe su idea para decir la tuya .\n - Te recomiendo preguntarle por los retos que están llevando en la empresa, por sus preocupaciones, enfatiza en tu experiencia y en tus títulos y cuando hablen de algún producto enfócate en la estabilidad y seguridad del mismo.'},
	17:{'code':'NaN','name':'NaN','color':5,'advise':'Recuerda que debes generar un contacto asertivo, si es por correo que sea muy corto y que le deje claro la forma en que le puedes facilitar la vida'}
}
var preguntas_sesiones = {1:{"descripcion":"Diagnostico","preguntas":[{"tipo":"texto","texto":"Cuando inició la búsqueda"},{"tipo":"lista","texto":"¿Tiene empleo?","valores":["Si","No"]},{"tipo":"texto","texto":"Edad"},{"tipo":"texto","texto":"Ciudad"},{"tipo":"lista","texto":"Sexo","valores":["Mujer","Hombre","Otro"]},{"tipo":"texto","texto":"Último salario"},{"tipo":"texto","texto":"Salario mínimo que busca"},{"tipo":"texto","texto":"Área de expertiz"},{"tipo":"texto","texto":"Posibilidad de traslado"},{"tipo":"texto","texto":"LinkedIn"},{"tipo":"lista","texto":"¿El perfil esta actualizado?","valores":["Si","No"]},{"tipo":"texto","texto":"Sectores con experienca"},{"tipo":"texto","texto":"Sectores en los que quiere trabajar"},{"tipo":"texto_largo","texto":"Entendimiento del proceso de selección"},{"tipo":"texto","texto":"Último cargo"},{"tipo":"texto","texto":"Última empresa"},{"tipo":"texto","texto":"Cargos principales"},{"tipo":"texto","texto":"Cargos secundarios"},{"tipo":"texto_largo","texto":"Observaciones"}]},
2:{"descripcion":"Sesión 2 Leo","preguntas":[{"tipo":"lista","texto":"¿Cumplió la tarea?","valores":["Si","No","Parcialmente"]},{"tipo":"lista","texto":"Nivel de transferencia","valores":["Inicial","Medio","Alto"]},{"tipo":"lista","texto":"Entrevista tipo tomador de decisión","valores":["Inicial","Medio","Alto"]},{"tipo":"lista","texto":"Habilidad para describir los know's","valores":["Inicial","Medio","Alto"]},{"tipo":"lista","texto":"Calidad del contenido de la CV","valores":["Inicial","Medio","Alto"]},{"tipo":"texto_largo","texto":"Observaciones"}]},
3:{"descripcion":"Sesión 3 Leo","preguntas":[{"tipo":"lista","texto":"¿Se cumplió la tarea?","valores":["Si","No","Parcialmente"]},{"tipo":"texto_largo","texto":"Keywords del hacer"},{"tipo":"texto_largo","texto":"Keywords de herramientas, programas y normas"},{"tipo":"lista","texto":"Descripción del Know - How","valores":["Inicial","Medio","Alto"]},{"tipo":"lista","texto":"Descripción del Know - Be","valores":["Inicial","Medio","Alto"]},{"tipo":"texto","texto":"Perfil"},{"tipo":"texto_largo","texto":"Observaciones"}]},
4:{"descripcion":"Sesión 4 Juan","preguntas":[{"tipo":"lista","texto":"¿Se cumplió la tarea?","valores":["Si","No","Parcialmente"]},{"tipo":"lista","texto":"Perfil predominante DISC","valores":["Rojo","Amarillo","Azul","Verde"]},{"tipo":"texto_largo","texto":"Patrón de comportamiento"},{"tipo":"texto_largo","texto":"Prácticas actuales de networking"},{"tipo":"texto_largo","texto":"Red directa"},{"tipo":"texto_largo","texto":"Red proximal"},{"tipo":"texto","texto":"Nicho ideal"},{"tipo":"texto","texto":"¿Qué dolores debe tener ese nicho?"},{"tipo":"texto","texto":"Elección de tipo de contenido principal"},{"tipo":"texto_largo","texto":"Observaciones"}]},
5:{"descripcion":"Sesión 5 Leo","preguntas":[{"tipo":"lista","texto":"¿Se cumplió la tarea?","valores":["Si","No","Parcialmente"]},{"tipo":"lista","texto":"¿Entregables completos?","valores":["Si","No","Parcialmente"]},{"tipo":"lista","texto":"Ejecución","valores":["Estructurada","Semiestructurada","En proceso"]},{"tipo":"lista","texto":"Marca personal","valores":["Estructurada","Semiestructurada","En proceso"]},{"tipo":"texto_largo","texto":"Observaciones"}]},
6:{"descripcion":"Sesión Final","preguntas":[{"tipo":"lista","texto":"¿Se cumplió la tarea?","valores":["Si","No","Parcialmente"]},{"tipo":"texto_largo","texto":"¿Qué compromisos se hacen sobre la estrategia?"},{"tipo":"texto_largo","texto":"Elementos que necesitan profundización"},{"tipo":"texto_largo","texto":"Observaciones"}]}}

var config = {
	"13":{
		"color":"#a87dff",
		"nombre":"Natalia"
	},
	"10":{
		"color":"#c2e876",
		"nombre":"Laura"
	},
	"2":{
		"color":"#ff917d",
		"nombre":"Vanessa"

	},
	"oportunidad":
	{
		"color":"#D1D8EB",
		"color_texto":color_default,
		"nombre":"vacante",
		"nombre_plural":"vacantes",
		"div":"oportunidad"
	},
	"contacto":
	{
		"color":"#dfc4e5",
		"color_texto":color_default,
		"nombre":"contacto",
		"nombre_plural":"contactos",
		"div":"contacto"
	},
	"contacto_perfil":
	{
		"color":"#dfc4e5",
		"color_texto":color_default,
		"nombre":"contacto con analisis de perfil",
		"nombre_plural":"contactos",
		"div":"contacto_perfil"
	},
	"contacto_masivo":
	{
		"color":"#dfc4e5",
		"color_texto":color_default,
		"nombre":"varios contactos",
		"nombre_plural":"varios contactos",
		"div":"contacto_masivo"
	},
	"login":
	{
		"div":"login",
		"nombre":"cuenta"
	},
	"proceso":
	{
		"color":"#c2d3c6",
		"color_texto":"#187b2f",
		"nombre":"entrevista",
		"nombre_plural":"entrevista",
		"div":"proceso"
	},
	"observacion":
	{
		"color":"#eeeeee",
		"color_texto":color_default,
		"nombre":"observacion",
		"nombre_plural":"observaciones",
		"div":"observacion"
	},
	"sesion":
	{
		"color":"#eeeeee",
		"color_texto":color_default,
		"nombre":"sesion",
		"nombre_plural":"sesiones",
		"div":"sesion"
	},
	"job_hacker":
	{
		"color":"#eeeeee",
		"color_texto":color_default,
		"nombre":"job hacker",
		"nombre_plural":"job hackers",
		"div":"job_hacker"
	}
}
var tipos_usuarios = {
	1: "Job Hacker",
	0: "Job Hacker interno",
	2: "Usuario interno",
	4: "Usuario",
	5: "Usuario programa",
	6: "Usuario Compensar",
	7: "Usuario Job Searcher",
	8: "Usuario Freemium",
	9: "Usuario Convenio",
	10:"Usuario Colombo",
	11:"Usuario Sesión",
	13:"Usuario Empresa"
}
var niveles_networking = {
	1:{"texto":"Deconocido","color":"#e3e3e3"},
	2:{"texto":"Conocido","color":"#f7a17eb3"},
	3:{"texto":"Confianza","color":"#ece36de0"},
	4:{"texto":"Muy cercano","color":"#aed9bbb3"}
}
var niveles_cercania = {
	0:{"color":"white","colort":"#244c32"},
	1:{"color":"#c8afce","colort":"#5a3563"},
	2:{"color":"#e0c090","colort":"#614105"},
	3:{"color":"#127bce","colort":"#083c65"}
}
var tipos_procesos = {1:{"texto":"Entrevista con equipo de selección","color":"#e3e3e3"},
2:{"texto":"Entrevista con gerente de RRHH","color":"#f7a17eb3"},
3:{"texto":"Entrevista con jefe directo","color":"#f6f0a7e0"},
4:{"texto":"Entrevista con cargo directivo","color":"#aed9bbb3"},
5:{"texto":"Postulación de Séligo","color":"white"},
6:{"texto":"Vacante cerrada","color":"white"},
7:{"texto":"Contratado","color":"white"}
}
var tipo_oportunidad = {
	1:{"texto":"Contrato de tiempo completo"},
	2:{"texto":"Consultoria / Freelancing"},
	4:{"texto":"Otro"}
}
var limites_tiempo = {
	0:"#3eda678c",
	3:"#eabe1e8c",
	5:"#f4433694"
}
var estados = {
	"activo":"#508de1",
	"contratado":"#10b710",
	"pendiente":"#de0808",
	"suspendido":"#b1b1b1"
}
var tiempos_vacantes = {
	0:"#f4433694",
	1:"#eabe1e8c",
	2:"#3eda678c"
}
var rangos_calificacion = {
	0:"#f4433694",
	6:"#eabe1e8c",
	8:"#3eda678c"
}


var month = new Array();
month[0] = "Ene";
month[1] = "Feb";
month[2] = "Mar";
month[3] = "Abr";
month[4] = "May";
month[5] = "Jun";
month[6] = "Jul";
month[7] = "Ago";
month[8] = "Sep";
month[9] = "Oct";
month[10] = "Nov";
month[11] = "Dic";
var columnas_metricas = [];
function order_array_desc(arr,param){
	return arr.sort((a, b) => (standarize_attribute(a[param]) < standarize_attribute(b[param])) ? 1 : (standarize_attribute(a[param]) === standarize_attribute(b[param])) ? ((a["id"] < b["id"]) ? 1 : -1) : -1 )
}
function order_array_asc(arr,param){
	return arr.sort((a, b) => (standarize_attribute(a[param]) > standarize_attribute(b[param])) ? 1 : (standarize_attribute(a[param]) === standarize_attribute(b[param])) ? ((a["id"] > b["id"]) ? 1 : -1) : -1 )
}
function tiempo_desde_fecha(fecha){

	var dias = Math.round((new Date()-new Date(fecha))/(1000*60*60*24));
	if(dias == 0){
		return "hoy";
	}
	if(dias < 30){
		if(dias < 7){
			return dias+" d";
		}
		return Math.round(dias/7)+" s";

	}else{
		return Math.round(dias/30)+" m";
	}
}

function calular_columnas_metricas(){
	var date = new Date();
	var day = date.getDay();
	var prevMonday = new Date();
	if(date.getDay() == 0){
		prevMonday.setDate(date.getDate() - 7);
	}
	else{
		prevMonday.setDate(date.getDate() - (day-1));
	}
	var fmn = new Date();
	fmn.setDate(prevMonday.getDate() - 14);
	var ffd = new Date();

	ffd.setDate(prevMonday.getDate() -8);

	var d1 = [fmn.toISOString().substring(0,10),ffd.toISOString().substring(0,10)]
	var smn = new Date()
	smn.setDate(prevMonday.getDate()-7)
	var sfd = new Date();
	sfd.setDate(prevMonday.getDate() -1)
	var d2 = [smn.toISOString().substring(0,10),sfd.toISOString().substring(0,10)]
	var tmn = prevMonday;
	var tfd = new Date();
	tfd.setDate(prevMonday.getDate() +6)
	var d3 = [tmn.toISOString().substring(0,10),tfd.toISOString().substring(0,10)]
	columnas_metricas = [d1,d2,d3]
}

var mixin  = {
	

	methods:{
		get_texto_resultados(res,tot){
			if(res == tot){
				return (tot > 1)?tot+" resultados.":tot+" resultado";
			}
			if(res == 0){
				return "No se encontraron resultados."
			}
			if(res < tot){
				return (res > 1)?res+" resultados encontrados de "+tot+".":res+" resultado encontrado de "+tot+".";
			}
		},
		get_link_acotado(link){
			var size = 50;
			return (link.length > size)?"Link: "+link.substring(0,size)+"...":"Link: "+link;
		},
		get_info_red(i,arr,t){
			var size = 45;
			var nom_ttt="";
			var nom_sss="";
			if(i > 0){
				var s = arr[i-1].n;
			}
			for(const o in conlis_red.network.nodes){
				if(conlis_red.network.nodes[o].id == t){
					nom_ttt = conlis_red.network.nodes[o].name.split("---")[0];
				}
				if(conlis_red.network.nodes[o].id == s){
					nom_sss = conlis_red.network.nodes[o].name.split("---")[0];
				}
			}
			var nombret = (nom_ttt.length> size)?"Contacta a "+nom_ttt.substring(0,size)+"...":"Contacta a "+nom_ttt;
			if(i == 0){
				return {"s":" contigo","t":nombret};
			}else{

				//var s = arr[i-1].n;
				console.log(arr,s)
				var nombres = " con "+nom_sss.split(" ")[0];
				return {"s":nombres,"t":nombret}
			}
		},
		get_info_complemento(i,label){
			switch(label){

				case "pnombre":
				return i.split(" ")[0];
				break;
				case label_contacto:
				return niveles_networking[i];
				break;
				case label_vacante:
				if(i+"" == "true"){
					return {"texto":"Protegido","color":"#e9fff0"}
				}
				break;
				case "usuario":
				var ret = {}
				var txt = (parseInt(i) == 1)?"dia":"dias";
				var lim_inf = 0;
				var num = (Math.round(parseInt(i)) > 15)?"15++ ":""+Math.round(parseInt(i));
				for(var o in limites_tiempo){
					if(parseInt(i) >= o){
						ret = {"texto":num,"color":limites_tiempo[o]}
					}
				}
				return ret;
				break;
				case "estado":
				return {"texto":i,"color":estados[i]};
				break;
				case "vacantes":
				var ret = {};
				for(var o in tiempos_vacantes){
					if(parseInt(i) >= o){
						ret = {"texto":i,"color":tiempos_vacantes[o]}
					}
				}
				return ret;
				break;
				case "calificacion":
				if(i+"" == "-1"){
					return {"texto":"--","color":"white"}
				}
				var ret = {};
				for(var o in rangos_calificacion){
					if(parseInt(i) >= o){
						ret = {"texto":Math.round(i),"color":rangos_calificacion[o]}
					}
				}
				return ret;
				break;
			}

			return {"texto":"","color":"white"}
		},
		get_color_etiqueta(i){

			var color = config[i];

			if(color == null){color = color_default;
			}
			else{color = color.color_texto;
			}
			return color;
		},
		valid_url(str){
			var pattern = new RegExp('^(https?:\\/\\/)?((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|((\\d{1,3}\\.){3}\\d{1,3}))(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*(\\?[;&a-z\\d%_.~+=-]*)?');
			return !!pattern.test(str);
		}
	},
	computed:{
		
		contenidos:function(){
			return videos
		},
		sesion:function(){
			return app.sesion;
		},
		usuario:function(){
			return app.usuario;
		},
		total_items:function(){
			var cuenta = 0;
			
			return cuenta;
		}
	}
};
var app = new Vue({
	mixins: [mixin],
	delimiters: ['[[', ']]'],
	data: {
		sesion:{"data":{"admin":-1,"id":-1,"tipo":-1}},
		usuario:{"nombre":""},
		vacantes: [],
		personas : [],
		indxd_vacantes: {},
		indxd_personas : {},
		empresas : []
	}
	,
	computed:{
		etiquetas:function (){
			return conlis_objetos_vac.lista["vacantes"].concat(conlis_objetos_con.lista["contactos"]);
		}
	},
	methods:{

		get_etiquetas_info(etiquetas){
			listas_recomendacion["vacantes"].lista = [];

			conlis_objetos_vac.lista["vacantes"] = []
			conlis_objetos_con.lista["contactos"] = []
			conlis_novedades.lista["novedades"] = []
			var sesiones = {};
			var obj_tmp = {};
			for(var o in etiquetas){
				obj_tmp = {};
				//etiquetas[o].consolidado="[[label||"+etiquetas[o].label+"]]"
				switch(etiquetas[o].label){
					case "contacto":
					//obj_tmp = this.indxd_personas[etiquetas[o].id_objeto]
					//if(obj_tmp){
						//etiquetas[o].data = obj_tmp;
						//etiquetas[o].consolidado+= etiquetas[o].data.consolidado+"[[nivel||"+etiquetas[o].nivel+"]]";
						etiquetas[o].titulo = etiquetas[o].data.nombre;
						etiquetas[o].valor = etiquetas[o].data.ultimo_cargo;
						etiquetas[o].valor2 =  etiquetas[o].data.ultima_empresa;
						etiquetas[o].valor3 =  "";
						etiquetas[o].complemento = parseInt(etiquetas[o].nivel);
						etiquetas[o].link = (typeof etiquetas[o].data.linkedin == "undefined")?"":(""+etiquetas[o].data.linkedin).trim();
					//}else{
					//	etiquetas[o].valor = "Recarga para ver esta información...";
					//}
					conlis_objetos_con.lista["contactos"].push(etiquetas[o]);
					break;
					case "oportunidad":
					
					etiquetas[o].oculta = etiquetas[o].data.oculta;
					//etiquetas[o].consolidado+= etiquetas[o].data.consolidado;
					etiquetas[o].titulo = etiquetas[o].data.cargo;
					etiquetas[o].valor = etiquetas[o].data.empresa;
					etiquetas[o].valor2 = (etiquetas[o].cumple == true)?"Servicio asociado":(etiquetas[o].cumple == false)?"":"Servicio asociado";//"Salario entre "+obj_tmp.rango_menor+" y "+obj_tmp.rango_mayor;
					etiquetas[o].valor3 =  etiquetas[o].data.ciudad;
					etiquetas[o].complemento = etiquetas[o].protegido;
					etiquetas[o].keywords = etiquetas[o].data.keywords;
					etiquetas[o].link = (typeof etiquetas[o].data.link == "undefined")?"":(""+etiquetas[o].data.link).trim()
					listas_recomendacion["vacantes"].lista.push(etiquetas[o].data.cargo+" -- "+etiquetas[o].data.empresa)
					//}else{
					//	etiquetas[o].valor = "Recarga para ver esta información...";
					//}
					conlis_objetos_vac.lista["vacantes"].push(etiquetas[o]);
					break;
					case "proceso":
					etiquetas[o].keywords = []
					//if(obj_tmp){
					//etiquetas[o].data_vacante = obj_tmp;
					//etiquetas[o].consolidado+= etiquetas[o].data_vacante.consolidado+"[[tipo_proceso||"+etiquetas[o].tipo_proceso+"]]";
					try{
						etiquetas[o].titulo = tipos_procesos[etiquetas[o].tipo_proceso].texto+" para "+etiquetas[o].data_vacante.cargo;
					}catch(e){
						etiquetas[o].titulo = "Entrevista";
					}
					etiquetas[o].valor = etiquetas[o].data_vacante.empresa;
					etiquetas[o].valor2 = "";
					etiquetas[o].valor3 =  etiquetas[o].data_vacante.ciudad;
					etiquetas[o].complemento = etiquetas[o].tipo_proceso;
					etiquetas[o].link = (typeof etiquetas[o].data_vacante.link == "undefined")?"":(""+etiquetas[o].data_vacante.link).trim()

					//}else{
					//	etiquetas[o].valor = "Recarga para ver esta información...";
					//}
					//obj_tmp = {};
					//obj_tmp = this.indxd_personas[etiquetas[o].id_persona];
					//if(obj_tmp){
					//etiquetas[o].data_persona = obj_tmp;
					//etiquetas[o].consolidado += etiquetas[o].data_persona.consolidado;
					etiquetas[o].valor2 = "Persona a cargo: "+etiquetas[o].data_persona.nombre+". "+etiquetas[o].data_persona.ultimo_cargo

					//}
					conlis_objetos_vac.lista["vacantes"].push(etiquetas[o]);
					break;
					case "observacion":
					//etiquetas[o].consolidado+="[[ observacion ||"+etiquetas[o].valor+"]]"
					
					conlis_novedades.lista["novedades"].push(etiquetas[o]);
					break;
					case "sesion":
					//etiquetas[o].consolidado = "";
					if(!sesiones.hasOwnProperty(etiquetas[o].id_sesion)){
						sesiones[etiquetas[o].id_sesion] = etiquetas[o].valor;
					}else{
						sesiones[etiquetas[o].id_sesion] += "\n"+etiquetas[o].valor;
					}
					break;
				}
				
				
				
			}
			var arr_sesiones = [];
			for(var o in sesiones){
				arr_sesiones.push({"titulo":preguntas_sesiones[parseInt(o)].descripcion,"sesion":parseInt(o),"contenido":sesiones[o]});
			}
			conlis_info_usuario.lista["contactos"] = order_array_desc(conlis_objetos_con.lista["contactos"],"fecha");
			conlis_info_usuario.lista["vacantes"] = order_array_desc(conlis_objetos_vac.lista["vacantes"],"fecha");
			conlis_info_usuario.lista["novedades"] = order_array_desc(conlis_novedades.lista["novedades"],"fecha")
			conlis_objetos_con.lista["contactos"] = order_array_desc(conlis_objetos_con.lista["contactos"],"fecha");
			conlis_objetos_vac.lista["vacantes"] = order_array_desc(conlis_objetos_vac.lista["vacantes"],"fecha");
			conlis_sesiones.sesiones = arr_sesiones;
			console.log("etiquetas asociadas correctamente");
			
		}
	}
});

calular_columnas_metricas();
var color_default = "#EEEEEE";

var popup_many = new Vue({
	delimiters:['[[',']]'],
	el: '#div_contenedor_popup_share',
	data: {
		label:"",
		id:-1,
		titulo:"",
		subtitulo : "",
		usuarios:[],
		usuarios_filtrado:[],
		usuarios_seleccionados:[]
	}
})
var popup = new Vue({
	mixins: [mixin],
	delimiters:['[[',']]'],
	el: '#div_contenedor_popup_perfil'
});

var popup = new Vue({
	mixins: [mixin],
	delimiters:['[[',']]'],
	el: '#div_contenedor_popup',
	data: {
		id:-1,
		label:"",
		logros:"",
		obj_rutas:{},
		id_et:-1,
		id_et_del:-1,
		link_invita:"",
		contenido:"",
		texto_contenido:"",
		imagen:"",
		estado_copy:"Copiar",
		titulo:"",
		subtitulo:"",
		subtitulo2:"",
		titulo_texto1:"",
		titulo_texto2:"",
		titulo_texto3:"",
		datos_contacto:"",
		perfil_usuario :"",
		ultimo_login:"",
		rango_salario :"",
		tipo_oportunidad:"",
		ciudad :"",
		area :"",
		sector :"",
		subsector :"",
		profesion :"",
		comentarios:[],
		texto1:"",
		keywords:[],
		texto2:"",
		texto3:"",
		link:"",
		rutas:[],
		nodos_intermedios:[],
		sesion:{"data":{"admin":-1,"id":-1}}
	},
	
	methods:{
		get_tipo_usuario(i){
			return tipos_usuarios[i]
		},
		valid_url(str){
			var pattern = new RegExp('^(https?:\\/\\/)?'+ 
				'((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ 
				'((\\d{1,3}\\.){3}\\d{1,3}))'+ 
				'(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ 
				'(\\?[;&a-z\\d%_.~+=-]*)?'); 
			return !!pattern.test(str);
		}
	},
	computed:{
		pnombre:function (){
			return this.titulo.split(" ")[0];
		}
	}
})
var normalize = (function() {
	var from = "ÃÀÁÄÂÈÉËÊÌÍÏÎÒÓÖÔÙÚÜÛãàáäâèéëêìíïîòóöôùúüûÑñÇç", 
	to   = "AAAAAEEEEIIIIOOOOUUUUaaaaaeeeeiiiioooouuuunncc",
	mapping = {};

	for(var i = 0, j = from.length; i < j; i++ )
		mapping[ from.charAt( i ) ] = to.charAt( i );

	return function( str ) {
		str = str.toString().trim().toLowerCase();
		var ret = [];
		for( var i = 0, j = str.length; i < j; i++ ) {
			var c = str.charAt( i );
			if( mapping.hasOwnProperty( str.charAt( i ) ) )
				ret.push( mapping[ c ] );
			else
				ret.push( c );
		}      
		return ret.join( '' );
	}

})();





var popup_servicios = new Vue({
	delimiters:['[[',']]'],
	mixins: [mixin],
	el: '#div_contenedor_popup_servicios',
	data: {
		titulo:"",
		tipo_user:"",
		id_et:"",
		postulando:0,
		id:"",
		label:"",
		tipo:"",
		postulacion:"",
		link:"",
		id_user:0
	}
});
var adm = new Vue({
	delimiters:['[[',']]'],
	mixins: [mixin],
	el: '#div_contenedor_menu',
	data: {
		job_hackers:[],
		tipo:-2
	},
	computed:{
		nombre_usuario:function(){
			return (app.usuario.id == app.sesion.data.id)?"Hola "+app.usuario.nombre.split(" ")[0]:"Traza de "+app.usuario.nombre;
		}
	},
	methods:{
		get_tipo_usuario(i){
			return tipos_usuarios[i]
		}
	}
});

var popup_recom =new Vue({
	mixins: [mixin],
	delimiters:['[[',']]'],
	el: '#div_contenedor_iframe_hv',
	data: {
		id:""
	}
	
});
var recoms = new Vue({
	mixins: [mixin],
	delimiters:['[[',']]'],
	el: '#contenedor_candidatos',
	data: {
		resultados:[],
		guardados:[]
	}
	
});
var banner1 = new Vue({
	mixins: [mixin],
	delimiters:['[[',']]'],
	el: '#banner_opciones_desktop'
});
var servicios = new Vue({
	delimiters: ['[[', ']]'],
	mixins: [mixin],
	el: '#banner_servicios',
	data: {
		servicios:[],
		total_servicios:0
	},
	computed:{
		creditos:function(){
			if(app.usuario.representaciones+"".trim() != "" && typeof app.usuario.representaciones != "undefined"){
				if(parseInt(app.usuario.representaciones) > 0){
					if(parseInt(app.usuario.representaciones) == 1){
						return 1
					}else{
						return app.usuario.representaciones;
					}
				}else if(parseInt(app.usuario.representaciones) < 0){
					return "Ilimitados";
				}else if(parseInt(app.usuario.representaciones) == 0){
					return 0;
				}
			}else{
				return 0;
			}
		}
	},
	watch:{
		servicios: function(val){
			console.log(val)
			console.log(servicios.servicios)
			for(var i =0;i< val.length;i++){
				switch(val[i].tipo){
					case "representacion":
					//var data = get_vacante_cb(val[i].id_vacante)
					val[i].desc = "Representación";
					//val[i].data1 = data["cargo"];
					//val[i].data2 = data["empresa"];
					break;
					case "analisis_postulacion":
					//var data = get_vacante_cb(val[i].id_vacante)
					val[i].desc = "Revisión de hoja de vida";
					//val[i].data1 = data["cargo"];
					//val[i].data2 = data["empresa"];
					break;
					case "analisis_comunicacion":
					//var data = get_vacante_cb(val[i].id_vacante)
					//var datap = get_persona_cb(val[i].id_contacto)
					val[i].desc = "Análisis de comunicación";
					//val[i].data1 = datap["nombre"]+", "+datap["ultimo_cargo"];
					//val[i].data2 = data["cargo"]+" en "+data["empresa"];
					break;
				}
				
			}
		}
	}
});
var formulario = new Vue({
	mixins: [mixin],
	delimiters: ['[[', ']]'],
	el: '#contenedor_right',
	
	data: {
		data_usuario:{},
		sesion_seleccionada:1,
		recomendaciones:[],
		recom_sel:-1,
		csv_preview:[],
		csv_mensajes:[],
		archivos:""
	},
	computed:{
		sesion:function(){
			return app.sesion;
		},
		usuario:function(){
			return app.usuario;
		},
		preguntas: function () {
			var sals = preguntas_sesiones[parseInt(this.sesion_seleccionada)].preguntas;
			for(var i in this.etiquetas){
				if(this.etiquetas[i].label == "sesion" && this.etiquetas[i].id_sesion == this.sesion_seleccionada){
					for(var j in sals){
						if(sals[j].texto.toLowerCase().trim() == this.etiquetas[i].valor.split(":")[0].trim().toLowerCase()){
							sals[j].valor_prev = this.etiquetas[i].valor.split(this.etiquetas[i].valor.split(":")[0]+":")[1].trim();
						}
					}
				}
			}
			return sals;

		}
	}
});

/*var conlis_stats = new Vue({
	el:"#contenedor_estadisticas",
	mixins: [mixin],
	delimiters: ['[[', ']]'],
	data:{
		total_usuarios:0,
		contenido:link_teachable+videos["networking"].id,
		texto_contenido:videos["networking"].titulo_video,
		numeros_stats:{"entrevistas":{"tot":0,"avg":0},"contactos":{"tot":0,"avg":0}}
	},
	computed:{
		etiquetas:function (){
			return conlis_objetos_vac.lista["vacantes"].concat(conlis_objetos_con.lista["contactos"]);
		},
		datos:function(){
			
			console.log("____datos_conlis_stats");
			var salida = [{"x":"Conocido","y":0,"i":2},{"x":"Confianza","y":0,"i":3},{"x":"Muy cercano","y":0,"i":4}];

			for(var i =0;i<this.etiquetas.length;i++){
				if(this.etiquetas[i].label == "contacto" && this.etiquetas[i].nivel > 1){
					salida[this.etiquetas[i].nivel-2].y+=1
				}
			}
			return salida;

		},
		usuario:function(){
			return app.usuario;
		},
		sesion:function(){
			return app.sesion;
		},
		nombre_usuario:function(){
			return app.usuario.nombre.split(" ")[0];
		},
		metricas:function(){
			//PENDIENTE OPTIMIZACIÓN!!!
			var datos = {};
			console.log("calculando metricas adm,...",columnas_metricas.length,app.vacantes.length,adm.job_hackers.length)
			for(var o in app.vacantes){
				for(var i = 0 ; i<columnas_metricas.length;i++){
					if(string2date(app.vacantes[o].fecha) >= string2date(columnas_metricas[i][0]) &&
						string2date(app.vacantes[o].fecha) <= string2date(columnas_metricas[i][1])){
						for(var u in adm.job_hackers){

							if(app.vacantes[o].id_user == adm.job_hackers[u].id_db){
								if(!(adm.job_hackers[u].id in datos)){
									datos[adm.job_hackers[u].id] = new Array(columnas_metricas.length).fill(0)
								}
								datos[adm.job_hackers[u].id][i]+=1;
							}
						}
					}
				}
			}
			var columnas_metricas_texto = new Array(columnas_metricas.length); 
			for(var o in columnas_metricas){
				columnas_metricas_texto[o] = month[string2date(columnas_metricas[o][0]).getMonth()]+" "+string2date(columnas_metricas[o][0]).getDate()+" - "+
				month[string2date(columnas_metricas[o][1]).getMonth()]+" "+string2date(columnas_metricas[o][1]).getDate();
			}
			return {"columnas":columnas_metricas_texto,
			"datos":datos};
		}
	}
});*/
var conlis_job_hacker = new Vue({
	mixins: [mixin],
	delimiters: ['[[', ']]'],
	el: '#contenedor_left_admin',
	data: {
		filtros:[],
		order:"",
		div:"buscador_items_admin",
		lista:{"usuarios":[],"otros_usuarios":[]},
		compuerta:"and",
		server_identifier:"usuarios",
		indices_lista:{"total_usuarios":0}

	},/*
	watch:{
		lista:function() {
			conlis_stats.total_usuarios = 0;
			
			console.log("extrayendo colis_stats total usuarios")
			if((app.usuario.tipo == 0 || app.usuario.tipo == 1 || app.usuario.tipo == 2) && app.usuario.usuario.trim() != ""){
				for(var j =0; j<app.personas.length;j++){
					

					if(permisos_usuario_seguimiento.includes(app.personas[j].tipo)){
						conlis_stats.total_usuarios++;
						if(app.personas[j].job_hacker == app.usuario.usuario){
							tmp_arr.push(app.personas[j])
						}else{
							tmp_arr2.push(app.personas[j]);
						}
					}
				}
				return {"usuarios":order_array_desc(tmp_arr,"dias_ultimo_dato"),"otros_usuarios":order_array_desc(tmp_arr2,"dias_ultimo_dato")};

			}else if(app.usuario.tipo == 9){
				for(var j =0; j<app.personas.length;j++){
					

					if(app.personas[j].tipo == 6){
						conlis_stats.total_usuarios++;
						tmp_arr.push(app.personas[j])
						
					}
				}
				return {"usuarios":order_array_desc(tmp_arr,"dias_ultimo_dato"),"otros_usuarios":order_array_desc(tmp_arr2,"dias_ultimo_dato")};

			}
			return {"usuarios":[],"otros_usuarios":[]};
		}
	},*/
	computed:{
		
		sesion:function(){
			return app.sesion;
		},
		usuario:function(){
			return app.usuario;
		}
	}
});
var conlis_red = new Vue({
	mixins: [mixin],
	delimiters: ['[[', ']]'],
	el: '#contenedor_red',
	data: {
		filtros:[],
		order:"",
		att_tmp:"",
		network:{},
		lista_atributos:{"contactos":["nombre","telefono","mail","linkedin","area","ultimo_cargo","ultima_empresa","crystal"]},
		graficarntw:true,
		div:"buscador_red",
		lista:{"personas":[]},
		indxd_personas_red : {},
		compuerta:"and"
	},
	computed:{
		sesion:function(){
			return app.sesion;
		},
		usuario:function(){
			return app.usuario;
		}
	}
});
var video = new Vue({
	delimiters: ['[[', ']]'],
	el: '#div_contenedor_video',
	data: {
		id_video :"439024581",
		titulo_video:"",
		descripcion_video:"",
		videos:videos,
		link:""
	},
	watch:{
		id_video: function(val){
			$('#vm-player').load(function(e) { vmPlayer.api('play'); });
		}
	}
});
try{
var contenidos = new Vue({
	delimiters: ['[[', ']]'],
	el: '#contenedor_contenidos',
	data: {
		videos: videos
	},
	methods:{

		show_popup_video:show_popup_video
	}
});
}catch(e){
	console.log("no se por que falla")
}
var conlis_objetos_admin = new Vue({
	mixins: [mixin],
	delimiters: ['[[', ']]'],
	el: '#contenedor_busquedas_admin',
	data: {
		filtros:[],
		order:"fecha",
		asc:0,
		att_tmp:"",
		lista_atts_filtro:{"Filtros:":[{"id":"empresa","texto":"Empresa vacante"},
		{"id":"id","texto":"Id"},
		{"id":"cargo","texto":"Cargo vacante"},
		{"id":"ciudad","texto":"Ciudad"},
		{"id":"link","texto":"Link vacante"},
		{"id":"nombre","texto":"Nombre contacto"},
		{"id":"ultima_empresa","texto":"Empresa contacto"},
		{"id":"ultimo_cargo","texto":"Cargo contacto"},
		{"id":"obs","texto":"Descripción vacante"}]},

		lista_atts_orden:{"Orden:":[{"id":"empresa","texto":"Empresa vacante","asc":1},
		{"id":"fecha","texto":"Fecha","asc":0},
		{"id":"cargo","texto":"Cargo vacante","asc":1},
		{"id":"ciudad","texto":"Ciudad","asc":1},
		{"id":"rango_menor","texto":"Salario vacante","asc":0},
		{"id":"nombre","texto":"Nombre contacto","asc":1},
		{"id":"ultima_empresa","texto":"Empresa contacto","asc":1},
		{"id":"ultimo_cargo","texto":"Cargo contacto","asc":1},
		{"id":"coincidencia","texto":"Coincidencia","asc":0}]},
		div:"buscador_objetos_admin",
		server_identifier:"admin",
		lista:{"vacantes":[],"contactos":[]},
		indices_lista:{"total_vacantes":0,"total_contactos":0},
		compuerta:"and"

	},
	computed:{
		sesion:function(){
			return app.sesion;
		},
		usuario:function(){
			return app.usuario;
		}
	}
});

var conlis_info_usuario = new Vue({
	mixins: [mixin],
	delimiters: ['[[', ']]'],
	el: '#contenedor_info_usuario',
	data: {
		filtros:[],
		order:"fecha",
		asc:0,
		att_tmp:"",
		lista_atts_filtro:{"Filtros:":[{"id":"empresa","texto":"Empresa vacante"},
		{"id":"cargo","texto":"Cargo vacante"},
		{"id":"ciudad","texto":"Ciudad"},
		{"id":"link","texto":"Link vacante"},
		{"id":"nombre","texto":"Nombre contacto"},
		{"id":"ultima_empresa","texto":"Empresa contacto"},
		{"id":"ultimo_cargo","texto":"Cargo contacto"},
		{"id":"obs","texto":"Descripción vacante"}]},

		lista_atts_orden:{"Orden:":[{"id":"empresa","texto":"Empresa vacante","asc":1},
		{"id":"fecha","texto":"Fecha","asc":0},
		{"id":"cargo","texto":"Cargo vacante","asc":1},
		{"id":"ciudad","texto":"Ciudad","asc":1},
		{"id":"rango_menor","texto":"Salario vacante","asc":0},
		{"id":"nombre","texto":"Nombre contacto","asc":1},
		{"id":"ultima_empresa","texto":"Empresa contacto","asc":1},
		{"id":"ultimo_cargo","texto":"Cargo contacto","asc":1},
		{"id":"coincidencia","texto":"Coincidencia","asc":0}]},
		div:"buscador_objetos_vac",
		lista:{"vacantes":[],"contactos":[],"novedades":[]},
		compuerta:"and"

	},
	computed:{
		sesion:function(){
			return app.sesion;
		},
		usuario:function(){
			return app.usuario;
		}
	}
});
var conlis_novedades = new Vue({
	mixins: [mixin],
	delimiters: ['[[', ']]'],
	el: '#contenedor_novedades',
	data: {
		filtros:[],
		order:"fecha",
		asc:0,
		att_tmp:"",
		div:"buscador_contenedor_novedades",
		lista:{"novedades":[]},
		compuerta:"and"

	},
	computed:{
		sesion:function(){
			return app.sesion;
		},
		usuario:function(){
			return app.usuario;
		}
	}
});
var conlis_objetos_vac = new Vue({
	mixins: [mixin],
	delimiters: ['[[', ']]'],
	el: '#contenedor_busquedas_vacantes',
	data: {
		filtros:[],
		server_identifier:"vacantes",
		order:"fecha",
		asc:0,
		att_tmp:"",
		lista_atts_filtro:{"Filtros:":[{"id":"empresa","texto":"Empresa"},
		{"id":"cargo","texto":"Cargo"},
		{"id":"ciudad","texto":"Ciudad"},
		{"id":"link","texto":"Link"},
		{"id":"obs","texto":"Descripción"}]},

		lista_atts_orden:{"Orden:":[{"id":"empresa","texto":"Empresa","asc":1},
		{"id":"fecha","texto":"Fecha","asc":0},
		{"id":"cargo","texto":"Cargo","asc":1},
		{"id":"ciudad","texto":"Ciudad","asc":1},
		{"id":"rango_menor","texto":"Salario","asc":0},
		{"id":"coincidencia","texto":"Coincidencia","asc":0}]},
		div:"buscador_objetos_vac",
		lista:{"vacantes":[],"full_vacantes":[]},
		indices_lista:{"total_vacantes":0,"total_full_vacantes":0},
		compuerta:"and"

	},
	computed:{
		sesion:function(){
			return app.sesion;
		},
		usuario:function(){
			return app.usuario;
		}
	}
});
var conlis_objetos_con = new Vue({
	mixins: [mixin],
	delimiters: ['[[', ']]'],
	el: '#contenedor_busquedas_contactos',
	data: {
		filtros:[],
		order:"fecha",
		asc:0,
		server_identifier:"contactos",
		att_tmp:"",
		lista_atts_filtro:{"Filtros:":[{"id":"nombre","texto":"Nombre"},
		{"id":"telefono","texto":"Teléfono"},
		{"id":"cargos_aplica","texto":"Perfil"},
		{"id":"ciudad","texto":"Ciudad"},
		{"id":"sector","texto":"Sector"},
		{"id":"mail","texto":"Mail"},
		{"id":"linkedin","texto":"LinkedIn"},
		{"id":"ultimo_cargo","texto":"Cargo"},
		{"id":"ultima_empresa","texto":"Empresa"}]},

		lista_atts_orden:{"Orden:":[{"id":"nombre","texto":"Nombre","asc":1},
		{"id":"ultimo_cargo","texto":"Cargo","asc":1},
		{"id":"ultima_empresa","texto":"Empresa","asc":1},
		{"id":"coincidencia","texto":"Coincidencia","asc":0}]},

		div:"buscador_objetos_con",
		lista:{"contactos":[],"full_contactos":[]},
		indices_lista:{"total_contactos":0,"total_full_contactos":0},
		compuerta:"and",
		total_items:0

	},
	computed:{
		sesion:function(){
			return app.sesion;
		},
		usuario:function(){
			return app.usuario;
		},
		num_contactos:function(){
			return (this.lista["contactos"].filter(x => x.nivel > 1)).length;
		}
	}
});
var conlis_sesiones = new Vue({
	mixins: [mixin],
	delimiters: ['[[', ']]'],
	el: '#contenedor_sesiones',
	data: {
		
		sesiones:[]

	},
	computed:{
		sesion:function(){
			return app.sesion;
		},
		usuario:function(){
			return app.usuario;
		}
	}
});

var contenedores_listas = [conlis_info_usuario,conlis_job_hacker,conlis_objetos_vac,conlis_objetos_con,conlis_sesiones,conlis_objetos_admin]

var listas_recomendacion = {
	"ciudad":{"objeto":formulario,"lista":[]},
	"vacantes":{"objeto":formulario,"lista":[]}
}
check_session();