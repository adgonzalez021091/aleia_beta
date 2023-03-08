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