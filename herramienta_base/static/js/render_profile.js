
var stop_words_regex = /(\bvacante\b|\bde\b|\bun\b|\buna\b|\bunas\b|\bunos\b|\buno\b|\bsobre\b|\btodo\b|\btambién\b|\btras\b|\botro\b|\balgún\b|\balguno\b|\balguna\b|\balgunos\b|\balgunas\b|\bser\b|\bes\b|\bsoy\b|\beres\b|\bsomos\b|\bsois\b|\bestoy\b|\besta\b|\bestamos\b|\bestais\b|\bestan\b|\bcomo\b|\ben\b|\bpara\b|\batras\b|\bporque\b|\bpor qué\b|\bestado\b|\bestaba\b|\bante\b|\bantes\b|\bsiendo\b|\bambos\b|\bpero\b|\bpor\b|\bpoder\b|\bpuede\b|\bpuedo\b|\bpodemos\b|\bpodeis\b|\bpueden\b|\bfui\b|\bfue\b|\bfuimos\b|\bfueron\b|\bhacer\b|\bhago\b|\bhace\b|\bhacemos\b|\bhaceis\b|\bhacen\b|\bcada\b|\bfin\b|\bincluso\b|\bprimero\b|\bdesde\b|\bconseguir\b|\bconsigo\b|\bconsigue\b|\bconsigues\b|\bconseguimos\b|\bconsiguen\b|\bir\b|\bvoy\b|\bva\b|\bvamos\b|\bvais\b|\bvan\b|\bvaya\b|\bgueno\b|\bha\b|\btener\b|\btengo\b|\btiene\b|\btenemos\b|\bteneis\b|\btienen\b|\bel\b|\bla\b|\blo\b|\blas\b|\blos\b|\bsu\b|\baqui\b|\bmio\b|\btuyo\b|\bellos\b|\bellas\b|\bnos\b|\bnosotros\b|\bvosotros\b|\bvosotras\b|\bsi\b|\bdentro\b|\bsolo\b|\bsolamente\b|\bsaber\b|\bsabes\b|\bsabe\b|\bsabemos\b|\bsabeis\b|\bsaben\b|\bultimo\b|\blargo\b|\bbastante\b|\bhaces\b|\bmuchos\b|\baquellos\b|\baquellas\b|\bsus\b|\bentonces\b|\btiempo\b|\bverdad\b|\bverdadero\b|\bverdadera\b|\bcierto\b|\bciertos\b|\bcierta\b|\bciertas\b|\bintentar\b|\bintento\b|\bintenta\b|\bintentas\b|\bintentamos\b|\bintentais\b|\bintentan\b|\bdos\b|\bbajo\b|\barriba\b|\bencima\b|\busar\b|\buso\b|\busas\b|\busa\b|\busamos\b|\busais\b|\busan\b|\bemplear\b|\bempleo\b|\bempleas\b|\bemplean\b|\bampleamos\b|\bempleais\b|\bvalor\b|\bmuy\b|\bera\b|\beras\b|\beramos\b|\beran\b|\bmodo\b|\bbien\b|\bcual\b|\bcuando\b|\bdonde\b|\bmientras\b|\bquien\b|\bcon\b|\bentre\b|\bsin\b|\btrabajo\b|\btrabajar\b|\btrabajas\b|\btrabaja\b|\btrabajamos\b|\btrabajais\b|\btrabajan\b|\bpodria\b|\bpodrias\b|\bpodriamos\b|\bpodrian\b|\bpodriais\b|\byo\b|\baquel\b)/g;

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

	},
	watch:{
		ciudad: function(val){
			document.getElementById("ciudad").value = val;
		}
	}
})

var adm = new Vue({
	delimiters:['[[',']]'],
	el: '#div_contenedor_menu',
	data: {
		sesion:{}	
	}
});
var listas_recomendacion = {
	"ciudad":{"objeto":profile,"lista":[]}
}