
var stop_words_regex = /(\bvacante\b|\bde\b|\bun\b|\buna\b|\bunas\b|\bunos\b|\buno\b|\bsobre\b|\btodo\b|\btambién\b|\btras\b|\botro\b|\balgún\b|\balguno\b|\balguna\b|\balgunos\b|\balgunas\b|\bser\b|\bes\b|\bsoy\b|\beres\b|\bsomos\b|\bsois\b|\bestoy\b|\besta\b|\bestamos\b|\bestais\b|\bestan\b|\bcomo\b|\ben\b|\bpara\b|\batras\b|\bporque\b|\bpor qué\b|\bestado\b|\bestaba\b|\bante\b|\bantes\b|\bsiendo\b|\bambos\b|\bpero\b|\bpor\b|\bpoder\b|\bpuede\b|\bpuedo\b|\bpodemos\b|\bpodeis\b|\bpueden\b|\bfui\b|\bfue\b|\bfuimos\b|\bfueron\b|\bhacer\b|\bhago\b|\bhace\b|\bhacemos\b|\bhaceis\b|\bhacen\b|\bcada\b|\bfin\b|\bincluso\b|\bprimero\b|\bdesde\b|\bconseguir\b|\bconsigo\b|\bconsigue\b|\bconsigues\b|\bconseguimos\b|\bconsiguen\b|\bir\b|\bvoy\b|\bva\b|\bvamos\b|\bvais\b|\bvan\b|\bvaya\b|\bgueno\b|\bha\b|\btener\b|\btengo\b|\btiene\b|\btenemos\b|\bteneis\b|\btienen\b|\bel\b|\bla\b|\blo\b|\blas\b|\blos\b|\bsu\b|\baqui\b|\bmio\b|\btuyo\b|\bellos\b|\bellas\b|\bnos\b|\bnosotros\b|\bvosotros\b|\bvosotras\b|\bsi\b|\bdentro\b|\bsolo\b|\bsolamente\b|\bsaber\b|\bsabes\b|\bsabe\b|\bsabemos\b|\bsabeis\b|\bsaben\b|\bultimo\b|\blargo\b|\bbastante\b|\bhaces\b|\bmuchos\b|\baquellos\b|\baquellas\b|\bsus\b|\bentonces\b|\btiempo\b|\bverdad\b|\bverdadero\b|\bverdadera\b|\bcierto\b|\bciertos\b|\bcierta\b|\bciertas\b|\bintentar\b|\bintento\b|\bintenta\b|\bintentas\b|\bintentamos\b|\bintentais\b|\bintentan\b|\bdos\b|\bbajo\b|\barriba\b|\bencima\b|\busar\b|\buso\b|\busas\b|\busa\b|\busamos\b|\busais\b|\busan\b|\bemplear\b|\bempleo\b|\bempleas\b|\bemplean\b|\bampleamos\b|\bempleais\b|\bvalor\b|\bmuy\b|\bera\b|\beras\b|\beramos\b|\beran\b|\bmodo\b|\bbien\b|\bcual\b|\bcuando\b|\bdonde\b|\bmientras\b|\bquien\b|\bcon\b|\bentre\b|\bsin\b|\btrabajo\b|\btrabajar\b|\btrabajas\b|\btrabaja\b|\btrabajamos\b|\btrabajais\b|\btrabajan\b|\bpodria\b|\bpodrias\b|\bpodriamos\b|\bpodrian\b|\bpodriais\b|\byo\b|\baquel\b)/g;
var mixin  = {
	components: { Multiselect: window.VueMultiselect.default },
	
	methods:{
		isNumber ($event) {
			//console.log($event.keyCode); //keyCodes value
			let keyCode = ($event.keyCode ? $event.keyCode : $event.which);
			if ((keyCode < 48 || keyCode > 57)) { // 46 is dot
				$event.preventDefault();
			}
		},
		get_texto_servicio(servicio){
			if(servicio in textos_servicios){
				return textos_servicios[servicio].texto;
			}else{
				return "Postulación abierta"
			}
		},
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
		},
		copiar_texto: function(txt,event){
			try{
				if(txt.trim() != ""){
					var $temp = $("<textarea>");
					$("body").append($temp);
					$temp.val(txt).select();
					document.execCommand("copy");
					$temp.remove();
					mostrar_mensaje_flotante("ok",txt+" copiado!");
				}
			}catch(x){
				mostrar_mensaje_flotante("error","Error al copiar");
			}
		}
	},
	computed:{
		options_sueldo:function(){
			return options_sueldo
		},
		contenidos:function(){
			return videos
		},
		sesion:function(){
			return app.sesion;
		},
		servicios:function(){
			return app.servicios;
		},
		creditos:function(){
			return app.creditos;
		},
		usuario:function(){
			
			var tmp = app.usuario;
			
			return tmp;
		},
		total_items:function(){
			var cuenta = 0;
			
			return cuenta;
		}
	}
};

var profile = new Vue({
	delimiters:['[[',']]'],
	el: '#contenedor_profile',
	data: {
		name :"",
		id:"",
		usuario:"",
		estado:"",
		fecha:"",
		telefono:"",
		mail:"",
		linkedin:"",
		logros:"",
		area:"",
		aspiracion_min:"",
		aspiracion_max:"",
		contenedor_profile:"",
		ciudad:"",
		sector:"",
		subsector:"",
		tipo:"",
		cargos_aplica:"",
		sesion_seleccionada:1,
		recomendaciones:[],
		recom_sel:-1

	}
})

var adm = new Vue({
	delimiters:['[[',']]'],
	mixins: [mixin],
	el: '#div_contenedor_menu',
	data: {
		sesion:{}	
	}
});
var listas_recomendacion = {
	"ciudad":{"objeto":profile,"lista":[]}
}