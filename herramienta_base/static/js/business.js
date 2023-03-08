var busqueda = "";
var imagenes_popup = {"contacto":"static/imgs/menu/user2.png","oportunidad":"static/imgs/menu/job.png","proceso":"static/imgs/menu/interview.png"}

var alerta = true;
async function alerta_func(){
  if(document.getElementById("alerta_manual_aleja") != null){
    while(alerta){

      await sleep(1000);
      if(document.getElementById("alerta_manual_aleja").className.includes("show")){
        document.getElementById("alerta_manual_aleja").classList.add("hide");  
        document.getElementById("alerta_manual_aleja").classList.remove("show");
      }else{
        document.getElementById("alerta_manual_aleja").classList.add("show");  
        document.getElementById("alerta_manual_aleja").classList.remove("hide");
      }

    }
  }
}
async function visualiza_hv(o){
  var id_file= o.id.split("____")[0]
  popup_recom.id = o.id.split("____")[1]
$( '#iframe_hv' ).attr( 'src', function ( i, val ) { return 'https://drive.google.com/file/d/'+id_file+'/preview'; });
document.getElementById("div_contenedor_iframe_hv").style.display="block";
  await sleep(100);
  document.getElementById("div_contenedor_iframe_hv").classList.remove("hide");
  document.getElementById("div_contenedor_iframe_hv").classList.add("show");
 
}
function guardar_eliminar_candidato_popup(o,accion){
  if(accion == "eliminar"){
    eliminar_candidato_recoms(o);
  }else if(accion == "guardar"){
    guardar_candidato_recoms(o);
    
  }
  close_popup(13);
}
function guardar_candidato_recoms(o){
  var id = o.id.split("candidato_")[1]
  for(var o in recoms.resultados){
    if(recoms.resultados[o].id == id){
      var x = recoms.resultados[o];
      recoms.resultados.splice(o,1);
      recoms.guardados.push(x);
      break;
    }
  }
}
function eliminar_candidato_recoms(o){
  var id = o.id.split("candidatoe_")[1]
  for(var o in recoms.resultados){
    if(recoms.resultados[o].id == id){
      var x = recoms.resultados[o];
      recoms.resultados.splice(o,1);
      
      break;
    }
  }
}
function eliminar_candidato_guardado(o){
  var id = o.id.split("candidatog_")[1]
  for(var o in recoms.guardados){
    if(recoms.guardados[o].id == id){
      var x = recoms.guardados[o];
      recoms.guardados.splice(o,1);
      
      break;
    }
  }
}
alerta_func();
async function habilitar_opciones_et(o,label,accion_data,event){
  event.stopPropagation();
  document.getElementById("div_contenedor_popup_servicios").style.display="block";
  await sleep(100);
  document.getElementById("div_contenedor_popup_servicios").classList.remove("hide");
  document.getElementById("div_contenedor_popup_servicios").classList.add("show");
  document.getElementById("contenedor_popup_servicios").classList.add("hide");
  document.getElementById("contenedor_popup_servicios").classList.remove("show");
  accion = accion_data;
  if(label != "asesoria"){
    var tmp_id = o.id.split("servicio_")[1]
    var id_ob = parseInt(tmp_id.split("_")[0]);
    var data = get_vacante_cb(id_ob)
    popup_servicios.titulo = data.cargo + " en "+data.empresa;
    popup_servicios.id = data.id;
    tmp_etiqueta = parseInt(tmp_id.split("_")[1]);
    popup_servicios.id_et = tmp_etiqueta;
  }else{
    popup_servicios.titulo = "Expertos en empleabilidad a tu disposicón";
    popup_servicios.id = "";
    popup_servicios.id_et = "";
  }
  
  popup_servicios.tipo_user = app.usuario.tipo;
  popup_servicios.label = label;
  close_popup(1);
  
  

}
async function habilitar_opciones(o,label,accion_data,event){
  event.stopPropagation();
  document.getElementById("div_contenedor_popup_servicios").style.display="block";
  await sleep(100);
  document.getElementById("div_contenedor_popup_servicios").classList.remove("hide");
  document.getElementById("div_contenedor_popup_servicios").classList.add("show");
  document.getElementById("contenedor_popup_servicios").classList.add("hide");
  document.getElementById("contenedor_popup_servicios").classList.remove("show");
  accion = accion_data;
  if(o.id.includes("aplicar_")){
    popup_servicios.tipo = "postulacion";
  }else{
    popup_servicios.tipo = "servicio";
  }
  if(label != "asesoria"){
    var tmp_id = o.id.split("servicio_")[1]
    var id_ob = parseInt(tmp_id.split("_")[0]);
    var data = get_vacante_cb(id_ob)
    popup_servicios.titulo = data.cargo + " en "+data.empresa;
    popup_servicios.id = data.id;
    tmp_etiqueta = parseInt(tmp_id.split("_")[1]);
    popup_servicios.id_et = tmp_etiqueta;
    popup_servicios.postulacion = data.postulacion;
    popup_servicios.link = data.link;
    popup_servicios.id_user = data.id_user;
  }else{
    popup_servicios.titulo = "Expertos en empleabilidad a tu disposicón";
    popup_servicios.id = "";
    popup_servicios.id_et = "";
    popup_servicios.postulacion = "";
    popup_servicios.link = "";
  }
  
  
  popup_servicios.label = label;

  popup_servicios.tipo_user = app.usuario.tipo; 
  close_popup(1);
  tmp_etiqueta = 0;
  popup_servicios.id_et = tmp_etiqueta;

}

function carga_perfil_usuario(){
  document.getElementById("telefono_perfil").value=profile.telefono ;
  document.getElementById("mail_perfil").value=profile.mail;
  document.getElementById("linkedin_perfil").value=profile.linkedin;
  document.getElementById("area_perfil").value=profile.area ;
  document.getElementById("ultimo_cargo_perfil").value=profile.ultimo_cargo ;
  document.getElementById("faltante_busqueda").value=profile.faltante_busqueda ;
  document.getElementById("ultima_empresa_perfil").value=profile.ultima_empresa ;
  document.getElementById("aspiracion_min_perfil").value=profile.aspiracion_min ;
  document.getElementById("aspiracion_max_perfil").value=profile.aspiracion_max ;
  document.getElementById("ciudad_perfil").value= (profile.ciudad == "undefined")?"":profile.ciudad ;
  document.getElementById("sector_perfil").value=(profile.sector == "undefined")?"":profile.sector ;
  document.getElementById("subsector_perfil").value=(profile.subsector  == "undefined")?"":profile.subsector;
  document.getElementById("cargos_aplica").value=(typeof profile.cargos_aplica  == "undefined")?"":profile.cargos_aplica;
  document.getElementById("logros_perfil").value=(profile.logros  == "undefined")?"":profile.logros;
}
function cargar_criterios(o){
  switch(o){
    case "vacante":
    var tmpx = app.sesion.data.cargos_aplica.trim().replace(/(\r\n|\n|\r)/gm,"");
    if(tmpx == ""){
      mostrar_mensaje_flotante("error","No tiene criterios de búsqueda cargados en tu perfil.");
      
    }else{
      conlis_objetos_vac.order = "coincidencia";
      conlis_objetos_vac.asc = 0;
      if(!tmpx.includes(",")){
        conlis_objetos_vac.filtros.push(tmpx);
      }else{
        var tmp_filters = tmpx.split(",");
        for(var m in tmp_filters){
          conlis_objetos_vac.filtros.push(tmp_filters[m]);
        }
      }
      filtrar_listas(conlis_objetos_vac.filtros,conlis_objetos_vac.server_identifier,conlis_objetos_vac.order,conlis_objetos_vac.asc)

    }
    break;
    case "contactos":
    var tmpx = app.sesion.data.cargos_aplica.trim().replace(/(\r\n|\n|\r)/gm,"");
    if(tmpx == ""){
      mostrar_mensaje_flotante("error","No tiene criterios de búsqueda cargados en tu perfil.");
      
    }else{
      conlis_objetos_con.order = "coincidencia";
      conlis_objetos_con.asc = 0;
      if(!tmpx.includes(",")){
        conlis_objetos_con.filtros.push(tmpx);
      }else{
        var tmp_filters = tmpx.split(",");
        for(var m in tmp_filters){
          conlis_objetos_con.filtros.push(tmp_filters[m]);
        }
      }
      filtrar_listas(conlis_objetos_con.filtros,conlis_objetos_con.server_identifier,conlis_objetos_con.order,conlis_objetos_con.asc)

    }
    break;
  }
}
function borrar_filtros(o){
  switch(o){
    case "vacante":
    conlis_objetos_vac.filtros = [];
    conlis_objetos_vac.order = "fecha"; 
    conlis_objetos_vac.asc = 0; 
    filtrar_listas(conlis_objetos_vac.filtros,conlis_objetos_vac.server_identifier,conlis_objetos_vac.order,conlis_objetos_vac.asc)
    break;
    case "contacto":
    conlis_objetos_con.filtros = [];
    conlis_objetos_con.order = "fecha"; 
    conlis_objetos_con.asc = 0; 
    filtrar_listas(conlis_objetos_con.filtros,conlis_objetos_con.server_identifier,conlis_objetos_con.order,conlis_objetos_con.asc)
    break;
    case "admin":
    conlis_objetos_admin.filtros = [];
    conlis_objetos_admin.order = "fecha"; 
    conlis_objetos_admin.asc = 0; 
    
    filtrar_listas(conlis_objetos_admin.filtros,"contactos",conlis_objetos_admin.order,conlis_objetos_admin.asc)
    filtrar_listas(conlis_objetos_admin.filtros,"vacantes",conlis_objetos_admin.order,conlis_objetos_admin.asc)
    break;
  }
}
async function descarga_perfil_usuario(){

  var data = get_persona_cb(parseInt(popup.id))
  if(typeof data.id_last_cv != "undefined"){
    window.open('EPE/get_last_cv?id='+popup.id, '_blank');
  }else{
    show_message_popup(null,true,"Este usuario aun no ha subido su hoja de vida. Le informamos que quieres ver su perfil para que lo cargue y te avisaremos cuando esté disponible")
  }
}
async function descarga_perfil(){
  var data = get_persona_cb(parseInt(id_session))
  if(typeof data.id_last_cv != "undefined"){
    window.open('EPE/get_last_cv?id='+id_session, '_blank');  
  }else{
    show_message_popup(null,true,"Este usuario aun no ha subido su hoja de vida.")
  }
}
async function guarda_perfil(){

  await show_loading(true,"Cargando Job Resume");
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); 
  var yyyy = today.getFullYear();
  if(accion.includes("crear")){
    tmp_etiqueta = 0;
  }
  today = yyyy + '-' + mm + '-' + dd;
  var parametro = 
  "ultimo_cargo[["+document.getElementById("ultimo_cargo_perfil").value+
  "]]ultima_empresa[["+document.getElementById("ultima_empresa_perfil").value+
  "]]aspiracion_min[["+document.getElementById("aspiracion_min_perfil").value+
  "]]aspiracion_max[["+document.getElementById("aspiracion_max_perfil").value+
  
  "]]faltante_busqueda[["+document.getElementById("faltante_busqueda").value+
  "]]fecha[["+today+"]]";
  try{
    parametro += "linkedin[["+document.getElementById("linkedin_perfil").value+
    "]]telefono[["+document.getElementById("telefono_perfil").value+
    
    "]]mail[["+document.getElementById("mail_perfil").value+
    "]]area[["+document.getElementById("area_perfil").value+
    "]]cargos_aplica[["+document.getElementById("cargos_aplica").value+
    "]]logros[["+document.getElementById("logros_perfil").value+
    "]]ciudad[["+document.getElementById("ciudad_perfil").value+
    "]]sector[["+document.getElementById("sector_perfil").value+
    "]]subsector[["+document.getElementById("subsector_perfil").value;

  }catch(e){
    parametro +="incompleto[[]]"
  }
  if(typeof app != "undefined")
    guarda_datos_perfil(app.usuario.id,parametro);
  else
    guarda_datos_perfil(profile.id,parametro);
}
function reenviar_actualizar(){
  accion = "editar_"+accion.split("_")[1]

  document.getElementById("id_"+accion.split("_")[1]).value = tmp_id;
  call2action();

}
async function abrir_networking(){
  await show_loading(true,"Cargando red");
  get_network();
  document.getElementById("contenedor_red").classList.remove("hidden");
}
function cerrar_networking(){
  document.getElementById("contenedor_red").classList.add("hidden");
}

function reset_form(a){
  if(a.includes("contacto")){
    document.getElementById("id_contacto").value = "";
    document.getElementById("linkedin_contacto").value ="";
    document.getElementById("nombre_contacto").value ="";
    document.getElementById("cargo_contacto").value ="";
    document.getElementById("empresa_contacto").value ="";
    document.getElementById("mail_contacto").value ="";
    document.getElementById("telefono_contacto").value ="";
    document.getElementById("tipo_contacto").value =0;
    document.getElementById("crystal_contacto").value =0;
    document.getElementById("obs_contacto").value ="";
  }else if(a.includes("contacto")){
    document.getElementById("linkedin_contacto_perfil").value ="";
    document.getElementById("mail_contacto_perfil").value ="";
    document.getElementById("telefono_contacto_perfil").value ="";
    document.getElementById("tipo_contacto_perfil").value =0;
    document.getElementById("obs_contacto_perfil").value ="";
  }else if (a.includes("oportunidad")){
    document.getElementById("id_oportunidad").value = "";
    document.getElementById("empresa_oportunidad").value = "";
    document.getElementById("cargo_oportunidad").value = "";
    document.getElementById("ciudad_oportunidad").value = "";
    document.getElementById("link_oportunidad").value = "";
    document.getElementById("rango_menor_oportunidad").value = "";
    document.getElementById("rango_mayor_oportunidad").value = "";
    document.getElementById("tipo_oportunidad").value = "";
    document.getElementById("obs_oportunidad").value = "";

    
    //document.getElementById("req_oportunidad").value = "";
    document.getElementById("cumplimiento_100").value = "";
    document.getElementById("oportunidad_oculto").checked = false;
    try{
      document.getElementById("oportunidad_protegido").checked = false;
    }catch(e){
      console.log("no es usuario admin")
    }


  }else if (a.includes("proceso")){
    document.getElementById("id_vacante_proceso").value ="";
    document.getElementById("id_contacto_proceso").value ="";
    document.getElementById("cargo_proceso").value ="";
    document.getElementById("fecha_proceso").value ="";
    document.getElementById("empresa_contacto_proceso").value ="";
    document.getElementById("cargo_contacto_proceso").value ="";
    document.getElementById("nombre_contacto_proceso").value ="";
    document.getElementById("linkedin_contacto_proceso").value ="";
    document.getElementById("mail_contacto_proceso").value ="";
    document.getElementById("crystal_contacto_proceso").value =0;
    document.getElementById("telefono_proceso").value ="";
    document.getElementById("tipo_proceso").value =0;
    document.getElementById("obs_proceso").value="";

  }else if (a.includes("usuario_index")){
    document.getElementById("empresa_oportunidad").value= "";
    document.getElementById("cargo_oportunidad").value= "";
    document.getElementById("obs_oportunidad").value= "";
    document.getElementById("tipo_oportunidad").value= "";
    document.getElementById("ciudad_oportunidad").value= "";
    document.getElementById("link_oportunidad").value= "";
    document.getElementById("tipo_servicio").value= "true";
    document.getElementById("rango_menor_oportunidad").value= "";
    document.getElementById("rango_mayor_oportunidad").value= "";

    document.getElementById("req1").value = "";
    document.getElementById("req2").value = "";
    document.getElementById("req3").value = "";
    document.getElementById("req4").value = "";
    document.getElementById("req5").value = "";
    

    document.getElementById("nombre_usuario").value= ""
    document.getElementById("correo_usuario").value= ""
    document.getElementById("telefono_usuario").value= ""





  }else if (a.includes("job_hacker")){
    document.getElementById("id_job_hacker").value= ""
    document.getElementById("linkedin_job_hacker").value= ""
    document.getElementById("nombre_job_hacker").value= ""
    document.getElementById("cargo_job_hacker").value= ""
    document.getElementById("empresa_job_hacker").value= ""
    document.getElementById("mail_job_hacker").value= ""
    document.getElementById("telefono_job_hacker").value= ""
    document.getElementById("crystal_job_hacker").value= ""

  }

}

function asociar_previo(repre = false){
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); 
  var yyyy = today.getFullYear();

  today = yyyy + '-' + mm + '-' + dd;
  var label = accion.split("_")[1].trim();
  var parametro = "label[["+label+"]]id[["+tmp_id+"]]fecha[["+today+"]]";
  if(label == "contacto"){
    if(popup_servicios.postulacion == "true"){
      parametro+="verificacion_contacto[[false]]nivel[[1]]obs[[Quiero aplicar a la vacante de "+popup_servicios.titulo+"]]";

    }else{
      if(document.getElementById("tipo_contacto").value.trim() != ""){
        parametro+="verificacion_contacto[["+document.getElementById("verificacion_contacto").checked+"]]nivel[["+document.getElementById("tipo_contacto").value+"]]obs[["+document.getElementById("obs_contacto").value+"]]";

      }else{
        parametro+="verificacion_contacto[["+document.getElementById("verificacion_contacto").checked+"]]nivel[[1]]obs[["+document.getElementById("obs_contacto").value+"]]";

      }
    }
  }
  if(label == "oportunidad"){

    
    if(app.usuario.tipo == 6){
      parametro+="cumple[[contacto]]";
    }else{
      parametro+="cumple[["+repre+"]]";  
    }
  }
  if(label == "proceso"){
    parametro+="servicio[[analisis]]";
  }



  conector_crear_actualizar_etiqueta(parametro,tmp_etiqueta,id_session,label)
}

async function mostrar_mensaje_flotante(tipo,texto){
  await show_loading(false,"");
  switch(tipo){
    case "ok":
    document.getElementById("texto_mensaje_flotante").innerHTML = texto;
    document.getElementById("mensaje_flotante").classList.remove("hide");
    await sleep(2000);
    document.getElementById("mensaje_flotante").classList.add("hide");
    break;
    case "error":
    document.getElementById("texto_mensaje_flotante").innerHTML = texto;
    document.getElementById("mensaje_flotante").classList.remove("hide");
    await sleep(2000);
    document.getElementById("mensaje_flotante").classList.add("hide");
    break;
  }
  if(tipo == "ok"){
    accion = "";
    await sleep(5000);
    document.getElementById("mensaje_flotante").classList.add("hide");
  //close_contenedor("contenedor_right");
}
}

async function mostrar_mensaje(tipo,texto){
  await show_loading(false,"");
  switch(tipo){
    case "alerta":
    document.getElementById("mensaje_retorno_img").src = "static/imgs/alert.png";
    document.getElementById("div_mensaje_retorno").classList.remove("ok");
    document.getElementById("div_mensaje_retorno").classList.remove("error");
    document.getElementById("div_mensaje_retorno").classList.add("alerta");
    document.getElementById("decision_retorno").style.display="block";
    break;
    case "error":
    document.getElementById("div_mensaje_retorno").classList.remove("alerta");
    document.getElementById("div_mensaje_retorno").classList.remove("ok");
    document.getElementById("div_mensaje_retorno").classList.add("error");
    document.getElementById("decision_retorno").style.display="none";
    break;
    case "ok":
    document.getElementById("mensaje_retorno_img").src = "static/imgs/ok.png";
    document.getElementById("div_mensaje_retorno").classList.remove("alerta");
    document.getElementById("div_mensaje_retorno").classList.remove("error");
    document.getElementById("div_mensaje_retorno").classList.add("ok");
    document.getElementById("decision_retorno").style.display="none";
    break;
  }
  document.getElementById("div_mensaje_retorno").classList.remove("invisible");
  document.getElementById("mensaje_retorno").innerHTML = texto;
  if(tipo == "ok"){
    await sleep(2000);
    ocultar_mensaje();
    close_popup(3);
  }

}
function add_usuario(){
  document.getElementById("div_crear_usuario").style.display = "block";
}
window.mobileCheck = function() {
  let check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
};
function cambiar_contenedor(ob){
  if(window.mobileCheck()){
    cambiar('inicio')
  }
  if(ob.id.includes("contenedor_inicio")){
    id_session = app.sesion.data.id;
    get_full_user_info();
  }
  /*if(ob.id.includes("contenedor_estadisticas")){
    //console.log("pintando graficas...",conlis_stats.datos,conlis_stats.etiquetas)
    //paint_bars(conlis_stats.datos);
    //paint_graph(prepare_data_etiquetas_usuario(conlis_stats.etiquetas),"svg_general");
  }*/
  var node_tmp,img_tmp,name_img;
  var parent = ob.parentNode.getElementsByClassName("opcion_menu");
  for(var o in parent){
    if(typeof parent[o].id != "undefined" && parent[o].id.includes("tab_")){
      var id = parent[o].id.split("tab_")[1];
      
      if(parent[o].id == ob.id){
        parent[o].classList.add("selected");
        node_tmp= parent[o].getElementsByTagName("input")[0];
        img_tmp = node_tmp.src.split("/");
        //if(!img_tmp[img_tmp.length-1].includes("_w")){
          //name_img = img_tmp[img_tmp.length-1].split(".")[0]+"_w.png";
        //}else{
          name_img = img_tmp[img_tmp.length-1];
        //}
        node_tmp.src = "static/imgs/menu/"+name_img;
        if(id == "contenedor_inicio"){
          if(app.sesion.data.admin == 1){
            document.getElementById("contenedor_left_admin").classList.remove("hidden");    
            document.getElementById("contenedor_info_usuario").classList.add("hidden");    
          }
        }else{
          if(id=="contenedor_estadisticas" && app.sesion.data.admin == 1){
            get_statistics();
          }
          document.getElementById(id).classList.remove("hidden");    
        }

      }else{
        parent[o].classList.remove("selected");
        node_tmp= parent[o].getElementsByTagName("input")[0];
        img_tmp = node_tmp.src.split("/");
        //if(img_tmp[img_tmp.length-1].includes("_w")){
         //name_img = img_tmp[img_tmp.length-1].split("_w")[0]+".png";
         //node_tmp.src = "static/imgs/menu/"+name_img;
       //}
       if(id == "contenedor_inicio"){
        if(app.sesion.data.admin == 1){
          document.getElementById("contenedor_left_admin").classList.add("hidden");    
          document.getElementById("contenedor_info_usuario").classList.add("hidden");    
        }
      }else {
        document.getElementById(id).classList.add("hidden");    
      }
    }

  }
  

}





}
function close_menu(){
  document.getElementById("div_contenedor_menu").style.display = "none";
}
function cambiar(i){
  switch(i){
    case "menu":
    document.getElementById("banner_servicios").style.display = "none";
    document.getElementById("div_contenedor_menu").style.display = "block";
    document.getElementById("contenedor_total").style.display = "none";
    break;
    case "inicio":
    document.getElementById("banner_servicios").style.display = "none";
    document.getElementById("div_contenedor_menu").style.display = "none";
    document.getElementById("contenedor_total").style.display = "block";
    break;
    case "servicios":
    document.getElementById("banner_servicios").style.display = "block";
    document.getElementById("div_contenedor_menu").style.display = "none";
    document.getElementById("contenedor_total").style.display = "none";
    
    
    
    break;
  }
  /*
  if(i == "vacantes"){
    var arr = document.getElementsByClassName("contenedor_listas right");
    for(var o in arr){
      console.log(arr[o]);
      if(typeof arr[o].id != "undefined" ){
        arr[o].style.display = "block";
      }
    }

    var arr = document.getElementsByClassName("contenedor_listas left");
    for(var o in arr){
      if(typeof arr[o].id != "undefined" ){
        arr[o].style.display = "none";
      }
    }

  }else if(i == "contactos"){
   var arr = document.getElementsByClassName("contenedor_listas left");
   for(var o in arr){
    if(typeof arr[o].id != "undefined" ){
      arr[o].style.display = "block";
    }
  }

  var arr = document.getElementsByClassName("contenedor_listas right");
  for(var o in arr){
    if(typeof arr[o].id != "undefined" ){
      arr[o].style.display = "none";
    }
  }
}else if(i == "menu"){
  document.getElementById("div_contenedor_menu").style.display = "block";
}
*/
}
function regresar_vista_admin(){
  try{
    document.getElementById("contenedor_left_admin").classList.remove("hidden");
  }catch(e){
    console.log("usuario")
  }
  document.getElementById("contenedor_info_usuario").classList.add("hidden");
  id_session = app.sesion.data.id;
  //get_full_user_info();
}
async function show_message_perfil(){
  document.getElementById("div_contenedor_popup_perfil").style.display="block";
  await sleep(100);
  document.getElementById("div_contenedor_popup_perfil").classList.remove("hide");
  document.getElementById("div_contenedor_popup_perfil").classList.add("show");
  document.getElementById("ultimo_cargo_perfil").value = app.usuario.ultimo_cargo;
  document.getElementById("faltante_busqueda").value = (typeof app.usuario.faltante_busqueda == "undefined")?"":app.usuario.faltante_busqueda;
  document.getElementById("ultima_empresa_perfil").value = app.usuario.ultima_empresa;
  //document.getElementById("linkedin_perfil").value = app.usuario.linkedin;
  //document.getElementById("cargos_aplica").value = (app.usuario.cargos_aplica  == "undefined")?"":app.usuario.cargos_aplica;
  //document.getElementById("logros_perfil").value = app.usuario.logros;
  document.getElementById("aspiracion_min_perfil").value = app.usuario.aspiracion_min;
  document.getElementById("aspiracion_max_perfil").value = app.usuario.aspiracion_max;
}
async function show_message_popup(o,fix=false,msj=""){

  if(fix){
    try{
      event.stopPropagation();
    }catch(e){
      console.log("no tiene ")
    }
    if(msj == "mensaje_1"){
      msj = "En Aleia puedes guardar las vacantes a las que te has postulado en otros portales y agregar comentarios a cada vacante para que nunca pierdas información sobre tu búsqueda de empleo.<br><br>Para poder guardar una vacante debes iniciar sesión o crear una cuenta en Aleia<br><br><a href='login?type=registro'><button class='opcion_popup_pregunta'>Registrate GRATIS</button></a><br><br><a href='login'><button class='login'>Iniciar sesión</button></a>"
    }
    if(msj == "mensaje_0"){
      msj = "En Aleia puedes postularte de varías formas en cada vacante, aumentando la probabilidad de que te contaten.<br><br>Para poder aplicar a una vacante debes iniciar sesión o crear una cuenta en Aleia<br><br><a href='login?type=registro'><button class='opcion_popup_pregunta'>Registrate GRATIS</button></a><br><br><a href='login'><button>Iniciar sesión</button></a>"
    }
    if(msj == "delete_etiqueta"){

      msj = "<span style='color:red'>¿Confirmas que deseas eliminar esta vacante?</span> <br><br>Recuerda que solo se eliminará de 'Mis vacantes guardadas' y eliminará todos los servicios solicitados para esta vacante.<br><br><button onclick='close_popup(12)'>Cancelar</button><br><br><button onclick='delete_etiqueta("+parseInt(o.id.split("etiqueta_")[1])+")' class='boton_eliminar'>Eliminar</button>"
    }
    if(msj == "delete_contacto"){

      msj = "<span style='color:red'>¿Confirmas que deseas eliminar este contacto?</span> <br><br><button onclick='close_popup(12)'>Cancelar</button><br><br><button onclick='delete_etiqueta("+parseInt(o.id.split("etiqueta_")[1])+")' class='boton_eliminar'>Eliminar</button>"
    }
    if(msj == "delete_servicio"){

      id_s = '"'+o.id.split("etiqueta_")[1]+'"'
      msj = "<span style='color:red'>¿Confirmas que deseas cancelar este servicio?</span> <br><br>Una vez lo canceles se te devolverá el crédito.<br><br><button onclick='close_popup(12)'>Mejor no</button><br><br><button onclick='delete_servicio("+id_s+")' class='boton_eliminar'>Cancelar servicio</button>"

    }
    document.getElementById("mensaje_popup_pregunta").innerHTML = msj;
  }
  else{
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
async function close_popup(i){
  var div = "";
  if(typeof i == "number"){
    switch(i){
      case 1:
      div = "div_contenedor_popup";
      show_detalle();
      break;
      case 2:
      div = "div_contenedor_popup_share";
      break;
      case 3:
      div = "contenedor_right";
      break;
      case 4:
      div = "contenedor_sesiones";
      break;
      case 5:
      div = "div_contenedor_video";
      player.stopVideo();
      break;
      case 6:
      div = "contenedor_verifica_persona";
      break;
      case 10:
      div = "div_contenedor_popup_perfil";
      break;
      case 11:
      div = "div_contenedor_popup_servicios";
      break;
      case 12:
      div = "div_contenedor_popup_pregunta";
      break;
      case 13:
      div = "div_contenedor_iframe_hv";
      break;


    }
  }else{
    var tmp = i.parentNode.parentNode;
    var div = tmp.id;
  }
  if(div == "div_contenedor_popup_servicios"){
    popup_servicios.id_et = "";
    popup_servicios.id_vac_serv = "";
    popup_servicios.tipo_etiq = "";
    popup_servicios.tipo_serv = "";
    load_cv_serv(2)
    load_cv_serv(4)
  }
  if(div == "contenedor_right"){
    div = "contenedor_right";
    try{
      document.getElementById("contenedor_popup_formularios").classList.remove("cargue_masivo");  
      ocultar_mensaje();
      formulario.csv_preview = [];
      formulario.archivos = "";
      formulario.csv_mensajes = [];    
      reset_form(accion);
    }catch(e){
      console.log("nada")
    }
  }
  if(document.getElementById(div) != null){
    document.getElementById(div).classList.add("hide");
    document.getElementById(div).classList.remove("show");
    await sleep(500);
    document.getElementById(div).style.display="none";
  }
  if(div != "div_contenedor_popup_pregunta"){
    popup.id=-1;
    popup.id_et =-1;
  }
  if(div == "div_contenedor_popup"){
    popup.titulo="";
    popup.subtitulo="";
    popup.subtitulo2="";
    popup.titulo_texto1="";
    popup.titulo_texto2="";
    popup.titulo_texto3="";
    popup.texto1="";
    popup.texto2="";
    popup.texto3="";
    popup.link="";
    popup.estado_copy = "Copiar";
    
  }else if(div == "div_contenedor_popup_share"){
    popup_many.label = "";
    popup_many.id = -1;
    popup_many.titulo = "";
    popup_many.subtitulo = "";
    document.getElementById("buscador_usuarios_popup").value = "";
  }
}
function vuelve_inicio(){
  if(window.location.href.includes("/app")){
    close_popup(12);
    close_popup(10);
  }else if(window.location.href.includes("/profile")){
    location.href="app";
  }
}
function buscar_general(i){
  switch(i){

    case 1:
    popup_many.usuarios_filtrado = buscar_items(popup_many.usuarios,popup_many.usuarios_filtrado,"buscador_usuarios_popup");
    break;

  }
}
function buscar_items(arr_base,arr_filt,div){

  var txt = document.getElementById(div).value;
  var imte = 0;
  if(txt.trim() == ""){
    arr_filt = arr_base.slice(0,max_items_render)  
  }else{
    arr_filt = [];
    var tmp = "";
    var cont = 0;
    var max_items = 100;
    for(var i =0; i<arr_base.length;i++){
      var esta = false;
      for(var o in arr_base[i]){
        var tmp = (""+arr_base[i][o]).toLowerCase();
        var txt_arr = txt.split(" ");

        for(var w in txt_arr){
          if(tmp.includes(txt_arr[w].toLowerCase())){
            imte++;
            arr_filt.push(arr_base[i])
            cont++;
            esta = true;
            break;
          }
          if(esta){break;}
        }
        if(esta){break;}
      }
      if(cont >= max_items_render){
        break;
      }
    }
  }
  return arr_filt
}
function close_contenedor_menu(div){
  document.getElementById(div).style.display = "none";
  //document.getElementById("boton_add_usuario").classList.remove("selected");
  document.getElementById("boton_add_jh").classList.remove("selected");
  reset_form(accion);
}


function close_contenedor(div){
  busqueda = "";
  document.getElementById("boton_call2action").style.display = "none"; 
  document.getElementById("boton_call2action").style.position = "absolute"; 
  if(div == "contenedor_right"){
    document.getElementById("titulo_"+div).innerHTML = "";
  }
  
  document.getElementById(div).classList.add("hidden");
  //document.getElementById("contenedor_center").classList.remove("hidden");
  document.getElementById(div).style.background = color_default;
  reset_form(accion);
  accion = "";
  tmp_etiqueta = -1;
  tmp_id=null;
}
function edit_usuario(o){
  id_us = parseInt(o.id.split("edit_usuario_")[1]);
  for(var i = 0; i<app.personas.length;i++){
    if(app.personas[i].id == id_us){
      var data = app.personas[i];
      add_usuario();
      show_menu();

      document.getElementById("id_usuario").value = data.id;
      document.getElementById("linkedin_usuario").value= data.linkedin;
      document.getElementById("nombre_usuario").value= data.nombre;
      document.getElementById("cargo_usuario").value= data.ultimo_cargo;
      document.getElementById("empresa_usuario").value  = data.ultima_empresa;
      document.getElementById("mail_usuario").value = data.mail;
      document.getElementById("telefono_usuario").value= data.telefono;
      document.getElementById("aspiracion_min_usuario").value = data.aspiracion_min;
      document.getElementById("aspiracion_max_usuario").value = data.aspiracion_max;
      document.getElementById("crystal_usuario").value = data.crystal;
      document.getElementById("job_hacker_usuario").value = data.job_hacker;
      document.getElementById("area_usuario").value = data.area;
      document.getElementById("estado_usuario").value = data.estado;
      accion="editar_usuario";
      break;
    }
  }

}
function load_cv_serv(i){

 if(i == 1){
  document.getElementById("load_serv_postulacion").style.display = "block";
  document.getElementById("desc_serv_postulacion").style.display = "none";
  
  document.getElementById("tipo_serv_ap").value = "analisis";
  popup_servicios.tipo_serv = "analisis";

  document.getElementById("tipo_etiq_ap").value = popup_servicios.label; 
  document.getElementById("id_vac_serv_ap").value = popup_servicios.id;
  document.getElementById("id_etiq_ap").value = popup_servicios.id_et;

  load_cv_serv(4);

  
}else if(i == 3){
  document.getElementById("load_serv_representacion").style.display = "block";
  document.getElementById("desc_serv_representacion").style.display = "none";
  document.getElementById("tipo_serv_re").value = "representacion";
  popup_servicios.tipo_serv = "representacion";
  document.getElementById("tipo_etiq_re").value = popup_servicios.label; 
  document.getElementById("id_vac_serv_re").value = popup_servicios.id;
  document.getElementById("id_etiq_re").value = popup_servicios.id_et;

  load_cv_serv(2);

}else if(i == 2){
  try{
    document.getElementById("load_serv_postulacion").style.display = "none";
    document.getElementById("desc_serv_postulacion").style.display = "block";
    document.getElementById("tipo_serv_ap").value = "";
    document.getElementById("tipo_etiq_ap").value = ""; 
    document.getElementById("id_vac_serv_ap").value = "";
    document.getElementById("id_etiq_ap").value = "";
  }catch(e){
    console.log("ok")
  }
}else if(i == 4){
  try{
    document.getElementById("load_serv_representacion").style.display = "none";
    document.getElementById("desc_serv_representacion").style.display = "block";
    document.getElementById("tipo_serv_re").value = "";
    document.getElementById("tipo_etiq_re").value = ""; 
    document.getElementById("id_vac_serv_re").value = "";
    document.getElementById("id_etiq_re").value = "";
  }catch(e){
    console.log("ok")
  }
}
}
function show_usuario(o){
  id_session = parseInt(o.id.split("show_usuario_")[1]);
  try{
    document.getElementById("contenedor_left_admin").classList.add("hidden");
  }catch(e){
    console.log("usuario")
  }
  document.getElementById("contenedor_info_usuario").classList.remove("hidden");
//document.getElementById("boton_back").style.display="block"; 
get_full_user_info();
}
function show_menu(){
  if(document.getElementById("div_contenedor_menu").className.includes("hidden_menu")){
    document.getElementById("div_contenedor_menu").classList.remove("hidden_menu");
  }else{
    document.getElementById("div_contenedor_menu").classList.add("hidden_menu");
  }
}
async function show_contenedor(div,config){
  try{
    document.getElementById("verificacion_contacto").checked = true;
  }catch(e){
    console.log("no hay verificacion_contacto")
  }
  document.getElementById(div).style.display="block";
  await sleep(100);
  if(config.div == "sesion" || config.div == "login"){
    document.getElementById("boton_call2action").style.display = "none";
  }else{
    document.getElementById("boton_call2action").style.display = "block";
  }
  document.getElementById(div).classList.remove("hide");
  if(div == "contenedor_right"){
    close_popup(6)

    var prim = (accion.includes("crear"))?"Crear "+config.nombre:"Editar "+config.nombre;
    try{
      document.getElementById("titulo_contenedor_right").innerHTML = prim;
    }catch(e){
      console.log("asd")
    }
    document.getElementById("boton_call2action").innerHTML = prim;
    //document.getElementById("boton_call2action").style.display = "block";
    if(config.div == "contacto_masivo"){

      document.getElementById("contenedor_popup_formularios").classList.add("cargue_masivo");
      document.getElementById("contenedor_popup_formularios").classList.remove("extenso");   
    }else if(config.div == "proceso"){
      document.getElementById("contenedor_popup_formularios").classList.add("extenso");
      document.getElementById("contenedor_popup_formularios").classList.remove("cargue_masivo");   
    }else{
      document.getElementById("contenedor_popup_formularios").classList.remove("cargue_masivo");      
      document.getElementById("contenedor_popup_formularios").classList.remove("extenso");      

    }
  }

}
function ocultar_mensaje(){
  document.getElementById("div_mensaje_retorno").classList.add("invisible");
}
function tab_contenedor(ob,fix=false,div=""){
  if(fix){
    console.log(div,fix)
    document.getElementById("tab_contenedor_full_vacantes").style.display="none";
    ob = document.getElementById(div);
  }
  var parent = ob.parentNode.getElementsByClassName("opcion_pestania");
  for(var o in parent){
    try{
      var id = parent[o].id.split("tab_")[1];
      if(parent[o].id == ob.id){
        parent[o].classList.add("selected");
        document.getElementById(id).classList.remove("hide");
      }else{
        parent[o].classList.remove("selected");
        document.getElementById(id).classList.add("hide");
      }
    }catch(e){

    }
  }
  
}
function show_rutas(o,event){
  document.getElementById("sub_contenedor_popup_red").style.display="block";
  document.getElementById("sub_contenedor_popup_detalle").style.display="none";
  paint_network(popup.obj_rutas,680,280);

}
function show_detalle(){
  try{
    document.getElementById("sub_contenedor_popup_red").style.display="none";
    document.getElementById("sub_contenedor_popup_detalle").style.display="block";
  }catch(e){
    console.log("no esta")
  }
}
async function popup_envio_solicitud(o,event){
  event.stopPropagation();

  
  var id = o.parentNode.getElementsByTagName("input")[0].id;
  popup.link_invita = 'https://aleja.com.co/verificacion?n1='+popup.pnombre+'&n2='+app.sesion.pnombre+'&type=ok&idt='+popup.id+'&ids='+id_session;
  document.getElementById("mensaje_popup_pregunta").innerHTML = "Cuando invitas a alguien a inscribirse a Aleia y el carga sus contactos cercanos, estos te saldrán en la pestaña de 'Contactos que puedo llegar a conocer', lo cual va a expandir tu red de networking de forma rapida y sencilla.<br><br>Copia el siguiente link y enviaselo a "+popup.pnombre+"<br><br><br><br>"+
  '<div class="div_link_copy">'+
  '<input value="https://aleja.com.co/verificacion?n1='+popup.pnombre+'&n2='+app.sesion.pnombre+'&type=ok&idt='+popup.id+'&ids='+id_session+'" class="link_copy">'+
  '<button class="copy_link_button" onclick="copy_popup_link()">Copiar</button>'+
  '</div>';
  document.getElementById("div_contenedor_popup_pregunta").style.display="block";
  await sleep(100);
  document.getElementById("div_contenedor_popup_pregunta").classList.remove("hide");
  document.getElementById("div_contenedor_popup_pregunta").classList.add("show");
}

function delete_etiqueta(id_etiq){
  //event.stopPropagation();

  //var id_et = parseInt(o.id.split("etiqueta_")[1])
  /*if(id_et == tmp_etiqueta){
    close_contenedor("contenedor_right");
  }*/

  eliminar_etiqueta(id_session,id_etiq)
  close_popup(12)
  close_popup(1)
  close_popup(2)
}
function copy_popup_link(){
  var $temp = $("<textarea>");
  $("body").append($temp);
  $temp.val(popup.link_invita).select();
  document.execCommand("copy");
  $temp.remove();
  alert("copiado")
}
function copiar_objeto(){

  var element = popup.resumen;
  try{
    var brRegex = /<br\s*[\/]?>/gi;
    var element_copy = element.trim().replace(brRegex, "\r\n");
    var $temp = $("<textarea>");

    $("body").append($temp);
    $temp.val(element_copy).select();
    document.execCommand("copy");
    $temp.remove();
    popup.estado_copy = "Copiado!";
  }catch(x){
    mostrar_mensaje_flotante("ok","Error al copiar");
  }
}
function eliminar_opcion_usuario(o){
  var id_ob = parseInt(o.id.split("eliminar_opcion_usuario_")[1]);
  for(var i = 0; i<popup_many.usuarios_seleccionados.length;i++){
    if(popup_many.usuarios_seleccionados[i].id == id_ob){
      popup_many.usuarios_seleccionados.splice(i,1);
      break;
    }
  }
}
function usuario_seleccionado(o){
  var id_ob = parseInt(o.id.split("opcion_usuario_")[1]);
  for(var i = 0; i<popup_many.usuarios.length;i++){
    if(popup_many.usuarios[i].id == id_ob){
      console.log("encontrado...",popup_many.usuarios_seleccionados.filter(obj => obj.id == id_ob))
      if(popup_many.usuarios_seleccionados.filter(obj => obj.id == id_ob).length == 0){

        popup_many.usuarios_seleccionados.push({"id":popup_many.usuarios[i].id,"nombre":popup_many.usuarios[i].nombre});

      }
      break;
    }
  }
}
async function share(o,i,event){
  event.stopPropagation();
  popup_many.usuarios_seleccionados = [];
  var id_ob = parseInt(o.id.split("share_")[1]);
  if(i == 1){
    //for(var w = 0; w<app.vacantes.length;w++){
      //if(app.vacantes[w].id == id_ob){
        //i = app.vacantes[w].label;
        var data = get_vacante_cb(id_ob)
        popup_many.label = "oportunidad";
        popup_many.id = data.id;
        popup_many.titulo = "Oportunidad en "+data.empresa;
        popup_many.subtitulo = data.cargo;
       // break;
      //}
    //}
  }else if (i==2){
    var data = get_persona_cb(id_ob)
    //for(var w = 0; w<app.personas.length;w++){
      //if(app.personas[w].id == id_ob){
        //i = app.personas[w].label;
        popup_many.label = "contacto";
        popup_many.id = data.id;
        popup_many.titulo = "Contacto en "+data.ultima_empresa;
        popup_many.subtitulo = data.nombre+" - "+data.ultimo_cargo;
        document.getElementById("tipo_contacto").value = 1;
        //break;
      //}
    //}

  }
  document.getElementById("div_contenedor_popup_share").style.display="block";
  await sleep(100);
  document.getElementById("div_contenedor_popup_share").classList.remove("hide");
  document.getElementById("div_contenedor_popup_share").classList.add("show");
}
function conteo_atributos(arr){
  var atts = {};
  for(var o in arr){

    if(atts.hasOwnProperty(arr[o].observacion)){
      atts[arr[o].observacion]++;
    }else{
      atts[arr[o].observacion] = 1;
    }
  }
  for(var o in atts){
    atts[o] = (atts[o]/arr.length)*100;
  }
  return atts;
}
function selecciona_contacto(o){

  conlis_red.filtros = ["#id:"+o.id.split("contacto_red_")[1]];
}
async function share_item_fijo(id_vac,label="oportunidad"){
  document.getElementById("input_comentario").value = "";
  //popup.contenido = link_teachable+videos["etiqueta_"+label].id;
  //popup.texto_contenido =videos["etiqueta_"+label].titulo_video;
  popup.keywords = [];
  popup.label = label;
  if(label == "oportunidad"){
    //document.getElementById("contenedor_popup").className = "contenedor_popup";
    //document.getElementById("sub_contenedor_popup_datos").className = "sub_contenedor_popup center";
    var data = get_vacante_cb(parseInt(id_vac))
    var tmp_list = [];
    if(typeof data["req"] != "undefined"){
      tmp_list = data["req"].split(".");
      for(u in tmp_list){
        tmp_list[u] = tmp_list[u].replaceAll("\n"," ").trim();
      }
      popup.keywords = tmp_list;
    }
    popup.imagen = imagenes_popup[label];
    popup.id = data.id;

    if(data.tipo != ""){popup.tipo_oportunidad = tipo_oportunidad[ parseInt(data.tipo)].texto;}
    
    popup.titulo = data.cargo;
    popup.rango_salario = (data.rango_mayor+"" != "undefined" && data.rango_menor+"" != "undefined" && (data.rango_mayor+"").trim()+""+(data.rango_menor+"").trim() == "")?"":"Entre "+data.rango_menor+" y "+data.rango_mayor;
    popup.subtitulo = "Vacante";
    popup.subtitulo2 = data.empresa;
    popup.titulo_texto1 = (popup.keywords.length == 0)?"":"Requisitos";
    popup.texto1 = (data.req != "undefined")?data.req:"No esta especificado";
    popup.titulo_texto2 = "Descripción de la vacante";
    popup.texto2 = (data.obs != "")?data.obs:"La vacante no tiene descripción";
    popup.titulo_texto3 = "";
    popup.texto3 = "Salario entre "+data.rango_menor+" y "+data.rango_mayor+" en "+data.ciudad;
    popup.link = data.link;
    popup.resumen = data.cargo+" en "+data.empresa+"\n"+data.link;
    document.getElementById("div_contenedor_popup").style.display="block";
    await sleep(100);
    document.getElementById("div_contenedor_popup").classList.remove("hide");
    document.getElementById("div_contenedor_popup").classList.add("show");
  }
}
async function share_item(item,label,event){
  event.stopPropagation();
  document.getElementById("input_comentario").value = "";
  //popup.contenido = link_teachable+videos["etiqueta_"+label].id;
  //popup.texto_contenido =videos["etiqueta_"+label].titulo_video;
  popup.keywords = [];
  popup.label = label;
  if(label == "oportunidad"){
    //document.getElementById("contenedor_popup").className = "contenedor_popup";
    //document.getElementById("sub_contenedor_popup_datos").className = "sub_contenedor_popup center";
    var data = get_vacante_cb(parseInt(item.id.split("share_etiqueta_")[1]))
    var tmp_list = [];
    if(typeof data["req"] != "undefined"){
      tmp_list = data["req"].split(".");
      for(u in tmp_list){
        tmp_list[u] = tmp_list[u].replaceAll("\n"," ").trim();
      }
      popup.keywords = tmp_list;
    }
    popup.imagen = imagenes_popup[label];
    popup.id = data.id;

    if(data.tipo != ""){popup.tipo_oportunidad = tipo_oportunidad[ parseInt(data.tipo)].texto;}
    
    popup.titulo = data.cargo;
    //popup.rango_salario = (data.rango_mayor+"" != "undefined" && data.rango_menor+"" != "undefined" && (data.rango_mayor+"").trim()+""+(data.rango_menor+"").trim() == "")?"":
    popup.rango_salario ="Entre "+data.rango_menor+" y "+data.rango_mayor;
    popup.subtitulo = "Vacante";
    popup.subtitulo2 = data.empresa;
    popup.titulo_texto1 = (popup.keywords.length == 0)?"":"Requisitos";
    popup.texto1 = (data.req != "undefined")?data.req:"No esta especificado";
    popup.titulo_texto2 = "Descripción de la vacante";
    popup.texto2 = (data.obs != "")?data.obs:"La vacante no tiene descripción";
    popup.titulo_texto3 = "";
    popup.texto3 = "Salario entre "+data.rango_menor+" y "+data.rango_mayor+" en "+data.ciudad;
    popup.link = data.link;
    popup.resumen = data.cargo+" en "+data.empresa+"\n"+data.link;
    document.getElementById("div_contenedor_popup").style.display="block";
    await sleep(100);
    document.getElementById("div_contenedor_popup").classList.remove("hide");
    document.getElementById("div_contenedor_popup").classList.add("show");
  }else if(label == "contacto" || label == "proceso"){
    //document.getElementById("contenedor_popup").className = "contenedor_popup extenso";
    var data = get_persona_cb(parseInt(item.id.split("share_etiqueta_")[1]))
    popup.imagen = imagenes_popup[label];
    popup.id = data.id;
    popup.titulo = data.nombre;
    popup.rango_salario = (data.aspiracion_max+"" != "undefined" && data.aspiracion_min+"" != "undefined" && (data.aspiracion_min+"").trim()+""+(data.aspiracion_max+"").trim() == "")?"":"Entre "+data.aspiracion_min+" y "+data.aspiracion_max;
    popup.ciudad = data.ciudad;
    popup.area = data.area;
    popup.sector = data.sector;
    popup.ultimo_login = data.ultimo_login;
    popup.subsector = data.subsector;
    popup.profesion = data.profesion;
    var contacto_def = "";
    if(app.sesion.data.admin == 1 || app.sesion.data.tipo == 13){
      contacto_def = data.mail+"\n"+data.telefono;
    }else{
      contacto_def = oculta_contenido(data.mail,"mail")+"\n"+oculta_contenido(data.telefono,"telefono");
    }
    popup.datos_contacto = contacto_def;
    popup.subtitulo = data.ultimo_cargo;
    popup.subtitulo2 = data.ultima_empresa;
    popup.titulo_texto1 = "Perfil";
    
    popup.texto1 = (typeof data.cargos_aplica != "undefined" && data.cargos_aplica.trim() != "")?data.cargos_aplica:"El usuario aun no tiene su perfil actualizado";

    
    popup.logros = (typeof data.logros != "undefined" && data.logros != "")?data.logros:"El usuario no ha cargado sus logros";
    
    
    popup.titulo_texto2 = "¿Cual es la mejor forma de comunicarme con "+data.nombre.split(" ")[0]+"?";
    var esta = false;
    for(var o in crystal_styles){
      if(crystal_styles[o].name.toLowerCase() == data.crystal){
        popup.texto2 = "El es un "+crystal_styles[o].name+" por lo cual te recomendamos lo siguientes puntos a tener en cuenta:\n"+crystal_styles[o].advise;
        esta = true;
        break;
      }
    }
    if(typeof data.comentarios != "undefined" && data.comentarios.length > 0){
      popup.titulo_texto3 = "¿Que dicen los que han interactuado con "+data.nombre.split(" ")[0]+"?";

      var comentarios = conteo_atributos(data.comentarios);
      var predominante = "";
      var porcentaje_predominante = 0;
      for(var o in comentarios){
        if(comentarios[o] > porcentaje_predominante){
          predominante = o;
        }
        popup.texto3+= comentarios[o]+"% "+o+" ";
      }
      popup.texto3+= ", así que ten lo siguiente en cuenta: \n"+disc_styles[predominante];
    }
    if(!esta){
      popup.texto2 = crystal_styles[17].advise;
    }
    popup.link = data.linkedin;
    popup.resumen = data.nombre+" - "+data.ultimo_cargo+" en "+data.ultima_empresa+"\n"+
    "-Datos de contacto: \n"+contacto_def+"\n"+data.linkedin+"\n"+
    "-¿Cual es la mejor forma de comunicarme con "+data.nombre.split(" ")[0]+"?\n"+
    popup.texto2+"\n"+
    popup.titulo_texto3+"\n"+
    popup.texto3;

    
    document.getElementById("div_contenedor_popup").style.display="block";
    await sleep(100);
    document.getElementById("div_contenedor_popup").classList.remove("hide");
    document.getElementById("div_contenedor_popup").classList.add("show");
    if(typeof item.id != "undefined" && !item.id.includes("buscar_") ){

      document.getElementById("sub_contenedor_popup_datos").className = "sub_contenedor_popup left";
      if(app.usuario.tipo != 13){
        await sleep(100);
      //document.getElementById("contenedor_popup").classList.add("extenso");
      
      get_network_filtered([data.id]);
    }
  }

}
document.getElementById("sub_contenedor_popup_comentarios").style.display="none";
}
function eliminar_comentario(o){
  var id_com = parseInt(o.id.split("eliminar_comentario_")[1]);
  delete_comentario(id_session,popup.id_et,id_com)
}
function enviar_comentario(){
  var txt = document.getElementById("input_comentario").value;
  if(txt.trim() != ""){
    var fecha = new Date().getFullYear() + "-" + (new Date().getMonth()+1) + "-" + new Date().getDate();
    create_comentario(txt,fecha,id_session,popup.id_et);
    document.getElementById("input_comentario").value = "";
  }
}
function crear_contacto(){
  document.getElementById("opciones_cargar_contacto").style.display = "block";
}
async function share_etiqueta(o,event){
  event.stopPropagation();
  document.getElementById("input_comentario").value = "";
  //document.getElementById("contenedor_popup").className = "contenedor_popup extenso";
  var id_et = parseInt(o.id.split("share_etiqueta_")[1])
  var i = "";
  var data = null;
  for(var w = 0; w< app.etiquetas.length;w++){
    if(app.etiquetas[w].id == id_et){
      i = app.etiquetas[w].label;
      data = JSON.parse(JSON.stringify(app.etiquetas[w]));
    }
  }
  var indice = (data.label == "proceso")?"etiqueta_"+data.label+"_"+data.tipo_proceso:"etiqueta_"+data.label;
  //popup.contenido = link_teachable+videos[indice].id;
  popup.keywords = [];
  //popup.texto_contenido =videos[indice].titulo_video;
  popup.imagen = imagenes_popup[data.label];
  popup.id_et = data.id;
  if(data.hasOwnProperty("comentarios")){
    popup.comentarios = data.comentarios;
  }else{
    popup.comentarios = [];
  }
  popup.label = data.label;
  switch(data.label){

    case "contacto":
    data.data = get_persona_cb(data.data.id)
    popup.id = data.data.id;
    popup.titulo = data.data.nombre;
    popup.rango_salario = (typeof data.data.aspiracion_min != "undefined" && (data.data.aspiracion_min+"").trim()+""+(data.data.aspiracion_max+"").trim() == "")?"":"Entre "+data.data.aspiracion_min+" y "+data.data.aspiracion_max;
    popup.subtitulo = data.data.ultimo_cargo;
    popup.subtitulo2 = data.data.ultima_empresa;
    popup.titulo_texto1 = "Perfil";
    popup.ciudad = data.data.ciudad;
    popup.area = data.data.area;
    popup.sector = data.data.sector;
    popup.ultimo_login = data.data.ultimo_login;
    popup.subsector = data.data.subsector;
    popup.profesion = data.data.profesion;
    popup.logros = (typeof data.data.logros != "undefined" && data.data.logros != "")?data.data.logros:"El usuario no ha cargado sus logros";
    popup.texto1 = (typeof data.data.cargos_aplica != "undefined" && data.data.cargos_aplica.trim() != "")?data.data.cargos_aplica:"El usuario aun no tiene su perfil actualizado";

    var contacto_def = "";
    if(app.sesion.data.admin == 1 || app.sesion.data.tipo == 13){
      contacto_def = data.data.mail+"\n"+data.data.telefono;
    }else{
      contacto_def = oculta_contenido(data.data.mail,"mail")+"\n"+oculta_contenido(data.data.telefono,"telefono");
    }
    popup.datos_contacto = contacto_def;
    //popup.titulo_texto1 = "Datos de contacto";
    //popup.texto1 = (data.data.mail.trim()+""+(data.data.telefono+"").trim() != "")?data.data.mail+"\n"+data.data.telefono:"No hay datos de contacto";
    popup.titulo_texto2 = "¿Cual es la mejor forma de comunicarme con "+data.data.nombre.split(" ")[0]+"?";
    var esta = false;
    for(var o in crystal_styles){
      if(crystal_styles[o].name.toLowerCase() == data.data.crystal){
        popup.texto2 = "El es un "+crystal_styles[o].name+" por lo cual te recomendamos lo siguientes puntos a tener en cuenta:\n"+crystal_styles[o].advise;
        esta = true;
        break;
      }
    }
    if(typeof data.data.comentarios != "undefined" && data.data.comentarios.length > 0){
      popup.titulo_texto3 = "¿Que dicen los que han interactuado con "+data.data.nombre.split(" ")[0]+"?";

      var comentarios = conteo_atributos(data.data.comentarios);
      var predominante = "";
      var porcentaje_predominante = 0;
      for(var o in comentarios){
        if(comentarios[o] > porcentaje_predominante){
          predominante = o;
        }
        popup.texto3+= comentarios[o]+"% "+o+" ";
      }
      popup.texto3+= ", así que ten lo siguiente en cuenta: \n"+disc_styles[predominante];
    }
    if(!esta){
      popup.texto2 = crystal_styles[17].advise;
    }
    popup.link = data.data.linkedin;
    popup.resumen = data.data.nombre+" - "+data.data.ultimo_cargo+" en "+data.data.ultima_empresa+"\n"+
    "-Datos de contacto: \n"+data.data.mail+"\n"+data.data.linkedin+"\n"+
    "-¿Cual es la mejor forma de comunicarme con "+data.data.nombre.split(" ")[0]+"?\n"+
    popup.texto2+"\n"+
    popup.titulo_texto3+"\n"+
    popup.texto3;
    break;
    case "oportunidad":
    data.data = get_vacante_cb(data.data.id)
    var tmp_list = [];
    if(typeof data.data["req"] != "undefined"){
      tmp_list = data.data["req"].split(".");
      for(u in tmp_list){
        tmp_list[u] = tmp_list[u].replaceAll("\n"," ").trim();
      }
      popup.keywords = tmp_list;
    }
    
    popup.id = data.data.id;
    popup.titulo = data.data.cargo;
    popup.subtitulo = "Vacante";
    popup.subtitulo2 = data.data.empresa;
    popup.titulo_texto1 = (popup.keywords.length == 0)?"":"Requisitos";
    popup.texto1 = (data.data.req != "undefined")?data.data.req:"No esta especificado";
    popup.titulo_texto2 = "Descripción de la vacante";
    popup.texto2 = (data.data.obs != "")?data.data.obs:"Esta vacante no tiene descripción";
    popup.titulo_texto3 = "";
    popup.texto3 = "Salario entre "+data.data.rango_menor+" y "+data.data.rango_mayor+" en "+data.data.ciudad;
    popup.link = data.data.link;
    popup.resumen = data.data.cargo+" en "+data.data.empresa+"\n"+
    data.data.link;
    
    break;
    case "proceso":
    data.data_persona = get_persona_cb(data.data_persona.id)
    popup.id = data.data_persona.id;
    popup.titulo = data.data_persona.nombre;
    popup.subtitulo = data.data_persona.ultimo_cargo;
    popup.subtitulo2 = data.data_persona.ultima_empresa;
    popup.titulo_texto1 = "Datos de contacto para "+tipos_procesos[parseInt(data.tipo_proceso)].texto;
    popup.texto1 = (data.data_persona.mail.trim()+""+(data.data_persona.telefono+"").trim() != "")?data.data_persona.mail+"\n"+data.data_persona.telefono:"No hay datos de contacto";;
    popup.titulo_texto2 = "¿Cual es la mejor forma de comunicarme con "+data.data_persona.nombre.split(" ")[0]+"?";
    var esta = false;
    popup.texto2 = "Ten muy presente las responsabilidades y necesidades para el cargo de "+ data.data_vacante.cargo+"\n";
    for(var o in crystal_styles){
      if(crystal_styles[o].name.toLowerCase() == data.data_persona.crystal){
        popup.texto2 += "El es un "+crystal_styles[o].name+" por lo cual te recomendamos lo siguientes puntos a tener en cuenta:\n"+crystal_styles[o].advise;
        esta = true;
        break;
      }
    }
    if(typeof data.data_persona.comentarios != "undefined" && data.data_persona.comentarios.length > 0){
      popup.titulo_texto3 = "¿Que dicen los que han interactuado con "+data.data_persona.nombre.split(" ")[0]+"?";

      var comentarios = conteo_atributos(data.data_persona.comentarios);
      var predominante = "";
      var porcentaje_predominante = 0;
      for(var o in comentarios){
        if(comentarios[o] > porcentaje_predominante){
          predominante = o;
        }
        popup.texto3+= comentarios[o]+"% "+o+" ";
      }
      popup.texto3+= ", así que ten lo siguiente en cuenta: \n"+disc_styles[predominante];
    }
    if(!esta){
      popup.texto2 = crystal_styles[17].advise;
    }
    popup.link = data.data_persona.linkedin;
    popup.resumen = data.data_persona.nombre+" - "+data.data_persona.ultimo_cargo+" en "+data.data_persona.ultima_empresa+"\n"+
    "-Datos de contacto: \n"+data.data_persona.mail+"\n"+data.data_persona.linkedin+"\n"+
    "-¿Cual es la mejor forma de comunicarme con "+data.data_persona.nombre.split(" ")[0]+"?\n"+
    popup.texto2+"\n"+
    popup.titulo_texto3+"\n"+
    popup.texto3;
    break;
  }
  document.getElementById("sub_contenedor_popup_datos").className = "sub_contenedor_popup left2";
  
  document.getElementById("sub_contenedor_popup_comentarios").style.display="block";
  document.getElementById("div_contenedor_popup").style.display="block";
  await sleep(100);
  document.getElementById("div_contenedor_popup").classList.remove("hide");
  document.getElementById("div_contenedor_popup").classList.add("show");

}
function cargar_novedad(){
  accion = "crear_observacion";
  call2action();
}
function edit_etiqueta(o,event){
  event.stopPropagation();
  var id_et = parseInt(o.id.split("etiqueta_")[1])
  var i = "";
  var data = null;
  for(var w = 0; w< app.etiquetas.length;w++){
    if(app.etiquetas[w].id == id_et){
      i = app.etiquetas[w].label;
      data = app.etiquetas[w];
    }
  }
  accion = "editar_"+config[i].div;
  tmp_etiqueta = id_et
  for(var j in config){
    if(config[j].div == config[i].div){
      document.getElementById("div_crear_"+config[i].div).style.display="block";
    }else{
      try{
        document.getElementById("div_crear_"+config[j].div).style.display="none";
      }catch(e){
        console.log("no esta");
      }
    }

  }
  show_contenedor("contenedor_right",config[i])

  switch(config[i].div){

    case "contacto":
    data.data = get_persona_cb(data.data.id);
    document.getElementById("id_contacto").value = data.data.id;
    document.getElementById("linkedin_contacto").value = data.data.linkedin;
    document.getElementById("nombre_contacto").value = data.data.nombre;
    document.getElementById("cargo_contacto").value = data.data.ultimo_cargo;
    document.getElementById("empresa_contacto").value = data.data.ultima_empresa;
    document.getElementById("mail_contacto").value = data.data.mail;
    document.getElementById("telefono_contacto").value = data.data.telefono;
    document.getElementById("tipo_contacto").value = data.nivel;
    document.getElementById("crystal_contacto").value = data.data.crystal;
    document.getElementById("personalidad_contacto").value = data.personalidad;
    document.getElementById("obs_contacto").value = data.obs;

    break;


    case "oportunidad":
    data.data = get_vacante_cb(data.data.id)

    document.getElementById("id_oportunidad").value = data.data.id;
    document.getElementById("empresa_oportunidad").value = data.data.empresa;
    document.getElementById("cargo_oportunidad").value = data.data.cargo;
    document.getElementById("ciudad_oportunidad").value = data.data.ciudad;
    document.getElementById("link_oportunidad").value = data.data.link;
    document.getElementById("rango_menor_oportunidad").value = data.data.rango_menor;
    document.getElementById("rango_mayor_oportunidad").value = data.data.rango_mayor;
    document.getElementById("tipo_oportunidad").value = data.data.tipo;
    try{
      document.getElementById("postulacion_oportunidad").checked = (data.data.postulacion == "true")?true:false;
    }catch(e){
      document.getElementById("postulacion_oportunidad").checked = false;
    }
    document.getElementById("tipo_servicio").value = (data.data.recompensa == "" || typeof data.data.recompensa == "undefined")?"no":"recompensa";
    document.getElementById("recompensa").value = (typeof data.data.recompensa != "undefined")?data.data.recompensa:"";
    document.getElementById("obs_oportunidad").value = data.data.obs;
    //document.getElementById("req_oportunidad").value = data.data.req;
    document.getElementById("oportunidad_oculto").checked = data.data.oculta;
    document.getElementById("oportunidad_protegido").checked = data.protegido;
    document.getElementById("cumplimiento_100").value = data.cumple;
    var reqs = data.data.req.split(",")
    for(var i = 0; i < reqs.length;i++){
      document.getElementById("req"+(i+1)).value = reqs[i]
    }


    break;
    case "proceso":
    data.data_persona = get_persona_cb(data.id_persona);
    data.data_vacante = get_vacante_cb(data.id_objeto);
    document.getElementById("id_vacante_proceso").value =data.id_objeto;
    document.getElementById("id_contacto_proceso").value =data.id_persona;
    document.getElementById("cargo_proceso").value =data.data_vacante.cargo;
    document.getElementById("fecha_proceso").value =data.fecha_proceso;
    document.getElementById("empresa_contacto_proceso").value =data.data_vacante.empresa;
    document.getElementById("cargo_contacto_proceso").value =data.data_persona.ultimo_cargo;
    document.getElementById("nombre_contacto_proceso").value =data.data_persona.nombre;
    document.getElementById("linkedin_contacto_proceso").value =data.data_persona.linkedin;
    document.getElementById("mail_contacto_proceso").value =data.data_persona.mail;
    document.getElementById("crystal_contacto_proceso").value =data.data_persona.crystal;
    document.getElementById("telefono_proceso").value =data.data_persona.telefono;
    document.getElementById("tipo_proceso").value =data.tipo_proceso;
    document.getElementById("obs_proceso").value=data.obs;

    break;
    case "observacion":
    document.getElementById("observacion").value=data.valor;
    break;
  }
  close_popup(1);
}
function edit_item(o,event,tipo){
  event.stopPropagation();
  var id_et = parseInt(o.id.split("item_")[1])
  var i = tipo;
  var data = null;
  
  accion = "editar_"+config[i].div;
  tmp_etiqueta = id_et;
  for(var j in config){
    if(config[j].div == config[i].div){
      document.getElementById("div_crear_"+config[i].div).style.display="block";
    }else{
      try{
        document.getElementById("div_crear_"+config[j].div).style.display="none";
      }catch(e){
        console.log("no esta");
      }
    }

  }
  show_contenedor("contenedor_right",config[i])

  switch(config[i].div){

    case "contacto":
    data = get_persona_cb(parseInt(id_et));
    document.getElementById("id_contacto").value = data.id;
    document.getElementById("linkedin_contacto").value = data.linkedin;
    document.getElementById("nombre_contacto").value = data.nombre;
    document.getElementById("cargo_contacto").value = data.ultimo_cargo;
    document.getElementById("empresa_contacto").value = data.ultima_empresa;
    document.getElementById("mail_contacto").value = data.mail;
    document.getElementById("telefono_contacto").value = data.telefono;
    document.getElementById("crystal_contacto").value = data.crystal;

    break;


    case "oportunidad":
    data = get_vacante_cb(parseInt(id_et))

    document.getElementById("id_oportunidad").value = data.id;
    document.getElementById("empresa_oportunidad").value = data.empresa;
    document.getElementById("cargo_oportunidad").value = data.cargo;
    document.getElementById("ciudad_oportunidad").value = data.ciudad;
    document.getElementById("link_oportunidad").value = data.link;
    document.getElementById("rango_menor_oportunidad").value = data.rango_menor;
    document.getElementById("rango_mayor_oportunidad").value = data.rango_mayor;
    document.getElementById("tipo_oportunidad").value = data.tipo;
    document.getElementById("obs_oportunidad").value = data.obs;
    //document.getElementById("req_oportunidad").value = data.req;


    break;

  }
}
function crear(i){
  if(window.mobileCheck()){
    if(window.location.href.includes("/app")){
      cambiar('inicio')  
    }
    
  }
  try{
    close_opciones_cargar();
  }catch(e){
    console.log("ni idea por que nos e puede")
  }
  accion = "crear_"+config[i].div;
  if(i == "oportunidad" && app.usuario.tipo == 13){
    document.getElementById("empresa_oportunidad").value = app.usuario.ultima_empresa;
  }
  if(i == "proceso"){
    var datav = get_vacante_cb(parseInt(popup_servicios.id))
    document.getElementById("id_vacante_proceso").value = popup_servicios.id;
    document.getElementById("cargo_proceso").value = datav.cargo;
    document.getElementById("empresa_contacto_proceso").value = datav.empresa;
  }
  
  for(var j in config){
    if(config[j].div == config[i].div){
      document.getElementById("div_crear_"+config[i].div).style.display="block";
      if(!window.location.href.includes("/content") && !window.location.href.includes("/people") && !window.location.href.includes("/admin") && !window.location.href.includes("/app") && !window.location.href.includes("/activacion") && !window.location.href.includes("/login") && !window.location.href.includes("/profile") && !window.location.href.includes("/verificacion")){

        if(config[i].div == "login"){
          document.getElementById("div_info_login").style.display = "block";
          document.getElementById("boton_call2action").style.display = "none";
          document.getElementById("div_info_oportunidad").style.display = "none";
        }else if(config[i].div == "oportunidad"){
          document.getElementById("div_info_oportunidad").style.display = "block";
          document.getElementById("div_info_login").style.display = "none";
          document.getElementById("boton_call2action").style.display = "block";

        }
      }
    }else{
      try{
        document.getElementById("div_crear_"+config[j].div).style.display="none";
      }catch(e){
        console.log("no esta");
      }
    }

  }
  show_contenedor("contenedor_right",config[i])

}

async function show_popup_video(o){
  console.log("reproducir video",o)
  close_popup(3);
  if(videos[o].link == ""){
    document.getElementById("player").style.display = "none";
    document.getElementById("sorry").style.display = "block";
  }else{
    document.getElementById("sorry").style.display = "none";
    document.getElementById("player").style.display = "block";
  player.loadVideoById(videos[o].link);
  
  player.playVideo();
}
  //video.descripcion_video = info_video.descripcion_video;
  //video.titulo_video = info_video.titulo_video;

  document.getElementById("div_contenedor_video").style.display="block";
  await sleep(100);
  document.getElementById("div_contenedor_video").classList.remove("hide");
  document.getElementById("div_contenedor_video").classList.add("show");
}
function close_popup_atts(o){
  document.getElementById(o.id.split("_close")[0]).classList.add("hidden");
}
function show_popup_atts(o){
  o.parentNode.getElementsByTagName("div")[0].classList.remove("hidden");
  //document.getElementById(o.id.split("_show")[0]).classList.remove("hidden");
}
function selecciona_order(o){
  var tmp = o.id.split("_att_");
  var div = tmp[0];
  var att = tmp[1];
  for(var i in contenedores_listas){
    if(contenedores_listas[i].div == div){      
      var lista = contenedores_listas[i].server_identifier;
      for (var ww in contenedores_listas[i].lista_atts_orden["Orden:"]){

        if(contenedores_listas[i].lista_atts_orden["Orden:"][ww].id == att){
          var asc = contenedores_listas[i].lista_atts_orden["Orden:"][ww].asc;
          if(typeof lista != "undefined"){
            document.getElementById(div+"_popup_orden").classList.add("hidden"); 
            contenedores_listas[i].order = att; 
            contenedores_listas[i].asc = contenedores_listas[i].lista_atts_orden["Orden:"][ww].asc;
            if(lista == "admin"){
              order_items("vacantes",att,asc);  
              order_items("contactos",att,asc);  
            }else{
              order_items(lista,att,asc);
            }
            
          }
          break;
        }
      }
    }
  }

}
function selecciona_att(o){
  var tmp = o.id.split("_att_");
  var div = tmp[0];
  var att = tmp[1];
  for(var i in contenedores_listas){
    if(contenedores_listas[i].div == div){
      contenedores_listas[i].att_tmp = att;  
      document.getElementById(div+"_popup_filtro").classList.add("hidden");
    }
  }

}
function borrar_att_tmp(o){
  var tmp = o.id.split("_att_tmp");
  var div = tmp[0];
  for(var i in contenedores_listas){
    if(contenedores_listas[i].div == div){
      contenedores_listas[i].att_tmp = "";  

    }
  }

}
async function borrar_filtro(o){

  var div = o.id.split("borrar_")[1].split("-")[0];
  var index = parseInt(o.id.split("-")[1]);
  for(var i in contenedores_listas){
    if(contenedores_listas[i].div == div){

      contenedores_listas[i].filtros.splice(index,1);
      if(contenedores_listas[i].filtros.length == 0){
        contenedores_listas[i].order = "fecha";
        contenedores_listas[i].asc = 0;  
      }
      if(typeof contenedores_listas[i].server_identifier != "undefined"){
        if(contenedores_listas[i].server_identifier == "admin"){
          filtrar_listas(conlis_objetos_admin.filtros,"contactos",conlis_objetos_admin.order,conlis_objetos_admin.asc)
          filtrar_listas(conlis_objetos_admin.filtros,"vacantes",conlis_objetos_admin.order,conlis_objetos_admin.asc)
        }else{
          filtrar_listas(contenedores_listas[i].filtros,contenedores_listas[i].server_identifier,contenedores_listas[i].order,contenedores_listas[i].asc)
        }
      }
    }
  }
  
}

async function keyword_selected(e,o){

  if (e.key=="Enter") {
    for(var i in contenedores_listas){
      if(contenedores_listas[i].div == o.id && o.value.trim().replace(/(\r\n|\n|\r)/gm,"") != ""){
        if("att_tmp" in contenedores_listas[i] && contenedores_listas[i].att_tmp != ""){
          if(!o.value.includes(",")){
            contenedores_listas[i].filtros.push("#"+contenedores_listas[i].att_tmp+": "+o.value);
          }else{
            var tmp_filters = o.value.split(",");
            for(var m in tmp_filters){
              contenedores_listas[i].filtros.push("#"+contenedores_listas[i].att_tmp+": "+tmp_filters[m]);
            }
          }
          contenedores_listas[i].att_tmp = "";
          

        }else{
          contenedores_listas[i].order = "coincidencia";
          contenedores_listas[i].asc = 0;
          if(!o.value.includes(",")){
            contenedores_listas[i].filtros.push(o.value);
          }else{
            var tmp_filters = o.value.split(",");
            for(var m in tmp_filters){
              contenedores_listas[i].filtros.push(tmp_filters[m]);
            }
          }
        }
        console.log(contenedores_listas[i],"controlado....")
        if(typeof contenedores_listas[i].server_identifier != "undefined"){
          if(contenedores_listas[i].server_identifier == "admin"){
            filtrar_listas(conlis_objetos_admin.filtros,"contactos",conlis_objetos_admin.order,conlis_objetos_admin.asc)
            filtrar_listas(conlis_objetos_admin.filtros,"vacantes",conlis_objetos_admin.order,conlis_objetos_admin.asc)
          }else{
            filtrar_listas(contenedores_listas[i].filtros,contenedores_listas[i].server_identifier,contenedores_listas[i].order,contenedores_listas[i].asc)
          }
        }
      }
    }
    document.getElementById(o.id).value = "";
  }
}

function verify_data(i){

  switch(accion){
    case "crear_cargue_masivo":
    return false;
    break;
    case "crear_contacto_perfil":
    if(document.getElementById("tipo_contacto_perfil").value.trim() == ""){
      mostrar_mensaje_flotante("error","El nivel de relacionamiento del contacto es obligatorio");
      return false;
    }
    return true;
    break;
    case "crear_contacto":
    case "editar_contacto":
    if(document.getElementById("nombre_contacto").value.trim() == ""){
      mostrar_mensaje_flotante("error","El nombre del contacto es obligatorio");
      return false;
    }
    if(document.getElementById("cargo_contacto").value.trim() == ""){
      mostrar_mensaje_flotante("error","El cargo del contacto es obligatorio");
      return false;
    }
    if(document.getElementById("empresa_contacto").value.trim() == ""){
      mostrar_mensaje_flotante("error","La empresa del contacto es obligatorio");
      return false;
    }
    if(document.getElementById("tipo_contacto").value.trim() == ""){
      mostrar_mensaje_flotante("error","El nivel de relacionamiento del contacto es obligatorio");
      return false;
    }
    return true;
    
    break;
    case "crear_oportunidad":
    case "editar_oportunidad":


    if(document.getElementById("empresa_oportunidad").value.trim() == ""){
      mostrar_mensaje_flotante("error","La empresa es obligatoria");
      return false;
    }
    if(document.getElementById("cargo_oportunidad").value.trim() == ""){
      mostrar_mensaje_flotante("error","El cargo es obligatorio");
      return false;
    }
    
    if(adm.representaciones != "No tienes créditos" && typeof adm.representaciones != "undefined"){
      /*if(document.getElementById("cumplimiento_100").value.trim() == ""){
        mostrar_mensaje_flotante("error","Debes especificar si deseas ayuda con tu vacante");
        return false;
      }*/
    }else{
      document.getElementById("cumplimiento_100").value ="false";
    }
    //if(document.getElementById("ciudad_oportunidad").value.trim() == ""){
    //  mostrar_mensaje_flotante("error","La ciudad es obligatoria");
    //  return false;
    //}
    //var words_obs = document.getElementById("obs_oportunidad").value.trim().split(" ");
    if(app.usuario.tipo == 13 || app.sesion.data.admin == 1){
      if(document.getElementById("req1").value.trim() == "" ||
        document.getElementById("req2").value.trim() == "" ||
        document.getElementById("req3").value.trim() == "" ||
        document.getElementById("req4").value.trim() == "")
      {
        mostrar_mensaje_flotante("error","Debe diligenciar por lo menos 4 requerimientos");
        return false;
      }
      //if(words_obs.length < 3){
      //  mostrar_mensaje_flotante("error","La descripción de la oportunidad debe tener mínimo 3 palabras.");
      //  return false;
      //}
    }else{
      //if(words_obs.length < 10){
      //  mostrar_mensaje_flotante("error","La descripción de la oportunidad debe tener mínimo 10 palabras.");
      //  return false;
      //}

    }
    return true;
    break;

    case "crear_observacion":
    case "editar_observacion":
    if(document.getElementById("input_novedad").value.trim() == ""){
      mostrar_mensaje_flotante("error","El campo observaciones es obligatorio");
      return false;
    }
    return true;    
    break;

    case "crear_proceso":
    case "editar_proceso":
    if(document.getElementById("cargo_proceso").value.trim() == ""){
      mostrar_mensaje_flotante("error","Debes diligenciar el cargo de la vacante");
      return false;
    }
    if(document.getElementById("empresa_contacto_proceso").value.trim() == ""){
      mostrar_mensaje_flotante("error","Debes diligenciar la empresa de la vacante");
      return false;
    } 
    if(document.getElementById("cargo_contacto_proceso").value.trim() == ""){
      mostrar_mensaje_flotante("error","Debes diligenciar el cargo de tu contacto");
      return false;
    } 
    if(document.getElementById("nombre_contacto_proceso").value.trim() == ""){
      mostrar_mensaje_flotante("error","Debes diligenciar el nombre de tu contacto");
      return false;
    }

    if(document.getElementById("tipo_proceso").value.trim() == ""){
      mostrar_mensaje_flotante("error","Debes diligenciar el tipo de proceso que estas cursando");
      return false;
    }
    if(document.getElementById("mail_contacto_proceso").value.trim() != "" || document.getElementById("telefono_proceso").value.trim() != ""){
      return true;
    }else{
      mostrar_mensaje_flotante("error","Debes diligenciar un correo o un telefono de contacto del proceso");
      return false;
    }
    return true;
    break;
    case "crear_usuario_index":
    if(document.getElementById("empresa_oportunidad").value.trim() == ""){
      mostrar_mensaje_flotante("error","La empresa es obligatoria");
      return false;
    }
    if(document.getElementById("cargo_oportunidad").value.trim() == ""){
      mostrar_mensaje_flotante("error","El cargo es obligatorio");
      return false;
    }

    if(document.getElementById("tipo_servicio").value == "recompensa"){
      if(document.getElementById("recompensa").value.trim() == ""){
        mostrar_mensaje_flotante("error","Si vas a dar recompensa, debes especificar el valor");
        return false;
      }

    }

    /*var words_obs = document.getElementById("obs_oportunidad").value.trim().split(" ");

    if(words_obs.length < 10){
      mostrar_mensaje_flotante("error","La descripción de la oportunidad debe tener mínimo 10 palabras.");
      return false;
    }*/
    

    if(document.getElementById("req1").value.trim() == "" ||
      document.getElementById("req2").value.trim() == "" ||
      document.getElementById("req3").value.trim() == "" )
    {
      mostrar_mensaje_flotante("error","Debes tener por lo menos 3 criterios obligatorios para esta vacante");
      return false;
    }

    if(document.getElementById("nombre_usuario").value.trim() == "" ||
      document.getElementById("empresa_oportunidad").value.trim() == "" ||
      document.getElementById("correo_usuario").value.trim() == "" ||
      document.getElementById("telefono_usuario").value.trim() == "")
    {
      mostrar_mensaje_flotante("error","Faltan datos por diligenciar");
      return false;
    }
    return true; 
    break; 
    case "crear_usuario":
    case "editar_usuario":
    if(document.getElementById("linkedin_usuario").value.trim() == "" ||
      document.getElementById("nombre_usuario").value.trim() == "" ||
      document.getElementById("cargo_usuario").value.trim() == "" ||
      document.getElementById("empresa_usuario").value.trim() == "" ||
      document.getElementById("mail_usuario").value.trim() == "" ||
      document.getElementById("telefono_usuario").value.trim() == "" ||
      document.getElementById("aspiracion_min_usuario").value.trim() == "" ||
      document.getElementById("aspiracion_max_usuario").value.trim() == "" ||
      document.getElementById("area_usuario").value.trim() == "" ||
      document.getElementById("estado_usuario").value.trim() == "")
    {
      mostrar_mensaje_flotante("error","Faltan datos por diligenciar");
      return false;
    }
    return true; 
    break; 
    case "crear_job_hacker":
    case "editar_job_hacker":
    if(document.getElementById("nombre_job_hacker").value.trim() == "" ||
      document.getElementById("cargo_job_hacker").value.trim() == "" ||
      document.getElementById("empresa_job_hacker").value.trim() == "" ||
      document.getElementById("mail_job_hacker").value.trim() == "" ||
      document.getElementById("telefono_job_hacker").value.trim() == "")
    {
      mostrar_mensaje_flotante("error","Faltan datos por diligenciar");
      return false;
    }

    return true; 
    break;
    case "crear_sesion":
    case "editar_sesion":
    return true;
  }
}

function select_recom(i,o){
  var id = o.id.split("_reco")[0];
  
  if(id.includes("ANDD")){
    var ids = id.split("ANDD");
    var texto =  o.innerHTML.trim();
    for(var jj = 0;jj<ids.length;jj++){
      var b = document.getElementById(ids[jj]);
      b.value = texto.split("--")[jj].trim()

    }
    var b = document.getElementById(id);
    recomendaciones(i,b)

  }else{
    var b = document.getElementById(id);
    b.value = o.innerHTML.trim();
    recomendaciones(i,b)
  }
  
}

function remove_recom(i){
  listas_recomendacion[i].objeto.recomendaciones =[];
  listas_recomendacion[i].objeto.recom_sel = -1; 
}
function selecciona_tipo_servicio(){
  var val = document.getElementById("tipo_servicio").value;
  if(val != "recompensa"){
    document.getElementById("div_recompensa").style.display = "none";
    document.getElementById("recompensa").value = "";
  }else{
    document.getElementById("div_recompensa").style.display = "block";
  }
}


function explore_recom(e,i,o){
  var evento = false;
  var selected = false;
  switch(e.key){
    case "ArrowDown":
    evento = true;
    if(listas_recomendacion[i].objeto.recomendaciones.length == 0){
      recomendaciones(i,o)
    }
    if(listas_recomendacion[i].objeto.recom_sel < listas_recomendacion[i].objeto.recomendaciones.length-1){
      listas_recomendacion[i].objeto.recom_sel ++;
    }else{
      listas_recomendacion[i].objeto.recom_sel = 0;
    }

    break;
    case "ArrowUp":
    evento = true;
    if(listas_recomendacion[i].objeto.recom_sel > -1){
      listas_recomendacion[i].objeto.recom_sel --;
    }else{
      listas_recomendacion[i].objeto.recom_sel = listas_recomendacion[i].objeto.recomendaciones.length-1;
    }
    break;
    case "Enter":
    selected = true;
    evento = true;
    break;
    case "Escape":
    remove_recom(i)
    break;
  }
  if(evento){

    var objs = o.parentNode.getElementsByClassName("recomendaciones")[0].children;
    if(objs.length == 1 && selected){
      o.value = objs[0].innerHTML.trim();
      recomendaciones(i,objs[0])
    }else{
      for(var l in objs){

        if(typeof objs[l].id != "undefined"){
          if(selected){
            if(objs[l].id.includes("_reco"+listas_recomendacion[i].objeto.recom_sel)){
              o.value = objs[l].innerHTML.trim();
              recomendaciones(i,objs[l])
            }

          }else{
            if(objs[l].id.includes("_reco"+listas_recomendacion[i].objeto.recom_sel)){
              objs[l].classList.add("focus");
            }else{
              objs[l].classList.remove("focus");
            }
          }
        }
      }
    }
  }



}
function recomendaciones(i,o){
  var t = o.value;
  var salida = []
  listas_recomendacion[i].objeto.recom_sel = -1; 

  var comp = []
  listas_recomendacion[i].lista.forEach(element => comp.push(element.substr(0, t.length)));

  var f = fuzzball.extract(t, comp, {scorer: fuzzball.token_set_ratio,limit: 6,cutoff: 80});
  for(var w in f){
    salida.push(listas_recomendacion[i].lista[f[w][2]])
  }
  if(salida.length == 1 && standarize_attribute(salida[0] == standarize_attribute(t))){
   listas_recomendacion[i].objeto.recomendaciones = [];  

 }else if(t.trim() == ""){
  listas_recomendacion[i].objeto.recomendaciones =[];
}else{
  listas_recomendacion[i].objeto.recomendaciones = salida;
}



}
function selecciona_sesion(){
  formulario.sesion_seleccionada = document.getElementById("sesion").value;

}
function guardar_candidato(){
  label="contacto";
  
  tmp_etiqueta = 0;
  tmp_id = popup.id;
  accion = "crear_contacto";
  asociar_previo();
}
function enviar_postulacion(){
  label="contacto";
  id_session = popup_servicios.id_user;
  tmp_etiqueta = 0;
  tmp_id = app.usuario.id;
  accion = "crear_contacto";
  popup_servicios.postulando = 1;
  asociar_previo();
}
function call2action_many(){
  if(popup_many.label == "oportunidad"){
    for(var i = 0 ; i<popup_many.usuarios_seleccionados.length;i++){
      id_session = popup_many.usuarios_seleccionados[i].id;
      tmp_etiqueta = 0;
      tmp_id = popup_many.id;
      accion = "crear_oportunidad";
      asociar_previo();
    }
  }else if(popup_many.label == "contacto"){
    for(var i = 0 ; i<popup_many.usuarios_seleccionados.length;i++){
      id_session = popup_many.usuarios_seleccionados[i].id;
      tmp_etiqueta = 0;
      tmp_id = popup_many.id;
      accion = "crear_contacto";
      asociar_previo();
    }
  }
  id_session = app.usuario.id;
  tmp_etiqueta = -1;
  tmp_id = -1;
  accion = "";
  close_popup(2);
}
function parse_tipo_contacto(txt){
  if(txt.toLowerCase().trim() == "conocido"){
    return 2;
  }
  if(txt.toLowerCase().trim() == "confianza"){
    return 3;
  }
  if(txt.toLowerCase().trim() == "muy cercano"){
    return 4;
  }
  return "";
}
function call2action_user_vac(id){
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); 
  var yyyy = today.getFullYear();
  today = yyyy + '-' + mm + '-' + dd;
  var reqs = document.getElementById("req1").value+"."+ 
  document.getElementById("req2").value+"."+
  document.getElementById("req3").value+"."+
  document.getElementById("req4").value+"."+
  document.getElementById("req5").value;
  var desc = document.getElementById("obs_oportunidad").value;
  parametro = "id[["+document.getElementById("id_oportunidad").value+
  "]]empresa[["+document.getElementById("empresa_oportunidad").value+
  "]]cargo[["+document.getElementById("cargo_oportunidad").value+
  "]]ciudad[["+document.getElementById("ciudad_oportunidad").value+
  "]]link[["+document.getElementById("link_oportunidad").value+
  "]]rango_menor_oportunidad[["+document.getElementById("rango_menor_oportunidad").value+
  "]]rango_mayor_oportunidad[["+document.getElementById("rango_mayor_oportunidad").value+
  "]]cumple[["+document.getElementById("tipo_servicio").value+
  "]]postulacion[["+document.getElementById("postulacion_oportunidad").checked+
  "]]recompensa[["+document.getElementById("recompensa").value+
  "]]oculta[[false]]tipo_oportunidad[["+document.getElementById("tipo_oportunidad").value+
  "]]obs[["+desc+
  "]]req[["+reqs+"]]protegido[[false]]fecha[["+today+"]]";
  accion = "crear_oportunidad";
  console.log(id)
  crear_actualizar_objeto(parametro,"crear_oportunidad",0,id);
  
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
function call2action_index_vac(){
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); 
  var yyyy = today.getFullYear();
  today = yyyy + '-' + mm + '-' + dd;
  parametro = "nombre[["+document.getElementById("nombre_usuario").value+
  "]]mail[["+document.getElementById("correo_usuario").value+
  "]]pass[["+Math.random().toString(36).slice(-8)+"]]linkedin[[]]perfil_empresa[[true]]telefono[["+document.getElementById("telefono_usuario").value+
  "]]empresa[["+document.getElementById("empresa_oportunidad").value+
  "]]fecha[["+today+"]]";
  accion = "crear_usuario_index"
  if(verify_data(null)){
    crear_actualizar_objeto(parametro,"crear_usuario",-2,-2);
  }else{
    console.log("error con los datos")
  }


  
}
function call2action_data_perfil(){
  parametro = ""
}

function call2action(){
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); 
  var yyyy = today.getFullYear();
  if(accion.includes("crear")){
    tmp_etiqueta = 0;
  }
  today = yyyy + '-' + mm + '-' + dd;
  var parametro = "";
  switch(accion){
    case "crear_contacto_perfil":
    parametro = "linkedin[["+document.getElementById("linkedin_contacto_perfil").value+
    "]]mail[["+document.getElementById("mail_contacto_perfil").value+
    "]]verificacion_contacto[["+document.getElementById("verificacion_contacto_perfil").checked+
    "]]oculto[["+document.getElementById("contacto_oculto_perfil").checked+
    "]]telefono[["+document.getElementById("telefono_contacto_perfil").value+
    "]]nivel[["+document.getElementById("tipo_contacto_perfil").value+
    "]]personalidad[["+document.getElementById("personalidad_contacto_perfil").value+
    "]]obs[["+document.getElementById("obs_contacto_perfil").value+
    "]]fecha[["+today+"]]";

    break;
    case "crear_contacto_masivo":
    
    for(var o in formulario.csv_preview){
      var lin = (mixin.methods.valid_url(formulario.csv_preview[o].linkedin))?formulario.csv_preview[o].linkedin:"";
      parametro = "id[[]]linkedin[["+lin+
      "]]nombre[["+formulario.csv_preview[o].nombre+
      "]]cargo[["+formulario.csv_preview[o].cargo+
      "]]empresa[["+formulario.csv_preview[o].empresa+
      "]]mail[["+formulario.csv_preview[o].mail+
      "]]telefono[["+formulario.csv_preview[o].telefono+
      "]]nivel[["+parse_tipo_contacto(formulario.csv_preview[o].tipo_contacto)+
      "]]crystal[[]]personalidad[[]]obs[["+formulario.csv_preview[o].observacion+
      "]]fecha[["+today+"]]";
      crear_actualizar_objeto_csv(parametro,"crear_contacto",tmp_etiqueta,id_session,parse_tipo_contacto(formulario.csv_preview[o].tipo_contacto),formulario.csv_preview[o].observacion);
    }
    show_loading(false,"");
    mostrar_mensaje("ok","Contactos cargados");
    formulario.csv_preview = [];
    break;
    case "crear_contacto":
    case "editar_contacto":

    parametro = "id[["+document.getElementById("id_contacto").value+
    "]]linkedin[["+document.getElementById("linkedin_contacto").value+
    "]]verificacion_contacto[["+document.getElementById("verificacion_contacto").checked+
    "]]oculto[["+document.getElementById("contacto_oculto").checked+
    "]]nombre[["+document.getElementById("nombre_contacto").value+
    "]]cargo[["+document.getElementById("cargo_contacto").value+
    "]]empresa[["+document.getElementById("empresa_contacto").value+
    "]]mail[["+document.getElementById("mail_contacto").value+
    "]]telefono[["+document.getElementById("telefono_contacto").value+
    "]]nivel[["+document.getElementById("tipo_contacto").value+
    "]]crystal[["+document.getElementById("crystal_contacto").value+
    "]]personalidad[["+document.getElementById("personalidad_contacto").value+
    "]]obs[["+document.getElementById("obs_contacto").value+
    "]]fecha[["+today+"]]";

    break;


    case "crear_oportunidad":
    case "editar_oportunidad":
    var checked = "";
    try{
      checked = "]]protegido[["+document.getElementById("oportunidad_protegido").checked;
    }catch(e){
      checked = "]]protegido[[true";
    }
    var obs2 ="";
    var servicio_v = "";
    var postulacion = "";
    var reqs = "";
    if(app.usuario.tipo == 13 || app.sesion.data.admin == 1){
      obs2 = document.getElementById("obs_oportunidad").value;  
      reqs = document.getElementById("req1").value+","
      +document.getElementById("req2").value+","
      +document.getElementById("req3").value+","
      +document.getElementById("req4").value+","
      +document.getElementById("req5").value;
      servicio_v = document.getElementById("tipo_servicio").value;

      postulacion = document.getElementById("postulacion_oportunidad").checked;

    }else{
      //reqs =document.getElementById("req_oportunidad").value;
      obs2 = document.getElementById("obs_oportunidad").value;
      servicio_v = document.getElementById("cumplimiento_100").value;
    }

    parametro = "id[["+document.getElementById("id_oportunidad").value+
    "]]empresa[["+document.getElementById("empresa_oportunidad").value+
    "]]cargo[["+document.getElementById("cargo_oportunidad").value+
    "]]ciudad[["+document.getElementById("ciudad_oportunidad").value+
    "]]link[["+document.getElementById("link_oportunidad").value+
    "]]rango_menor_oportunidad[["+document.getElementById("rango_menor_oportunidad").value+
    "]]rango_mayor_oportunidad[["+document.getElementById("rango_mayor_oportunidad").value+
    "]]cumple[["+servicio_v+
    "]]postulacion[["+postulacion+
    "]]oculta[["+document.getElementById("oportunidad_oculto").checked+
    "]]recompensa[["+document.getElementById("recompensa").value+
    "]]tipo_oportunidad[["+document.getElementById("tipo_oportunidad").value+
    "]]obs[["+obs2+
    "]]req[["+reqs+
    checked+
    "]]fecha[["+today+"]]";
    break;
    case "crear_proceso":
    case "editar_proceso":
    var servicio = (document.getElementById("servicio_proceso") == null)?"analisis":document.getElementById("servicio_proceso").value;
    parametro = "id_contacto[["+document.getElementById("id_contacto_proceso").value+
    "]]id_vacante[["+document.getElementById("id_vacante_proceso").value+
    "]]fecha_proceso[["+document.getElementById("fecha_proceso").value+
    "]]cargo[["+document.getElementById("cargo_proceso").value+
    "]]empresa[["+document.getElementById("empresa_contacto_proceso").value+
    "]]linkedin[["+document.getElementById("linkedin_contacto_proceso").value+
    "]]cargo_contacto[["+document.getElementById("cargo_contacto_proceso").value+
    "]]nombre_contacto[["+document.getElementById("nombre_contacto_proceso").value+
    "]]mail[["+document.getElementById("mail_contacto_proceso").value+
    "]]crystal[["+document.getElementById("crystal_contacto_proceso").value+
    "]]telefono[["+document.getElementById("telefono_proceso").value+
    "]]tipo_proceso[["+document.getElementById("tipo_proceso").value+
    "]]servicio[["+servicio+
    "]]obs[["+document.getElementById("obs_proceso").value+
    "]]fecha[["+today+"]]";


    break;
    case "crear_observacion":
    case "editar_observacion":
    parametro= "obs[["+document.getElementById("input_novedad").value+"]]fecha[["+today+"]]";
    break;

    case "crear_usuario":
    case "editar_usuario":

    parametro = "id[["+document.getElementById("id_usuario").value+
    "]]linkedin[["+document.getElementById("linkedin_usuario").value+
    "]]nombre[["+document.getElementById("nombre_usuario").value+
    "]]cargo[["+document.getElementById("cargo_usuario").value+
    "]]empresa[["+document.getElementById("empresa_usuario").value+
    "]]mail[["+document.getElementById("mail_usuario").value+
    "]]telefono[["+document.getElementById("telefono_usuario").value+
    "]]aspiracion_min[["+document.getElementById("aspiracion_min_usuario").value+
    "]]aspiracion_max[["+document.getElementById("aspiracion_max_usuario").value+
    "]]crystal[["+document.getElementById("crystal_usuario").value+
    "]]job_hacker[["+document.getElementById("job_hacker_usuario").value+
    "]]area[["+document.getElementById("area_usuario").value+
    "]]estado[["+document.getElementById("estado_usuario").value+
    "]]fecha[["+today+"]]";
    break;
    case "crear_job_hacker":
    case "editar_job_hacker":

    parametro = "id[["+document.getElementById("id_job_hacker").value+
    "]]linkedin[["+document.getElementById("linkedin_job_hacker").value+
    "]]nombre[["+document.getElementById("nombre_job_hacker").value+
    "]]cargo[["+document.getElementById("cargo_job_hacker").value+
    "]]empresa[["+document.getElementById("empresa_job_hacker").value+
    "]]mail[["+document.getElementById("mail_job_hacker").value+
    "]]telefono[["+document.getElementById("telefono_job_hacker").value+
    "]]crystal[["+document.getElementById("crystal_job_hacker").value+
    "]]fecha[["+today+"]]";
    break;
    case "crear_sesion":
    case "editar_sesion":
    parametro="num_sesion[["+document.getElementById("sesion").value+"]]preguntas[[";
    for(var o in preguntas_sesiones[parseInt(document.getElementById("sesion").value)].preguntas){
      parametro+= "pregunta_"+o+"+++"+preguntas_sesiones[parseInt(document.getElementById("sesion").value)].preguntas[o].texto+":"+document.getElementById("pregunta_"+o).value+"+++";
    }
    parametro+="]]fecha[["+today+"]]";
    break;
  }
  if(verify_data(accion)){

    crear_actualizar_objeto(parametro,accion,tmp_etiqueta,id_session);
  }else{
    console.log("error con los datos")
  }

}
function add_usuario(){
  document.getElementById("div_crear_usuario").style.display = "block";

  //close_contenedor("contenedor_right");
  //close_contenedor('contenedor_buscar');
  close_contenedor_menu('div_crear_job_hacker');
  //document.getElementById("boton_add_usuario").classList.add("selected");
  document.getElementById("boton_add_jh").classList.remove("selected");
  accion = "crear_usuario";
}
function add_job_hacker(){
  document.getElementById("div_crear_job_hacker").style.display = "block";

  //close_contenedor("contenedor_right");
  //close_contenedor('contenedor_buscar');
  close_contenedor_menu('div_crear_usuario');
  //document.getElementById("boton_add_usuario").classList.remove("selected");
  document.getElementById("boton_add_jh").classList.add("selected");
  accion = "crear_job_hacker";
}

function add_persona(obj,label,event){
  event.stopPropagation();
  var id_per = parseInt(obj.id.split("add_persona_")[1]);
  var data = {};
  if(label == 1){
   data = get_persona_cb(id_per);
 }else{
  for(var i = 0; i<conlis_objetos_con.lista['full_contactos'].length;i++){
    if(conlis_objetos_con.lista['full_contactos'][i].id == id_per){
      data = conlis_objetos_con.lista['full_contactos'][i];
      break;
    }
  }
}
tmp_id = data.id;
accion = "crear_contacto";
document.getElementById("id_contacto").value = data.id;
document.getElementById("linkedin_contacto").value = data.linkedin;
document.getElementById("nombre_contacto").value = data.nombre;
document.getElementById("cargo_contacto").value = data.ultimo_cargo;
document.getElementById("empresa_contacto").value = data.ultima_empresa;
document.getElementById("crystal_contacto").value = data.crystal;
document.getElementById("mail_contacto").value = data.mail;
document.getElementById("telefono_contacto").value = data.telefono;
document.getElementById("tipo_contacto").value = 1;
document.getElementById("obs_contacto").value = "";
crear("contacto");


}
async function open_link_teachable() {
  window.open("https://seligo.teachable.com/courses/enrolled/657060","_blank")
}
async function open_link(obj){

  if(popup.id <= 0){
    tmp_id = popup_servicios.id;  
  }else{
    tmp_id = popup.id;
  }

  tmp_etiqueta = 0;
  accion = "crear_oportunidad";
  
  asociar_previo("link");


  mostrar_mensaje_flotante("ok","Abriendo link de la vacante...");
  await sleep(3000);
  window.open(obj.id, '_blank');
  close_popup(11)
}
function add_vacante_repre(obj,event,repre){
  event.stopPropagation();
  tmp_id = popup_servicios.id;

  
  asociar_previo(repre);
  close_popup(11)
}
function add_vacante_postula(id_vacante){
  tmp_id = id_vacante
  tmp_etiqueta = 0;
  accion = "crear_oportunidad";
  
  asociar_previo();
}
function add_vacante(obj,event){
  event.stopPropagation();
  tmp_id = obj.id.split("add_vacante_")[1];
  tmp_etiqueta = 0;
  accion = "crear_oportunidad";
  
  asociar_previo();

}
function actualizacion_archiv(){
  x = "aca se tiene algo bueno";
  return x;
}
function load_profile(o,r){
  document.getElementById("nombre_"+o).value=r.nombre;
  document.getElementById("cargo_"+o).value=r.cargo;
  document.getElementById("empresa_"+o).value=r.empresa;
  try{
    document.getElementById("mail_"+o).value=r.mail;
  }catch(e){
    console.log("sin mail")
  }
  var cr = "NaN";
  if(typeof r.disc.data != "undefined" && r.disc.data != null){
    for (var u in crystal_styles){
      if(crystal_styles[u].code == r.disc.data.personalities.disc_type){
        cr = crystal_styles[u].name.toLowerCase();
        break;
      }
    }
  }
  try{
    document.getElementById("crystal_"+o).value = cr;
  }catch(e){
    console.log("sin crystal")
  }
  show_loading(false,"");



}

window.mobileAndTabletCheck = function() {
  let check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
};

function show_contenedor_items(o,i){

  if(o == 1){
    document.getElementById("show_contenedor_items_1").classList.add("selected");
    document.getElementById("show_contenedor_items_2").classList.remove("selected");
    document.getElementById("div_contenedor_items_oportunidad").style.display="block";
  }else if(o == 2){
    document.getElementById("show_contenedor_items_2").classList.add("selected");
    document.getElementById("show_contenedor_items_1").classList.remove("selected");
    document.getElementById("div_contenedor_items_oportunidad").style.display="none";
  }

}
//function close_center(){
  //document.getElementById("contenedor_center").classList.remove("show_mobile");
//}

function close_opciones_cargar(){
 document.getElementById("opciones_cargar").classList.remove("show"); 
}
function show_opciones_cargar(){
 document.getElementById("opciones_cargar").classList.add("show"); 
}
/*
$(document).mouseup(function (e) { 
  if ($(e.target).closest(".boton_crear_objeto.subopcion").length 
    === 0) { 
    document.getElementById("opciones_cargar_contacto").style.display = "none";
} 
}); 
*/

function read_csv(text){
  var tmp1 = text.split("\n"); 
  
  var tmp2 = "";
  var txt = "";
  var row = 1;
  var tcol = 0;
  var arrcols = ["linkedin","nombre","cargo","empresa","mail","telefono","tipo_contacto","observacion"];
  var cols = {};
  var obj = {"linkedin":"","nombre":"","cargo":"","empresa":"","mail":"","telefono":"","tipo_contacto":"","observacion":""};
  for(var o in tmp1){
    tmp2 = tmp1[o].split(",");
    obj = {"linkedin":"","nombre":"","cargo":"","empresa":"","mail":"","telefono":"","tipo_contacto":"","observacion":""};
    txt = "";
    tcol = 0;
    for (var u in tmp2){
      if(row == 1){
        if(arrcols.includes(tmp2[u])){
          cols[tcol] = tmp2[u].trim().toLowerCase();
        }
      }else{
        obj[cols[tcol]] = tmp2[u].trim().toLowerCase();
      } 
      tcol++;
    }
    if(row > 1){
      formulario.csv_preview.push(obj);
    }

    
    row++;

  }
}


// 1. This code loads the IFrame Player API code asynchronously.
var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);


var player;
function onYouTubeIframeAPIReady() {
  if(document.getElementById("player_index")){

  }
  player = new YT.Player('player', {
    playerVars: {
      autoplay: 0,
      rel:0,
      showinfo: 0,
      autohide: 1,
      modestbranding: 1},
      videoId: 'XU2-P0PmMk0',
      events: {
        'onReady': onPlayerReady,
        'onPlaybackQualityChange': onPlayerPlaybackQualityChange,
        'onStateChange': onPlayerStateChange
      }
    });
}

function onPlayerReady(event) {
  if(app.usuario.ultimo_login == ""){
    show_popup_video("bienvenida");
    event.target.playVideo();  
  }
  
  
}

var done = false;
function onPlayerStateChange(event) {

}
function stopVideo() {
  player.stopVideo();
}
function onPlayerPlaybackQualityChange(event) {
  var playbackQuality = event.target.getPlaybackQuality();
  var suggestedQuality = 'hd720';

  console.log("Quality changed to: " + playbackQuality );

  if( playbackQuality !== 'hd720') {
    console.log("Setting quality to " + suggestedQuality );
    event.target.setPlaybackQuality( suggestedQuality );
  }
}

txts = ["empleo","candidato","crecimiento profesional"]
txtvar = txts[0];
var i = 0;
var itxt = 0;
var tmp_txt = ""
var speed = 70;
async function typeWriter() {
  if(i < txtvar.length){

    tmp_txt += txtvar.charAt(i);
    document.getElementById("titulo_index").innerHTML =  tmp_txt;
    i++;
    setTimeout(typeWriter, speed);
  }else{
    await sleep(2000);
    i = 0;
    tmp_txt =  txtvar;
    typeDeleter();
  }
}
function typeDeleter(){
  if(i < txtvar.length){

    tmp_txt = tmp_txt.slice(0, -1);
    document.getElementById("titulo_index").innerHTML = tmp_txt;
    i++;
    setTimeout(typeDeleter, speed);
  }else{
    if(itxt < txts.length-1){
      itxt++;
    }else{
      itxt = 0;
    }
    txtvar = txts[itxt]
    tmp_txt = "";
    i = 0;
    typeWriter()


  }
}




/*

function handleFileSelect(evt) {
    var files = evt.target.files; // FileList object
    console.log("archivos...cargados...",files[0])
    // Loop through the FileList and render image files as thumbnails.
    formulario.csv_preview = [];
    formulario.archivos = "";
    for (var i = 0, f; f = files[i]; i++) {
      if(files[i].type != "text/csv"){
        alert(files[i].name +" no es un archivo CSV. No puede ser cargado")
        continue;
      }
      formulario.archivos+=files[i].name+", ";
      // Only process image files.
      

      var reader = new FileReader();

      // Closure to capture the file information.
      reader.onload = (function(theFile) {
        return function(e) {
          read_csv(e.target.result);
          
        };
      })(f);

      // Read in the image file as a data URL.
      reader.readAsText(f);
    }
  }
  try{
    document.getElementById('files').addEventListener('change', handleFileSelect, false);
  }catch(e){
    console.log("nothing")
  }
  */
  console.log(new Date().getHours() + ":" + new Date().getMinutes() + ":" + new Date().getSeconds()+"INICIA CARGA ALEJA");