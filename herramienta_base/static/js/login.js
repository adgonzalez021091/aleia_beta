function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}
function iniciar_sesion(){
	var user = document.getElementById("usuario").value;
	var pass = document.getElementById("password").value;
	validar_usuario(user,pass);
}
function validar_usuario(user,pass){
	
	$.ajax({
		url:'EPE/get_login',
		type:'POST',
		data:{ 'user': user,'pass':pass},
		success: async function(ret){
			ret = JSON.parse(ret)["retorno"]
			if(ret.error == true){
				console.log("error");
				document.getElementById("div_mensaje_error").style.display="block";
				document.getElementById("mensaje_error").innerHTML= ret.mensaje;
			}else{
				console.log("okok");
				document.getElementById("div_mensaje_error").style.display="none";
				window.location.href = '/'
			}

		},
		error: async function(xhr, errmsg, err) {
			console.log("error2");
			document.getElementById("div_mensaje_error").style.display="block";
			document.getElementById("mensaje_error").innerHTML= "Error no controlado";
			
		}
	});
}