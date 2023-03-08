var id_session = null;
var accion = "";
var tmp_id = null;
var tmp_etiqueta = -1;

var hoy = new Date();
function standarize_attribute(o) {
  if (typeof o == "string") {
    return o
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(stop_words_regex, "")
      .replace(/\s+/g, " ")
      .replace(/\n+/g, " ")
      .toLowerCase()
      .trim();
  } else {
    return o;
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
function oculta_contenido(o, t) {
  o = o + "";
  if (o.trim() != "") {
    if (o.length > 5) {
      if (t == "mail") {
        if (o.trim() == "") {
          return "sin correo";
        }
        var x = o.split("@");

        return (
          x[0].substring(0, 1) +
          "*".repeat(x[0].length - 3) +
          x[0].slice(x[0].length - 2) +
          "@" +
          x[1]
        );
      } else if (t == "telefono") {
        if (o.trim() == "") {
          return "sin telefonos";
        }
        return (
          o.substring(0, 3) + "*".repeat(o.length - 4) + o.slice(o.length - 1)
        );
      }
    } else {
      return o.substring(0, 1) + "*".repeat(o.length - 1);
    }
  } else {
    return "";
  }
}
function string2date(i) {
  var x = i.split("-");
  var y = parseInt(x[0]);
  var m = parseInt(x[1]) - 1;
  var d = parseInt(x[2]);
  return new Date(y, m, d);
}

async function show_loading(i, texto) {
  if (i) {
    document.getElementById("loading").className = "loading_show";
    document.getElementById("texto_loading").innerHTML = texto;
    await sleep(200);
  } else {
    document.getElementById("loading").className = "loading_hide";
    document.getElementById("texto_loading").innerHTML = "";
    await sleep(200);
  }
}

function esta_en_index() {
  locat =
    window.location.port == ""
      ? window.location.hostname + "/"
      : window.location.hostname + ":" + window.location.port + "/";
  return window.location.href.split("://")[1].split("?")[0] == locat;
}

function check_session() {
  $.ajax({
    url: "EPE/check_session",
    type: "POST",
    async: false,
    data: { ok: "ok" },
    success: function (ret) {
      console.log("sesion verificada...", ret);
      if (
        ret.error != "si" &&
        typeof ret.data != "undefined" &&
        ret.data.id != ""
      ) {
        console.log(ret);
        id_session = ret.data.id;
        app.sesion = ret;
        app.sesion.pnombre = ret.data.nombre.split(" ")[0];
        adm.sesion = ret;
        adm.tipo = ret.data.tipo;
        popup.sesion = ret;
        
        if (ret.data.tipo == 6) {
          document.getElementsByTagName("body")[0].classList.add("compensar");
        }
        
        if (ret.data.tipo == 13 && window.location.href.includes("/people")) {
          document.getElementById("tab_contenedor_busquedas_contactos").innerHTML ='<input type="image" src="static/imgs/menu/network.png" class="opcion_img_menu">Candidatos';
          document.getElementById("tab_contenedor_full_contactos").innerHTML ="Buscar candidatos";
          document.getElementById("tab_contenedor_etiquetas_contactos").innerHTML = "Mis candidatos guardados";
        }
      }
      load_all_data();
    
      console.log("aca ya acabo hpta")
    },
    error: function (xhr, errmsg, err) {
      show_loading(false, "");
      mostrar_mensaje_flotante(
        "error",
        "Error no controlado. Intentalo mas tarde."
      );
    },
  });
}
/*
function check_session_profile() {
  console.log("_____");
  $.ajax({
    url: "EPE/check_session",
    type: "POST",
    async: false,
    data: { ok: "ok" },
    success: function (ret) {
      console.log("sesion verificada...", ret);
      if (ret.id == "" || ret.error == "si") {
        window.location.href = "/";
      } else {
        adm.sesion = ret;
        id_session = ret.data.id;
        app.sesion = ret;
        app.sesion.pnombre = ret.data.nombre.split(" ")[0];
        get_full_user_info_profile(id_session);
        if (ret.data.tipo == 6) {
          document.getElementsByTagName("body")[0].classList.add("compensar");
        }
        show_loading(false, "");
      }
    },
    error: function (xhr, errmsg, err) {
      show_loading(false, "");
      mostrar_mensaje_flotante(
        "error",
        "Error no controlado. Intentalo mas tarde."
      );
    },
  });
}
function get_full_user_info_profile(id_session) {
  console.log("obteniendo info de usuario profile");
  $.ajax({
    url: "EPE/get_full_user_info",
    type: "POST",
    async: false,
    data: {
      id_user: id_session,
      ct: controlador_tiempos,
    },
    success: function (ret) {
      console.log(ret);
      app.usuario = ret;
      read_ciudades();
      profile.name = ret.nombre;
      profile.id = ret.id;
      profile.usuario = ret.usuario;
      profile.fecha = ret.fecha;
      profile.telefono = ret.telefono;
      profile.mail = ret.mail;
      profile.faltante_busqueda = ret.faltante_busqueda;
      profile.linkedin = ret.linkedin;
      profile.area = ret.area;
      profile.ultimo_cargo = ret.ultimo_cargo;
      profile.ultima_empresa = ret.ultima_empresa;
      profile.aspiracion_min = ret.aspiracion_min;
      profile.aspiracion_max = ret.aspiracion_max;
      profile.ciudad = ret.ciudad;
      profile.sector = ret.sector;
      profile.logros = ret.logros;
      profile.subsector = ret.subsector;
      profile.cargos_aplica = ret.cargos_aplica;
      carga_perfil_usuario();
      //conlis_red.lista["personas"] = ret["network"]["data"]
      console.log("info de usuario devuelta profile");
    },
    error: function (xhr, errmsg, err) {
      show_loading(false, "");
      mostrar_mensaje_flotante(
        "error",
        "Error no controlado. Intentalo mas tarde."
      );
    },
  });
}
*/
function close_session() {
  $.ajax({
    url: "EPE/cerrar_sesion",
    type: "POST",
    async: false,
    data: { ok: "ok" },
    success: function (ret) {
      window.location.href = "login";
    },
    error: function (xhr, errmsg, err) {
      show_loading(false, "");
      mostrar_mensaje_flotante(
        "error",
        "Error no controlado. Intentalo mas tarde."
      );
    },
  });
}
var controlador_tiempos = 0;

function load_all_data() {
  controlador_tiempos =
    "" +
    new Date().getHours() +
    ":" +
    new Date().getMinutes() +
    ":" +
    new Date().getSeconds();
  if (app.sesion.data.tipo == 13 && esta_en_index()) {
    window.location.href = "/myjobs";
  }
  
  read_ciudades();

  get_full_user_info();
  if (window.location.href.includes("/profile")) {
    read_postulaciones_usuario(app.usuario.id)
  }
  console.log("entrando...", esta_en_index());
  if (
    app.sesion.data.tipo == 13 ||
    app.sesion.data.tipo == 1 ||
    app.sesion.data.tipo == 0
  ) {
    if (window.location.href.includes("/people")) {
      read_personas();
    } else {
      show_loading(false, "");
    }
  } else {
    if (window.location.href.includes("/people")) {
      get_network();
    } else if (window.location.href.includes("/services")) {
      read_servicios();
    }
  }
  if (esta_en_index()) {
    read_vacantes();
    console.log("aca puse otra vaina")
  }
}

function texto_nivele_cercania(persona, nivel) {
  if (persona != id_session) {
    return (
      niveles_networking[nivel].texto +
      " con " +
      conlis_red.indxd_personas_red[persona].nombre
    );
  } else {
    return niveles_networking[nivel].texto + " contigo.";
  }
}
function delete_servicio(id_servicio) {
  show_loading(true, "Eliminado servicio");
  $.ajax({
    url: "EPE/eliminar_servicio",
    type: "POST",
    async: true,
    data: {
      id: id_servicio,
      id_user: id_session,
    },
    success: function (ret) {
      console.log("eliminar_servicio....");
      var sol = JSON.parse(ret).return;

      read_servicios();
      get_full_user_info();
      close_popup(12);
      show_loading(false, "");
      mostrar_mensaje_flotante("ok", "Servicio cancelado exitosamente");
    },
    error: function (xhr, errmsg, err) {
      show_loading(false, "");
      mostrar_mensaje_flotante(
        "error",
        "Error no controlado. Intentalo mas tarde."
      );
    },
  });
}
/*function guarda_datos_perfil(id, params) {
  var fd, files;
  fd = new FormData($("#form_test_profile").get(0));
  files = $('input[name="file"]')[0].files;
  console.log(files);
  fd.append("id", id);
  fd.append("params", params);
  console.log(
    "" +
      new Date().getHours() +
      ":" +
      new Date().getMinutes() +
      ":" +
      new Date().getSeconds() +
      "guardando persona"
  );

  $.ajax({
    url: "EPE/guarda_datos_perfil",
    type: "POST",
    cache: false,
    async: false,
    processData: false,
    contentType: false,
    enctype: "multipart/form-data",
    data: fd,
    success: function (ret) {
      try {
        show_message_popup(
          null,
          true,
          "<div class='boto'>¡Excelente! Ahora será mas fácil para las empresas encontrarte.</div><br><button onclick='close_popup(12)'>Seguir editando mi perfil</button><br><br><button class='opcion_popup_pregunta' onclick='vuelve_inicio()'>Ir a buscar vacantes</button>"
        );
      } catch (e) {
        mostrar_mensaje_flotante("error", "Información cargada correctamente");
      }
      show_loading(false, "");
    },
    error: function (xhr, errmsg, err) {
      show_loading(false, "");
      mostrar_mensaje_flotante(
        "error",
        "Error no controlado. Intentalo mas tarde."
      );
    },
  });
}*/
function get_last_cv(id) {
  console.log(
    "" +
      new Date().getHours() +
      ":" +
      new Date().getMinutes() +
      ":" +
      new Date().getSeconds() +
      "guardando persona"
  );
  $.ajax({
    url: "EPE/get_last_cv?id=" + id,
    type: "GET",
    async: false,

    success: function (ret) {
      console.log(ret);
    },
    error: function (xhr, errmsg, err) {
      console.log("erroooorrrr");
    },
  });
}

$(function () {
  $("#envio_postulacion_form").submit(envio_popup);
});
function envio_popup() {
  
  if (popup.tipo_envio == "postulacion" || popup.tipo_envio == "referido") {
    send_postulacion("postulacion");
  } else if (popup.tipo_envio == "representacion") {
    send_postulacion("loading_service");
  }
}

async function send_postulacion(url) {
  if (validar_formulario("postulacion")) {
    if ("" + popup.postulacion == "true" || item.id.split("share_etiqueta_")[0].includes("repre_")) {
      //LOGICA CUANDO SE PUEDE POSTULAR POR EL PORTAL

      await show_loading(true, "Enviando datos");
      var form_data = new FormData();
      form_data = new FormData($("#envio_postulacion_form").get(0));
      form_data.append("reqs.json", JSON.stringify(popup.reqs));
      form_data.append("id_vac", popup.id);

      form_data.append(
        "aspiracion_max_rango[]",
        get_option_sueldo(popup.usuario.aspiracion_max)
      );
    }

    $.ajax({
      url: "EPE/" + url,
      type: "POST",
      cache: false,
      processData: false,
      contentType: false,
      enctype: "multipart/form-data",
      data: form_data,
      success: function (ret) {
        close_popup(1);

        if (popup.referido != "referido") {
          tmp_id = popup.id;
          tmp_etiqueta = 0;
          accion = "crear_oportunidad";
          id_session = ret.return.id;
          asociar_previo("postulacion");
        } else {
          mostrar_mensaje_flotante("ok", "Tu referido ya fue enviado");
        }
      },
      error: function (xhr, errmsg, err) {
        mostrar_mensaje_flotante("error", "Error no controlado!");
      },
    });
  }
}

$(function () {
  $("#envio_acuerdo_form").submit(acepta_acuerdo);
});
async function acepta_acuerdo(e) {
  e.preventDefault();
  if (validar_formulario("acuerdo")) {
    await show_loading(true, "Enviando aceptación");
    var form_data = new FormData($("#envio_acuerdo_form").get(0));
    form_data.append("id", id_session);
    form_data.append("ciudad", popup_conveio.value_citys.name);
    for (var i = 0; i < popup_conveio.value_citys_move.length; i++) {
      form_data.append("relocaliza[]", popup_conveio.value_citys_move[i].name);
    }

    form_data.append("carrera", popup_conveio.value_carreras.name);

    form_data.append(
      "aspiracion_max_rango",
      get_option_sueldo(popup_conveio.usuario.aspiracion_max)
    );

    form_data.append("cargos_aspira", popup_conveio.value_cargos.name);

    $.ajax({
      url: "EPE/acepta_acuerdo",
      type: "POST",
      cache: false,
      processData: false,
      contentType: false,
      enctype: "multipart/form-data",
      data: form_data,
      success: async function (ret) {
        popup.check_last_cv = true;
        check_session();
        show_loading(false, "");
        show_message_popup(
          null,
          "true",
          "¡Felicitaciones!<br><br>Ahora haces parte de la comunidad. A tu correo te llegará pronto el detalle de tu convenio, por favor ingresa y activa tu cuenta.<br><br>Por ahora puedes continuar con tu postulación."
        );

        close_popup(14);
        show_detalle();
        if (popup.id != -1) {
          share_item(
            { id: "postulame_share_etiqueta_" + popup.id },
            "oportunidad",
            null
          );
          await sleep(5000);
          close_popup(12);
        }
      },
      error: function (xhr, errmsg, err) {
        show_loading(false, "");
        mostrar_mensaje_flotante(
          "error",
          "Error no controlado. Intentalo mas tarde."
        );
      },
    });
  }
}
function read_postulaciones_usuario(id){
  $.ajax({
    url: "EPE/read_postulaciones_usuario",
    type: "POST",
    async: false,
    data: {"id":id},
    success: function(ret){
      lista_requisitos.cumplimiento_requisitos = JSON.parse(ret)["return"]
    },
    error: function (xhr, errmsg, err) {
      show_loading(false, "");
      mostrar_mensaje_flotante(
        "error",
        "Error no controlado. Intentalo mas tarde."
      );
    },
  });
}
function global_enviar_pregunta(callback,data){
  $.ajax({
    url: "EPE/enviar_pregunta",
    type: "POST",
    async: false,
    data: data,
    success: callback,
    error: function (xhr, errmsg, err) {
      show_loading(false, "");
      mostrar_mensaje_flotante(
        "error",
        "Error no controlado. Intentalo mas tarde."
      );
    },
  });
}
function global_enviar_respuesta(callback,data){
  $.ajax({
    url: "EPE/enviar_respuesta",
    type: "POST",
    async: false,
    data: data,
    success: callback,
    error: function (xhr, errmsg, err) {
      show_loading(false, "");
      mostrar_mensaje_flotante(
        "error",
        "Error no controlado. Intentalo mas tarde."
      );
    },
  });
}
$(function () {
  $("#envio_vacante_form").submit(envia_vacante);
});
async function envia_vacante(e) {
  e.preventDefault();
  if (validar_formulario("vacante")) {
    await show_loading(true, "Enviando vacante");

    var form_data = new FormData();
    form_data = new FormData($("#envio_vacante_form").get(0));
    form_data.append("id", id_session);
    if (formulario_vacante.servicio == "no" && formulario_vacante.link == "" && formulario_vacante.confidencial == 'false') {
      form_data.set("link", formulario_vacante.correo_contacto);
    }
    if (formulario_vacante.value_citys.length > 0) {
      form_data.append("ciudad", formulario_vacante.value_citys[0].name);
    } else {
      form_data.append("ciudad", "");
    }
    /*
    if (
      formulario_vacante.rango_menor == "" ||
      formulario_vacante.rango_menor == 0
    ) {
      form_data.append("rango_mayor[]", []);
    } else {
      var tmp = formulario_vacante.rango_menor / 1000000;
      for (var o of options_sueldo) {
        if (tmp < o.valt && tmp >= o.valm) {
          form_data.append("rango_mayor[]", [o.name]);
        }
      }
    }*/
    /*if(formulario_vacante.value_sueldo.length > 0){
			form_data.append("rango_mayor",[formulario_vacante.value_sueldo[0].name])
		}else{
			form_data.append("rango_mayor","")
		}*/
    if (formulario_vacante.value_cats.length == 0) {
      form_data.append("lista_cats[]", []);
    } else {
      for(var o of formulario_vacante.value_cats){
        if(o.tit == "Otro"){
          o.tit = o.otro;
        }
      }
      for (var i = 0; i < formulario_vacante.value_cats.length; i++) {
        form_data.append("lista_cats[]", JSON.stringify(formulario_vacante.value_cats[i]));
      }
    }
    if (formulario_vacante.value_reqs.length == 0) {
      form_data.append("lista_reqs[]", []);
    } else {
      for (var i = 0; i < formulario_vacante.value_reqs.length; i++) {
        form_data.append("lista_reqs[]", formulario_vacante.value_reqs[i].des+"");
      }
    }
    if (formulario_vacante.value_cargos.length == 0) {
      form_data.append("cargos_relacionados[]", []);
    } else {
      for (var i = 0; i < formulario_vacante.value_cargos.length; i++) {
        form_data.append(
          "cargos_relacionados[]",
          formulario_vacante.value_cargos[i].name
        );
      }
    }
    /*if (formulario_vacante.servicio != "no") {
      form_data.append("confidencial", "servicio");
    }*/


    $.ajax({
      url: "EPE/envia_vacante",
      type: "POST",
      cache: false,
      processData: false,
      contentType: false,
      enctype: "multipart/form-data",
      data: form_data,
      success: async function (ret) {
        console.log(ret);
        show_loading(false, "");
        formulario_vacante.reset();
        popup.id = ret.return.id;
        popup_share_vacante();
      },
      error: function (xhr, errmsg, err) {
        show_loading(false, "");
        mostrar_mensaje_flotante(
          "error",
          "Error no controlado. Intentalo mas tarde."
        );
      },
    });
  }
}

function get_network_filtered(arr) {
  show_loading(true, "Filtrando red");
  console.log(
    arr,
    "" +
      new Date().getHours() +
      ":" +
      new Date().getMinutes() +
      ":" +
      new Date().getSeconds() +
      "obteniendo info de red filtered",
    app.usuario.id
  );
  $.ajax({
    url: "EPE/get_red_filter",
    type: "POST",
    async: true,
    data: {
      id: id_session,
      "arr[]": arr,
      ct: controlador_tiempos,
    },
    success: function (ret) {
      console.log(
        "" +
          new Date().getHours() +
          ":" +
          new Date().getMinutes() +
          ":" +
          new Date().getSeconds() +
          "info de red filtered devuelta"
      );
      console.log("get_network_filter_retornado", ret);
      //paint_network(ret,680,280);
      popup.obj_rutas = ret;
      conlis_red.network.nodes = ret["nodes"];
      conlis_red.network.links = ret["links"];
      popup.rutas = order_array_asc(ret["rutas"], "w");
      if (arr.length == 1) {
        var node_tmp = {};
        var list_tmp = [];
        popup.nodos_intermedios = [];
        for (var o in conlis_red.network.nodes) {
          if (
            conlis_red.network.nodes[o].id != id_session &&
            conlis_red.network.nodes[o].id != arr[0]
          ) {
            //node_tmp = conlis_red.indxd_personas_red[conlis_red.network.nodes[o].id];
            node_tmp["group"] = conlis_red.network.nodes[o].group;
            list_tmp.push(node_tmp);
            node_tmp["niveles_contaco"] = [];
            for (var l in conlis_red.network.links) {
              if (
                node_tmp.id == conlis_red.network.links[l].target &&
                !node_tmp["niveles_contaco"].includes(
                  texto_nivele_cercania(
                    conlis_red.network.links[l].source,
                    conlis_red.network.links[l].nivel
                  )
                )
              ) {
                node_tmp["niveles_contaco"].push(
                  texto_nivele_cercania(
                    conlis_red.network.links[l].source,
                    conlis_red.network.links[l].nivel
                  )
                );
              }
            }
          }
        }
        popup.nodos_intermedios = order_array_asc(list_tmp, "nivel_red");
      }
      console.log(
        "" +
          new Date().getHours() +
          ":" +
          new Date().getMinutes() +
          ":" +
          new Date().getSeconds() +
          "info de red devuelta filtered indexada"
      );
      show_loading(false, "");
    },
    error: function (xhr, errmsg, err) {
      show_loading(false, "");
      mostrar_mensaje_flotante(
        "error",
        "Error no controlado. Intentalo mas tarde."
      );
    },
  });
}
/*function get_statistics(){
	
	console.log(""+new Date().getHours() + ":" + new Date().getMinutes() + ":" + new Date().getSeconds()+"obteniendo info de red",app.usuario.id);
	$.ajax({
		url:'EPE/get_statistics',
		type:'POST',
		async: false,
		data:{
		},
		success: function(ret){
			paint_graph(ret.contactos,"svg_contactos");
			paint_graph(ret.entrevistas,"svg_entrevistas");
			conlis_stats.numeros_stats = ret.nums;
			console.log("show_statistics....",ret)
		},
		error: function(xhr, errmsg, err) {
			show_loading(false,"");
			mostrar_mensaje_flotante("error","Error no controlado. Intentalo mas tarde.");
		}
	});
}*/
function get_vacante_cb(id) {
  var tmp;
  get_vacante(function (returnValue) {
    tmp = JSON.parse(returnValue)["return"];
  }, id);
  return tmp;
}
function get_vacante(callback, id) {
  $.ajax({
    url: "EPE/get_vacante",
    type: "POST",
    async: false,
    data: {
      id: id,
      ct: controlador_tiempos,
    },
    success: callback,
    error: function (xhr, errmsg, err) {
      show_loading(false, "");
      mostrar_mensaje_flotante(
        "error",
        "Error no controlado. Intentalo mas tarde."
      );
    },
  });
}
function get_persona_cb(id) {
  var tmp;
  get_persona(function (returnValue) {
    tmp = JSON.parse(returnValue)["return"];
  }, id);
  return tmp;
}
function get_persona(callback, id) {
  $.ajax({
    url: "EPE/get_persona",
    type: "POST",
    async: false,
    data: {
      id: id,
      ct: controlador_tiempos,
    },
    success: callback,
    error: function (xhr, errmsg, err) {
      show_loading(false, "");
      mostrar_mensaje_flotante(
        "error",
        "Error no controlado. Intentalo mas tarde."
      );
    },
  });
}
function get_network() {
  console.log(
    "" +
      new Date().getHours() +
      ":" +
      new Date().getMinutes() +
      ":" +
      new Date().getSeconds() +
      "obteniendo info de red",
    app.usuario.id
  );
  $.ajax({
    url: "EPE/get_network",
    type: "POST",
    async: false,
    data: {
      id: app.sesion.data.id,
      ct: controlador_tiempos,
    },
    success: function (ret) {
      console.log(
        "" +
          new Date().getHours() +
          ":" +
          new Date().getMinutes() +
          ":" +
          new Date().getSeconds() +
          "info de red devuelta",
        ret
      );
      conlis_objetos_con.lista["full_contactos"] = ret["data"];
      conlis_objetos_con.indices_lista["total_full_contactos"] =
        ret["return_total_size"];
      conlis_red.network = { nodes: ret["nodes"], links: ret["links"] };
      for (var o in ret["data"]) {
        conlis_red.indxd_personas_red[ret["data"][o].id] = ret["data"][o];
      }
      for (var o in conlis_objetos_con.lista["contactos"]) {
        conlis_red.indxd_personas_red[
          conlis_objetos_con.lista["contactos"][o].id_objeto
        ] = conlis_objetos_con.lista["contactos"][o].data;
      }
      console.log(
        "" +
          new Date().getHours() +
          ":" +
          new Date().getMinutes() +
          ":" +
          new Date().getSeconds() +
          "info de red devuelta indexada"
      );
      show_loading(false, "");
    },
    error: function (xhr, errmsg, err) {
      show_loading(false, "");
      mostrar_mensaje_flotante(
        "error",
        "Error no controlado. Intentalo mas tarde."
      );
    },
  });
}
function read_ciudades() {
  console.log(
    "obteniendo info de ciudades",
    new Date().getHours() +
      ":" +
      new Date().getMinutes() +
      ":" +
      new Date().getSeconds()
  );
  var ciudades = [
    { ciudad: "Medellín o alrededores", pais: "Colombia" },
    { ciudad: "Cali o alrededores", pais: "Colombia" },
    { ciudad: "Bogotá o alrededores", pais: "Colombia" },
    { ciudad: "Pasto", pais: "Colombia" },
    { ciudad: "Cartagena", pais: "Colombia" },
    { ciudad: "Barranquilla", pais: "Colombia" },
    { ciudad: "Cúcuta", pais: "Colombia" },
    { ciudad: "Santa Marta", pais: "Colombia" },
    { ciudad: "Eje cafetero", pais: "Colombia" },
    { ciudad: "Manizales", pais: "Colombia" },
    { ciudad: "Armenia", pais: "Colombia" },
    { ciudad: "Bucaramanga", pais: "Colombia" },
    { ciudad: "Fuera de Colombia", pais: "" },
    { ciudad: "Ciudades de México", pais: "" },
    { ciudad: "Ciudades de Perú", pais: "" },
    { ciudad: "Ciudades de Chile", pais: "" },
    { ciudad: "Estados Unidos", pais: "" },
    { ciudad: "Remoto Colombia", pais: "" },
    { ciudad: "Remoto LATAM", pais: "" },
  ];
  for (var o in ciudades) {
    app.options_citys.push({ name: ciudades[o].ciudad });
  }
  app.options_citys.push({ name: "Otra" });
  /*$.ajax({
		url:'EPE/get_ciudades',
		type:'POST',
		async: true,
		data:{
		},
		success: function(ret){
			var lista = JSON.parse(ret)["return"];
			
			for(var o in lista){
				app.options_citys.push({"name":(lista[o].pais == "Colombia")?lista[o].ciudad:lista[o].ciudad+" - "+lista[o].pais})
				
			}
			
			app.options_citys.push({"name":"Otra"})
			
			
		},
		error: function(xhr, errmsg, err) {
			show_loading(false,"");
			mostrar_mensaje_flotante("error","Error no controlado. Intentalo mas tarde.");
		}
	});*/
}
var ret_trams = "";
function get_full_user_info() {
  console.log("obteniendo info de usuario", id_session);
  $.ajax({
    url: "EPE/get_full_user_info",
    type: "POST",
    async: false,
    data: {
      id_user: id_session,
      ct: controlador_tiempos,
    },
    success: function (ret) {
      console.log("get_full_user_info", ret);
      ret_trams = ret;
      
      app.get_etiquetas_info(ret["etiquetas"]);
      
      app.usuario = ret;
      adm.usuario = app.usuario;
      popup.usuario = app.usuario;
      profile.usuario = app.usuario;
      formulario_vacante.usuario = app.usuario;
      conlis_objetos_vac.usuario = app.usuario;
      if (
        app.usuario.representaciones + "".trim() != "" &&
        typeof app.usuario.representaciones != "undefined"
      ) {
        app.creditos = parseInt(app.usuario.representaciones);
      } else {
        app.creditos = 0;
      }
      
      formulario.data_usuario = ret;
      if (ret.tipo != 13 && app.usuario.return != "error") {
        if (!valida_perfil_completo()) {
          console.log(
            valida_perfil_completo(),
            ret.tipo,
            app.usuario.return,
            "validando sesion...."
          );
          show_message_perfil();
        }
      }

      if (!esta_en_index()) {
        show_loading(false, "");
      }
      
      console.log("info de usuario devuelta");
    },
    error: function (xhr, errmsg, err) {
      show_loading(false, "");
      mostrar_mensaje_flotante(
        "error",
        "Error no controlado. Intentalo mas tarde."
      );
    },
  });
}
function read_usuarios() {
  console.log(
    "" +
      new Date().getHours() +
      ":" +
      new Date().getMinutes() +
      ":" +
      new Date().getSeconds() +
      "... obteniendo info de usuarios"
  );
  $.ajax({
    url: "EPE/read_usuarios",
    type: "POST",
    async: true,
    data: {},
    success: function (ret) {
      console.log(
        new Date().getHours() +
          ":" +
          new Date().getMinutes() +
          ":" +
          new Date().getSeconds() +
          "...retornado usuarios",
        ret
      );
      conlis_job_hacker.lista["usuarios"] = ret;
      for (var o in conlis_job_hacker.lista["usuarios"]) {
        popup_many.usuarios.push({
          id: conlis_job_hacker.lista["usuarios"][o].id,
          nombre: conlis_job_hacker.lista["usuarios"][o].nombre,
        });
        popup_many.usuarios_filtrado.push({
          id: conlis_job_hacker.lista["usuarios"][o].id,
          nombre: conlis_job_hacker.lista["usuarios"][o].nombre,
        });
      }

      console.log(
        "" +
          new Date().getHours() +
          ":" +
          new Date().getMinutes() +
          ":" +
          new Date().getSeconds() +
          "informacion de usuarios completa"
      );
      show_loading(false, "");
    },
    error: function (xhr, errmsg, err) {
      show_loading(false, "");
      mostrar_mensaje_flotante(
        "error",
        "Error no controlado. Intentalo mas tarde."
      );
    },
  });
}
function read_personas() {
  console.log(
    "" +
      new Date().getHours() +
      ":" +
      new Date().getMinutes() +
      ":" +
      new Date().getSeconds() +
      "... obteniendo info de personas"
  );
  $.ajax({
    url: "EPE/read_personas",
    type: "POST",
    async: true,
    data: {
      ct: controlador_tiempos,
      id_sesion: id_session,
    },
    success: function (ret) {
      console.log(
        "" +
          new Date().getHours() +
          ":" +
          new Date().getMinutes() +
          ":" +
          new Date().getSeconds() +
          "...retornado personas"
      );
      app.personas = ret["return"];
      if (window.location.href.includes("/admin")) {
        conlis_objetos_admin.lista["contactos"] = ret["return"];
        conlis_objetos_admin.indices_lista["total_contactos"] =
          ret["return_total_size"];
        read_usuarios();
      } else {
        conlis_objetos_con.lista["full_contactos"] = ret["return"];
        conlis_objetos_con.indices_lista["total_full_contactos"] =
          ret["return_total_size"];
      }
      console.log(
        "" +
          new Date().getHours() +
          ":" +
          new Date().getMinutes() +
          ":" +
          new Date().getSeconds() +
          "informacion de personas completa"
      );
      show_loading(false, "");
    },
    error: function (xhr, errmsg, err) {
      show_loading(false, "");
      mostrar_mensaje_flotante(
        "error",
        "Error no controlado. Intentalo mas tarde."
      );
    },
  });
}

async function order_items(item_list, param, asc) {
  await show_loading(true, "Ordenando items...");
  console.log("haber,,,.,.,,,", data);
  $.ajax({
    url: "EPE/order_array_items",
    type: "POST",
    async: false,
    data: {
      lista: item_list,
      param: param,
      asc: asc,
    },
    success: function (ret) {
      console.log(
        ret,
        "" +
          new Date().getHours() +
          ":" +
          new Date().getMinutes() +
          ":" +
          new Date().getSeconds() +
          "retornado vacantes"
      );
      switch (item_list) {
        case "vacantes":
          if (window.location.href.includes("/admin")) {
            console.log("Ordenando vacantes admin");
            conlis_objetos_admin.lista["vacantes"] = ret;
          } else {
            console.log("Ordenando vacantes user");
            conlis_objetos_vac.lista["full_vacantes"] = ret;

            var i = 0;
            for (
              i = 0;
              i < conlis_objetos_vac.lista.full_vacantes.length;
              i++
            ) {
              var x = conlis_objetos_vac.lista.full_vacantes[i];
              x.recompensa = new Intl.NumberFormat("es-co", {
                style: "decimal",
                currency: "COP",
              }).format(x.recompensa);
              if (x.recompensa == "0") {
                x.recompensa = "";
              }
              if (typeof x.recompensa1 == "undefined") {
                x.recompensa1 = "";
              }
              x.recompensa1 = new Intl.NumberFormat("es-co", {
                style: "decimal",
                currency: "COP",
              }).format(x.recompensa1);
              if (x.recompensa1 == "0") {
                x.recompensa1 = "";
              }

              conlis_objetos_vac.lista.full_vacantes[i] = x;
            }
          }
          break;
        case "contactos":
          if (window.location.href.includes("/admin")) {
            console.log("Ordenando contactos admin");
            conlis_objetos_admin.lista["contactos"] = ret;
          } else {
            console.log("Ordenando contactos user");
            conlis_objetos_vac.lista["full_contactos"] = ret;
          }
          break;
      }

      show_loading(false, "");
      console.log(
        "" +
          new Date().getHours() +
          ":" +
          new Date().getMinutes() +
          ":" +
          new Date().getSeconds() +
          "info de vacantes completa"
      );
    },
    error: function (xhr, errmsg, err) {
      show_loading(false, "");
      mostrar_mensaje_flotante(
        "error",
        "Error no controlado. Intentalo mas tarde."
      );
    },
  });
}
async function filtrar_listas(filtros, item_list, param, asc) {
  await show_loading(true, "Ordenando items...");
  console.log("haber,,,.,.,,,", filtros, item_list, param, asc);
  $.ajax({
    url: "EPE/filter_array_items",
    type: "POST",
    async: false,
    data: {
      filters: filtros,
      lista: item_list,
      param: param,
      asc: asc,
    },
    success: function (ret) {
      switch (item_list) {
        case "vacantes":
          console.log(
            ret,
            "" +
              new Date().getHours() +
              ":" +
              new Date().getMinutes() +
              ":" +
              new Date().getSeconds() +
              "retornado vacantes"
          );
          if (window.location.href.includes("/admin")) {
            console.log("actualizando vacantes admin");
            conlis_objetos_admin.lista[item_list] = ret["return"];
            conlis_objetos_admin.indices_lista["total_" + item_list] =
              ret["return_total_size"];
          } else {
            console.log("actualizando vacantes user");
            conlis_objetos_vac.lista["full_" + item_list] = ret["return"];
            conlis_objetos_vac.indices_lista["total_full_" + item_list] =
              ret["return_total_size"];

            var i = 0;
            for (
              i = 0;
              i < conlis_objetos_vac.lista.full_vacantes.length;
              i++
            ) {
              var x = conlis_objetos_vac.lista.full_vacantes[i];
              x.recompensa = new Intl.NumberFormat("es-co", {
                style: "decimal",
                currency: "COP",
              }).format(x.recompensa);
              if (x.recompensa == "0") {
                x.recompensa = "";
              }
              if (typeof x.recompensa1 == "undefined") {
                x.recompensa1 = "";
              }
              x.recompensa1 = new Intl.NumberFormat("es-co", {
                style: "decimal",
                currency: "COP",
              }).format(x.recompensa1);
              if (x.recompensa1 == "0") {
                x.recompensa1 = "";
              }

              conlis_objetos_vac.lista.full_vacantes[i] = x;
            }
          }
          show_loading(false, "");

          console.log(
            "" +
              new Date().getHours() +
              ":" +
              new Date().getMinutes() +
              ":" +
              new Date().getSeconds() +
              "info de vacantes completa"
          );
          break;
        case "contactos":
          console.log(
            ret,
            "" +
              new Date().getHours() +
              ":" +
              new Date().getMinutes() +
              ":" +
              new Date().getSeconds() +
              "retornado vacantes"
          );
          if (window.location.href.includes("/admin")) {
            console.log("actualizando contactos admin");
            conlis_objetos_admin.lista[item_list] = ret["return"];
            conlis_objetos_admin.indices_lista["total_" + item_list] =
              ret["return_total_size"];
          } else {
            console.log("actualizando contactos usuario");
            conlis_objetos_con.lista["full_" + item_list] = ret["return"];
            conlis_objetos_con.indices_lista["total_full_" + item_list] =
              ret["return_total_size"];
            for (var o in conlis_objetos_con.lista["full_" + item_list]) {
              conlis_red.indxd_personas_red[
                conlis_objetos_con.lista["full_" + item_list][o].id
              ] = conlis_objetos_con.lista["full_" + item_list][o];
            }
          }
          show_loading(false, "");
          console.log(
            "" +
              new Date().getHours() +
              ":" +
              new Date().getMinutes() +
              ":" +
              new Date().getSeconds() +
              "info de vacantes completa"
          );
          break;
        case "usuarios":
          conlis_job_hacker.lista[item_list] = ret["return"];
          conlis_job_hacker.indices_lista["total_" + item_list] =
            ret["return_total_size"];
          show_loading(false, "");
          console.log(
            "" +
              new Date().getHours() +
              ":" +
              new Date().getMinutes() +
              ":" +
              new Date().getSeconds() +
              "info de vacantes completa"
          );
          break;
      }
    },
    error: function (xhr, errmsg, err) {
      show_loading(false, "");
      mostrar_mensaje_flotante(
        "error",
        "Error no controlado. Intentalo mas tarde."
      );
    },
  });
}
async function get_more_items(item_list) {
  await show_loading(true, "Obteniendo más items...");
  $.ajax({
    url: "EPE/get_more_items",
    type: "POST",
    async: true,
    data: {
      lista: item_list,
    },
    success: function (ret) {
      switch (item_list) {
        case "vacantes":
          console.log(
            ret,
            "" +
              new Date().getHours() +
              ":" +
              new Date().getMinutes() +
              ":" +
              new Date().getSeconds() +
              "retornado more items"
          );
          if (window.location.href.includes("/admin")) {
            conlis_objetos_admin.lista[item_list] = ret["return"];
            conlis_objetos_admin.indices_lista["total_" + item_list] =
              ret["return_total_size"];
          } else {
            conlis_objetos_vac.lista["full_" + item_list] = ret["return"];
            conlis_objetos_vac.indices_lista["total_full_" + item_list] =
              ret["return_total_size"];

            var i = 0;
            for (
              i = 0;
              i < conlis_objetos_vac.lista.full_vacantes.length;
              i++
            ) {
              var x = conlis_objetos_vac.lista.full_vacantes[i];
              x.recompensa = new Intl.NumberFormat("es-co", {
                style: "decimal",
                currency: "COP",
              }).format(x.recompensa);
              if (x.recompensa == "0") {
                x.recompensa = "";
              }
              if (typeof x.recompensa1 == "undefined") {
                x.recompensa1 = "";
              }
              x.recompensa1 = new Intl.NumberFormat("es-co", {
                style: "decimal",
                currency: "COP",
              }).format(x.recompensa1);
              if (x.recompensa1 == "0") {
                x.recompensa1 = "";
              }

              conlis_objetos_vac.lista.full_vacantes[i] = x;
            }
          }

          show_loading(false, "");
          console.log(
            "" +
              new Date().getHours() +
              ":" +
              new Date().getMinutes() +
              ":" +
              new Date().getSeconds() +
              "info de more items completa"
          );
          break;
        case "contactos":
          console.log(
            ret,
            "" +
              new Date().getHours() +
              ":" +
              new Date().getMinutes() +
              ":" +
              new Date().getSeconds() +
              "retornado more items"
          );
          if (window.location.href.includes("/admin")) {
            conlis_objetos_admin.lista[item_list] = ret["return"];
            conlis_objetos_admin.indices_lista["total_" + item_list] =
              ret["return_total_size"];
          } else {
            conlis_objetos_con.lista["full_" + item_list] = ret["return"];
            conlis_objetos_con.indices_lista["total_full_" + item_list] =
              ret["return_total_size"];
            for (var o in conlis_objetos_con.lista["full_" + item_list]) {
              conlis_red.indxd_personas_red[
                conlis_objetos_con.lista["full_" + item_list][o].id
              ] = conlis_objetos_con.lista["full_" + item_list][o];
            }
          }
          show_loading(false, "");
          console.log(
            "" +
              new Date().getHours() +
              ":" +
              new Date().getMinutes() +
              ":" +
              new Date().getSeconds() +
              "info de vacantes completa"
          );
          break;
      }
    },
    error: function (xhr, errmsg, err) {
      show_loading(false, "");
      mostrar_mensaje_flotante(
        "error",
        "Error no controlado. Intentalo mas tarde."
      );
    },
  });
}
function read_servicios() {
  console.log(
    "" +
      new Date().getHours() +
      ":" +
      new Date().getMinutes() +
      ":" +
      new Date().getSeconds() +
      "obteniendo info de vacantes"
  );
  $.ajax({
    url: "EPE/read_servicios",
    type: "POST",
    async: true,
    data: {
      id_sesion: id_session,
    },
    success: function (ret) {
      app.servicios = ret["return"];
      servicios.servicios = ret["return"];
      show_loading(false, "");
    },
    error: function (xhr, errmsg, err) {
      mostrar_mensaje_flotante(
        "error",
        "Error no controlado. Intentalo mas tarde."
      );
    },
  });
}
function read_vacantes_async() {
  console.log(
    "" +
      new Date().getHours() +
      ":" +
      new Date().getMinutes() +
      ":" +
      new Date().getSeconds() +
      "obteniendo info de vacantes"
  );
  $.ajax({
    url: "EPE/read_vacantes",
    type: "POST",
    async: true,
    data: {
      ct: controlador_tiempos,
      id_sesion: id_session,
    },
    success: function (ret) {
      console.log(
        "" +
          new Date().getHours() +
          ":" +
          new Date().getMinutes() +
          ":" +
          new Date().getSeconds() +
          "info de vacantes completa",
        ret
      );
    },
    error: function (xhr, errmsg, err) {
      show_loading(false, "");
      mostrar_mensaje_flotante(
        "error",
        "Error no controlado. Intentalo mas tarde."
      );
    },
  });
}
function read_vacantes() {
  console.log(
    "" +
      new Date().getHours() +
      ":" +
      new Date().getMinutes() +
      ":" +
      new Date().getSeconds() +
      "obteniendo info de vacantes...."
  );
  $.ajax({
    url: "EPE/read_vacantes",
    type: "POST",
    async: true,
    data: {
      ct: controlador_tiempos,
      id_sesion: id_session,
    },
    success: function (ret) {
      console.log("a la verga...",ret)
      app.vacantes = ret["return"];
      if (window.location.href.includes("/admin")) {
        conlis_objetos_admin.lista["vacantes"] = ret["return"];
        conlis_objetos_admin.indices_lista["total_vacantes"] =
          ret["return_total_size"];
      } else {
        busqueda_index();
      }
      console.log(
        "" +
          new Date().getHours() +
          ":" +
          new Date().getMinutes() +
          ":" +
          new Date().getSeconds() +
          "info de vacantes completa",
        ret
      );
    },
    error: function (xhr, errmsg, err) {
      show_loading(false, "");
      mostrar_mensaje_flotante(
        "error",
        "Error no controlado. Intentalo mas tarde."
      );
    },
  });
}
/*
async function get_profile_linkedin(url,o){
	await show_loading(true,"Obteniendo datos de perfil");
	$.ajax({
		url:'EPE/get_profile_linkedin',
		type:'POST',
		async: false,
		data:{
			"url":url
		},
		success: async function(ret){
			console.log("perfil....",ret)
			if(typeof ret.error == "undefined"){
				load_profile(o,ret)	
			}else{
				show_loading(false,"");
				await sleep(500);
				mostrar_mensaje_flotante("error","Link de LinkedIn sin resultados");
			}
			
			
		},
		error: function(xhr, errmsg, err) {
			show_loading(false,"");
			mostrar_mensaje_flotante("error","Error no controlado. Intentalo mas tarde.");
		}
	});	
}
*/
async function eliminar_etiqueta(id_user, id_etiqueta) {
  await show_loading(true, "Eliminado etiqueta");
  $.ajax({
    url: "EPE/eliminar_etiqueta",
    type: "POST",
    async: false,
    data: {
      id_user: id_user,
      id_etiqueta: id_etiqueta,
    },
    success: function (ret) {
      console.log("eliminar_etiqueta....");
      var sol = JSON.parse(ret).return;
      get_full_user_info();

      read_servicios();
      close_popup(12);
      mostrar_mensaje_flotante("ok", "Etiqueta eliminada exitosamente");
      show_loading(false, "");
    },
    error: function (xhr, errmsg, err) {
      show_loading(false, "");
      mostrar_mensaje_flotante(
        "error",
        "Error no controlado. Intentalo mas tarde."
      );
    },
  });
}

async function actualizar_integracion() {
  //document.getElementById("sincronizar_externos").innerHTML = "Sincronizando...";
  await sleep(500);
  $.ajax({
    url: "EPE/actualizar_integracion",
    type: "POST",
    async: true,
    data: {},
    success: function (ret) {
      read_personas();
      document.getElementById("sincronizar_externos").innerHTML = "Sincronizar";
    },
    error: async function (xhr, errmsg, err) {
      document.getElementById("sincronizar_externos").innerHTML =
        "Error en sincronizacion!";
      await sleep(1000);
      document.getElementById("sincronizar_externos").innerHTML = "Sincronizar";
      console.log(
        "error crear_actualizar_objeto" + xhr.status + ": " + xhr.responseText
      );
    },
  });
}

async function get_recoms() {
  await show_loading(true, "Consultando similitudes");
  $.ajax({
    url: "EPE/get_recoms",
    type: "POST",
    async: true,
    data: { vac: document.getElementById("input_vac").value },
    success: function (ret) {
      var tmp = ret["resultado"];
      for (var i in tmp) {
        tmp[i].telefono_oculto = oculta_contenido(tmp[i].telefono, "telefono");
        tmp[i].correo_oculto = oculta_contenido(tmp[i].mail, "mail");
      }
      recoms.resultados = tmp;
      console.log(recoms.resultados);
      show_loading(false, "");
    },
    error: function (xhr, errmsg, err) {
      console.log("error");
    },
  });
}

async function conector_crear_actualizar_etiqueta(
  parametro,
  etiqueta,
  id_user,
  label
) {
  await show_loading(true, "Creando etiqueta");
  $.ajax({
    url: "EPE/conector_crear_actualizar_etiqueta",
    type: "POST",
    async: false,
    data: {
      tmp: parametro,
      etiqueta: etiqueta,
      id_user: id_user,
    },
    success: async function (ret) {
      var sol = JSON.parse(ret).return;
      console.log("conector_crear_actualizar_etiqueta", ret, popup_servicios);
      

      if (label == "oportunidad") {
        read_vacantes();
        mostrar_mensaje_flotante("ok", "Vacante guardada exitosamente");
      } else if (label == "contacto") {
        mostrar_mensaje_flotante("ok", "Contacto guardado exitosamente");
      } else {
        mostrar_mensaje_flotante("ok", "Entrevista guardada exitosamente");
      }
      get_full_user_info();
      read_servicios();
    },
    error: function (xhr, errmsg, err) {
      show_loading(false, "");
      mostrar_mensaje_flotante(
        "error",
        "Error no controlado. Intentalo mas tarde."
      );
    },
  });
}
async function delete_comentario(id_session, id_et, id_com) {
  $.ajax({
    url: "EPE/eliminar_comentario",
    type: "POST",
    async: true,
    data: {
      id: id_session,
      id_et: id_et,
      id_com: id_com,
    },
    success: function (ret) {
      console.log("eliminado!!");
      crear_actualizar_comentario(id_et, [], id_com, "eliminar");
      popup.comentarios = JSON.parse(ret).return;
    },
    error: async function (xhr, errmsg, err) {
      mostrar_mensaje_flotante(
        "error",
        "Error al crear comentario. Intentalo de nuevo mas tarde"
      );
    },
  });
}
async function create_comentario(txt, fecha, id_session, id_et) {
  $.ajax({
    url: "EPE/create_comentario",
    type: "POST",
    async: true,
    data: {
      fecha: fecha,
      texto: txt,
      id: id_session,
      id_et: id_et,
    },
    success: function (ret) {
      console.log("creado!!");
      crear_actualizar_comentario(
        id_et,
        JSON.parse(ret).return.lista_completa,
        0,
        "crear"
      );
      popup.comentarios = JSON.parse(ret).return.lista_completa;
    },
    error: async function (xhr, errmsg, err) {
      mostrar_mensaje_flotante(
        "error",
        "Error al crear comentario. Intentalo de nuevo mas tarde"
      );
    },
  });
}
/*
async function crear_actualizar_objeto_csv(parametro,tipo,etiqueta,id_user,tipo_contacto,obs){
	await show_loading(true,"Creando item");
	$.ajax({
		url:'EPE/crear_actualizar_objeto',
		type:'POST',
		async: false,
		data:{
			"parametro":parametro,
			"tipo":tipo,
			"etiqueta":etiqueta,
			"id_user":id_user
		},
		success: function(ret){
			console.log("crear_actualizar_objeto....")
			var sol = JSON.parse(ret).return;
			if(tipo.includes("contacto")){
				if(sol.accion == "repeat"){
					formulario.csv_mensajes.push("repetido")
					var today = new Date();
					var dd = String(today.getDate()).padStart(2, '0');
					var mm = String(today.getMonth() + 1).padStart(2, '0'); 
					var yyyy = today.getFullYear();
					tmp_id = sol.id;
					today = yyyy + '-' + mm + '-' + dd;
					var label = "contacto";
					var parametro = "label[["+label+"]]id[["+tmp_id+"]]fecha[["+today+"]]";
					if(label == "contacto"){
						parametro+="nivel[["+tipo_contacto+"]]obs[["+obs+"]]";
					}
					
					
					conector_crear_actualizar_etiqueta(parametro,tmp_etiqueta,id_session,label)
				}else{
					formulario.csv_mensajes.push("creado")
				}
				//crear_actualizar_objeto_cliente("personas",sol.accion,sol.id,sol.object_create,sol.object_update);
				
			}
			
			
		},
		error: function(xhr, errmsg, err) {
			console.log('error crear_actualizar_objeto' + xhr.status + ': ' + xhr.responseText);
			show_loading(false,"");
			
			mostrar_mensaje_flotante("error","Error en el sevidor. Intentalo de nuevo mas tarde");
		}
	});
}
*/
var tmp_pass = "";
var repeat = "";
async function crear_actualizar_objeto(parametro, tipo, etiqueta, id_user) {
  url_consumo =
    tipo == "crear_contacto_perfil"
      ? "EPE/crear_contacto_perfil"
      : "EPE/crear_actualizar_objeto";
  await show_loading(true, "Creando item...");
  console.log(url_consumo);
  $.ajax({
    url: url_consumo,
    type: "POST",
    async: false,
    data: {
      parametro: parametro,
      tipo: tipo,
      etiqueta: etiqueta,
      id_user: id_user,
    },
    success: function (ret) {
      console.log("crear_actualizar_objeto....", tipo);
      var sol = JSON.parse(ret).return;
      var pide = false;
      if (tipo.includes("contacto")) {
        if (sol.accion == "repeat") {
          tmp_id = sol.id;
          var info = "";
          info =
            sol.object_create.nombre +
            "<br>" +
            sol.object_create.ultimo_cargo +
            " en <b>" +
            sol.object_create.ultima_empresa +
            "</b><br><br>" +
            oculta_contenido(sol.object_create.telefono, "telefono") +
            "<br>" +
            oculta_contenido(sol.object_create.mail, "mail");
          mostrar_mensaje(
            "alerta",
            "El link o la combinación de nombre y cargo del contacto que estas intentado crear ya existe en Aleia<br><br>" +
              info +
              "<br><br>¿Deseas reemplazar la información existente?"
          );
        }
        if (sol.accion == "create") {
          //crear_actualizar_objeto_cliente("personas",sol.accion,sol.id,sol.object_create,sol.object_update);
          mostrar_mensaje(
            "ok",
            "Contacto creado correctamente con el id " + sol.id
          );
        }
        if (sol.accion == "update") {
          //crear_actualizar_objeto_cliente("personas",sol.accion,sol.id,sol.object_create,sol.object_update);
          mostrar_mensaje("ok", "Contacto actualizado correctamente");
        }
      } else if (tipo.includes("oportunidad")) {
        if (!window.location.href.includes("/admin") && !esta_en_index()) {
          if (repeat == "repeat") {
            show_message_popup(
              null,
              true,
              "El usuario con esa cuenta de correo ya existe. La vacante fue cargada a las vacantes de ese usuario. <br><br> Ingresa a Aleia para tener acceso a tu información"
            );
          } else {
            show_message_popup(
              null,
              true,
              "La cuenta fue creada exitosamente y la vacante publicada. Revisa tu correo para activar tu cuenta de Aleia e ingresa con tu correo y la siguiente contraseña.<br><br><p class='pass'>" +
                tmp_pass +
                "</p>"
            );
            tmp_pass = "";
          }
          close_popup(3);
        } else {
          if (sol.accion == "repeat") {
            tmp_id = sol.id;
            var info = "";
            info = sol.object_create.cargo + " en " + sol.object_create.empresa;
            mostrar_mensaje(
              "alerta",
              "El link de la vacante que estas creando ya existe en Aleia<br><br>" +
                info +
                "<br><br>¿Deseas reemplazar la información existente?"
            );
          }
          if (sol.accion == "create") {
            mostrar_mensaje(
              "ok",
              "Oportunidad creada correctamente con el id " + sol.id
            );
          }
          if (sol.accion == "update") {
            mostrar_mensaje("ok", "Oportunidad actualizada correctamente");
          }
        }
      } else if (tipo.includes("proceso")) {
        mostrar_mensaje(
          "ok",
          "Proceso creado correctamente con el id " + sol.id
        );
      } else if (tipo.includes("crear_usuario")) {
        pide = true;
        repeat = sol.accion;
        tmp_pass = parametro.split("]]pass[[")[1].split("]]")[0].trim();

        call2action_user_vac(sol.id);
      } else if (tipo.includes("observacion")) {
        //crear_actualizar_objeto_cliente("personas",sol.accion,sol.id,sol.object_create,sol.object_update);
        mostrar_mensaje("ok", "Observación creada correctamente");
      } else if (tipo.includes("job_hacker")) {
        //crear_actualizar_objeto_cliente("personas",sol.accion,sol.id,sol.object_create,sol.object_update);
        mostrar_mensaje("ok", "Job Hacker creado exitosamente");
        //close_contenedor_menu("div_crear_job_hacker");
      } else if (tipo.includes("sesion")) {
        //crear_actualizar_objeto_cliente("personas",sol.accion,sol.id,sol.object_create,sol.object_update);
        mostrar_mensaje_flotante("ok", "Sesión creada correctamente");
      }
      try {
        get_full_user_info();
      } catch (e) {
        console.log("ERROR NO CONTROLADO!!");
      }
      read_servicios();
    },
    error: function (xhr, errmsg, err) {
      console.log(
        "error crear_actualizar_objeto" + xhr.status + ": " + xhr.responseText
      );
      show_loading(false, "");

      mostrar_mensaje_flotante(
        "error",
        "Error en el sevidor. Intentalo de nuevo mas tarde"
      );
    },
  });
}
function crear_actualizar_comentario(id_et, comentarios, id_com, accion) {
  if (accion == "crear") {
    for (var w = 0; w < app.etiquetas.length; w++) {
      if (app.etiquetas[w].id == id_et) {
        app.etiquetas[w].comentarios = comentarios;
      }
    }
  } else if (accion == "eliminar") {
    for (var w = 0; w < app.etiquetas.length; w++) {
      if (app.etiquetas[w].id == id_et) {
        for (var y = 0; y < app.etiquetas[w].comentarios.length; y++) {
          if (app.etiquetas[w].comentarios[y].id == id_com) {
            app.etiquetas[w].comentarios.splice(y, 1);
            break;
          }
        }
      }
    }
  }
}
async function ejecucion_scripts() {
  await show_loading(true, "Consultando similitudes");
  $.ajax({
    url: "EPE/script",
    type: "POST",
    async: true,
    data: {},
    success: function (ret) {
      console.log("bueno salio bien!!");
    },
    error: function (xhr, errmsg, err) {
      console.log("error");
    },
  });
}

async function guarda_perfil(e){
  e.preventDefault();
  await show_loading(false,"Cargando Job Resume");
  var formData = new FormData();
  formData = new FormData ($('#envio_perfil').get(0));
  
  $.ajax({
    url: "EPE/enviar_datos_perfil",
    type: "POST",
    cache: false,
    processData: false,
    contentType: false,
    enctype: "multipart/form-data",
    data: formData,
    success: function (ret) {
    show_message_popup ( 
      null,
      true,
      "<div class='boto'>¡Excelente! Ahora será mas fácil para las empresas encontrarte.</div><br><button onclick='close_popup(12)'>Seguir editando mi perfil</button><br><br><button class='opcion_popup_pregunta' onclick='vuelve_inicio()'>Ir a buscar vacantes</button>"
    )},
    error: function (xhr, errmsg, err) {
      show_loading(false, "");
      mostrar_mensaje_flotante(
        "error",
        "Error no controlado. Intentalo mas tarde."
      );
    },
  });
}