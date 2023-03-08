var mensajes = {"perfil_empresa":"Si obtienes un perfil de empresa podrás tener acceso gratuito a toda la base de personas en Aleia y a sus datos de contacto GRATIS.<br>También las vacantes que subas tendrán mayor visibilidad para los usuarios y podrás tener acceso a los servicios de reclutamiento GRATUITO de Séligo.<br><br>Para obtener este perfil un asesor te contactará para validar tus datos y activarte como empresa. Hasta entonces tendrás el perfil de persona, en el que podrás subir vacantes ilimitadamente y aparecerán a todos nuestros usuarios.","codigo":"Si pagaste algún servicio con nosotros ingresa el número de transacción en este campo para que podamos verificar tu pago y agendar tu sesión de ingreso al servicio."}

var getParams = function (url) {
    var params = {};
    var parser = document.createElement('a');
    parser.href = url;
    var query = parser.search.substring(1);
    var vars = query.split('&');
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        params[pair[0]] = decodeURIComponent(pair[1]);
    }
    return params;
};
trans = getParams(window.location.href);
if(trans.hasOwnProperty("type")){
    if(trans.type == "registro"){
        document.getElementById("login_datos").style.display = "none";
        document.getElementById("registro_datos").style.display = "block";
        
    }
}
function perfil_empresa() {
    if(document.getElementById("perfil_empresa").value == "true"){
        document.getElementById("div_telefono").style.display = "block";
        document.getElementById("div_empresa").style.display = "block";
    }else{
        document.getElementById("div_telefono").style.display = "none";
        document.getElementById("div_empresa").style.display = "none";
        
    }
    
}

async function show_message_popup(o,fix=false,msj=""){
    if(fix){
        document.getElementById("mensaje_popup_pregunta").innerHTML = msj;
    }else{
        var id = o.parentNode.getElementsByTagName("input")[0].id;
        if (id == ""){
            id = o.parentNode.getElementsByTagName("select")[0].id;
        }
        document.getElementById("mensaje_popup_pregunta").innerHTML = mensajes[id];
    }
    document.getElementById("div_contenedor_popup_pregunta").style.display="block";
    await sleep(100);
    document.getElementById("div_contenedor_popup_pregunta").classList.remove("hide");
    document.getElementById("div_contenedor_popup_pregunta").classList.add("show");
}
function show_password(o){
    if(o.parentNode.getElementsByTagName("input")[0].type == "password"){
        o.parentNode.getElementsByTagName("input")[0].type = "text";
        o.getElementsByClassName("showp")[0].style.display = "none";
        o.getElementsByClassName("hidep")[0].style.display = "block";
    }else{
        o.parentNode.getElementsByTagName("input")[0].type = "password";
        o.getElementsByClassName("showp")[0].style.display = "block";
        o.getElementsByClassName("hidep")[0].style.display = "none";
    }
}
async function close_popup(o){
    var tmp = o.parentNode.parentNode;
    
    tmp.classList.remove("show");
    tmp.classList.add("hide");
    await sleep(100);
    tmp.style.display="none";
}
function request_pass(){
    
    $.ajax({
        url:"EPE/request_pass",
        type:'POST',
        async: false,
        data:{
            "mail":document.getElementById("mail_pass").value                
        },
        success: function(ret){
            console.log(ret)
            var sol = ret;
            
            if(sol.return == "ok"){
                document.getElementById("mensaje_popup").innerHTML = "Se ha enviado la contraseña al correo "+document.getElementById("mail_pass").value+". Revisa tu badeja de entrada o tu bandeja de spam."
            }else{
                document.getElementById("mensaje_popup").innerHTML = "El correo "+document.getElementById("mail_pass").value+" no existe en Aleia.";
            }
            document.getElementById("mail_pass").value = "";
            
        },
        error: function(xhr, errmsg, err) {
            document.getElementById("mensaje_popup").innerHTML = "Error no controlado";
        }
        
    });
    
}
async function forgot_pass(){
    document.getElementById("div_contenedor_popup").style.display="block";
    await sleep(100);
    document.getElementById("div_contenedor_popup").classList.remove("hide");
    document.getElementById("div_contenedor_popup").classList.add("show");
}
async function mostrar_mensaje_flotante(tipo,texto){
    await show_loading(false,"");
    switch(tipo){
        case "ok":
        document.getElementById("mensaje_flotante").classList.remove("nolike");
        document.getElementById("mensaje_flotante").classList.add("like");
        break;
        case "error":
        document.getElementById("mensaje_flotante").classList.remove("like");
        document.getElementById("mensaje_flotante").classList.add("nolike");
        break;
        default:
        document.getElementById("mensaje_flotante").classList.remove("like");
        document.getElementById("mensaje_flotante").classList.remove("nolike");
    }
    document.getElementById("texto_mensaje_flotante").innerHTML = texto;
    document.getElementById("mensaje_flotante").classList.remove("hide");
    await sleep(5000);
    document.getElementById("mensaje_flotante").classList.add("hide");
    if(tipo == "ok"){
        accion = "";
        
        //close_contenedor("contenedor_right");
    }
    
    
}
async function show_loading(i,texto){
	
	if(i){
		document.getElementById("loading").className="loading_show";
		document.getElementById("texto_loading").innerHTML = texto;
		await sleep(200);
	}else{
		document.getElementById("loading").className="loading_hide";
		document.getElementById("texto_loading").innerHTML = "";
		await sleep(200);
	}
	
}

function validar_formulario(){
    if(document.getElementsByName("nombre")[0].value.trim() == ""){
        mostrar_mensaje_flotante("error","Debes diligenciar tu nombre");
        return false;
    }
    if(document.getElementsByName("mail")[0].value.trim() == ""){
        mostrar_mensaje_flotante("error","Debes diligenciar tu correo. A este mail enviaremos tu link de activación");
        return false;
    }
    if(document.getElementsByName("pass")[0].value.trim() == ""){
        mostrar_mensaje_flotante("error","Debes crear una contraseña");
        return false;
    }
    return true;
}
$(function(){
    $('#registro_form').submit(registro)
});
async function registro(e){
    e.preventDefault();
    if(validar_formulario()){
        await show_loading(true,"Creando usuario");
        var form_data = new FormData($('#registro_form').get(0));	
        
        $.ajax({
            url:'EPE/registro_usuario',
            type:'POST',
            cache: false,
            processData: false,  
            contentType: false  ,
            enctype:"multipart/form-data",
            data:form_data,
            success: async function(ret){
                show_loading(false,"");
                console.log(ret)
                var sol = ret.return;
                if(sol.accion == "repeat"){
                    mostrar_mensaje_flotante("error","El correo ingresado ya tiene un usuario asociado. Inicia sesión con ese correo")
                }else{
                    show_message_popup(null,true,"¡Nos alegra mucho que hagas parte de Aleia!<br><br>Con el fin de validar que eres el dueño del correo que registraste, en unos segundos te deberá llegar un mail con el asunto 'Activación cuenta de Aleia' donde deberás dar clic en el link para activar tu cuenta. <br><br>Si no sigues estos pasos no podrás ingresar a la plataforma.")
                    document.getElementById("nombre").value = ""
                    document.getElementById("mail").value = "";
                    document.getElementById("pass").value = "";
                    
                    document.getElementById("linkedin").value = "";
                }
                
            },
            error: function(xhr, errmsg, err) {
                show_loading(false,"");
                mostrar_mensaje_flotante("error","Error no controlado. Intentalo mas tarde.");
            }
        });
    }
}
/*
function registro(){
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); 
    var yyyy = today.getFullYear();
    
    today = yyyy + '-' + mm + '-' + dd;
    parametro = "nombre[["+document.getElementById("nombre").value+
    "]]mail[["+document.getElementById("mail").value+
    "]]pass[["+document.getElementById("pass").value+
    "]]linkedin[["+document.getElementById("linkedin").value+
    "]]perfil_empresa[["+document.getElementById("perfil_empresa").value+
    "]]telefono[["+document.getElementById("telefono").value+
    "]]empresa[["+document.getElementById("empresa").value+
    "]]fecha[["+today+"]]";
    $.ajax({
        url:"EPE/crear_actualizar_objeto",
        type:'POST',
        async: false,
        data:{
            "parametro":parametro,
            "tipo":"crear_usuario",
            "etiqueta":-2,
            "id_user":-2
        },
        success: function(ret){
            var sol = JSON.parse(ret).return;
            if(sol.accion == "repeat"){
                mostrar_mensaje_flotante("error","El correo ingresado ya tiene un usuario asociado. Inicia sesión con ese correo")
            }else{
                show_message_popup(null,true,"¡Nos alegra mucho que hagas parte de Aleia!<br><br>Con el fin de validar que eres el dueño del correo que registraste, en unos segundos te deberá llegar un mail con el asunto 'Activación cuenta de Aleia' donde deberás dar clic en el link para activar tu cuenta. <br><br>Si no sigues estos pasos no podrás ingresar a la plataforma.")
                document.getElementById("nombre").value = ""
                document.getElementById("mail").value = "";
                document.getElementById("pass").value = "";
                
                document.getElementById("linkedin").value = "";
            }
            
        }
    });
    
}
*/
$.ajax({
    url:'EPE/check_session',
    type:'POST',
    async: false,
    data:{ 'ok':'ok'},
    success: function(ret){
        console.log("sesion verificada...",ret)
        if(ret.id == "" || ret.error == "si"){
            console.log("no hay sesion")
            
        }else{
            window.location.href = "/"
        }
    },
    error: function(xhr, errmsg, err) {
        document.getElementById("mensaje_error").innerHTML= "Error no controlado";
    }
    
});
show_loading(false,"")