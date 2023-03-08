var margin = {top: 50, right: 20, bottom: 40, left: 40};
var xAxis_dots_grah,yAxis_dots_grah,xScale_dots,yScale_dots,html_x,html_y;
var data = []
var  widthg = 600;
var  heightg = 230;
var parseTime = d3.timeParse("%Y-%m-%d");

var colorScale = d3.scale.ordinal().domain(["oportunidad","contacto","proceso"])
.range(["#D1D8EB","#dfc4e5","#c2d3c6"]);

var colorScale2 = d3.scale.linear().domain([0,1,2,3,4])
.range(["#616161","#ff9f9f","#ffd89f","#81baf5","#a1ff9f"]);
function getWeekNumber(d) {

  d.setDate(d.getDate()-d.getDay()+5)
  return d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate();
}
function parseISOLocal(s) {
  var b = s.split(/\D/);
  return new Date(b[0],b[1]-1,b[2]);
}
function up_options(){
  var x = document.getElementById("div_call2action").className;
  if( x.indexOf('up') >= 0){
    document.getElementById("div_call2action").classList.remove("up");
    document.getElementById("img_show_options").src = "/static/imgs/nw_images/up.png"
  }else{
    document.getElementById("div_call2action").classList.add("up");
    document.getElementById("img_show_options").src = "/static/imgs/nw_images/down.png"
  }
}
function paint_bars(data){
  console.log("pintando barras...");
var width = 300;
var height = 150;
  var cont_svg = document.getElementById("svg_barras");
  if(cont_svg.getElementsByClassName("general_svg").length > 0){
    cont_svg.removeChild(cont_svg.getElementsByClassName("general_svg")[0])
  }
  var svg = d3.select("#svg_barras");
  var x = d3.scaleBand().rangeRound([0, width]).padding(0.1),
  y = d3.scaleLinear().rangeRound([height, 0]);

  var g = svg.append("g")
  .attr("class","general_svg")
  .attr("transform", "translate(" + margin.left + "," + 10 + ")");
  x.domain(data.map(function(d) { return d.x; }));
  y.domain([0, d3.max(data, function(d) { return d.y; })]);

  g.append("g")
  .attr("class", "axis axis--x")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(x));

  g.append("g")
  .attr("class", "axis axis--y")
  .call(d3.axisLeft(y).ticks(4))
  .append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 6)
  .attr("dy", "0.71em")
  .attr("text-anchor", "end")
  .text("Frequency");

  g.selectAll(".bar")
  .data(data)
  .enter().append("rect")
  .attr("class", "bar")
  .attr("x", function(d) { return x(d.x); })
  .attr("y", function(d) { return y(d.y); })
  .style("fill", function(d){return niveles_networking[d.i].color;})
  .attr("width", x.bandwidth())
  .attr("height", function(d) { return height - y(d.y); });

}
function prepare_data_etiquetas_usuario(insumo){
  insumo = insumo.filter(o => o.label != "sesion" && o.label != "observacion");
  var hoy = new Date();
  hoy.setDate(hoy.getDate() + 5)
  var base_fecha = new Date();
  base_fecha.setMonth(hoy.getMonth() - 2);
  insumo = insumo.filter(o => parseISOLocal(o.fecha)>= base_fecha);
  var datatmp = {};
  var wk = null;
  var fecha_tmp = base_fecha;
  var labels_posibles = ["oportunidad","contacto","proceso"]
  while(fecha_tmp < hoy){
    wk = getWeekNumber(fecha_tmp);
    for(var ww2 = 0; ww2< labels_posibles.length;ww2++){
      datatmp[wk+"--"+labels_posibles[ww2]] = 0;
    }
    fecha_tmp.setDate(fecha_tmp.getDate() + 7);
  }

  for(var j = 0; j< insumo.length;j++){
    if(labels_posibles.includes(insumo[j].label)){
      wk = getWeekNumber(parseISOLocal(insumo[j].fecha));
      datatmp[wk+"--"+insumo[j].label] = datatmp[wk+"--"+insumo[j].label]+1;
    }
  }
  data = [];  
  for(var o in datatmp){
    data.push({"key":o.split("--")[0],"label":o.split("--")[1],"value":datatmp[o]});
  }
  return data;
}
function paint_graph(data,div){
  console.log("pintando datos...",data)
  var cont_svg = document.getElementById(div);
  if(cont_svg.getElementsByClassName("general_svg").length > 0){
    cont_svg.removeChild(cont_svg.getElementsByClassName("general_svg")[0])
  }
  
  svg = d3.select("#"+div)
  .append("g")
  .attr("class","general_svg")
  .attr("transform", "translate(0,-40)");
  xScale_dots = d3.scaleTime()
  .domain(d3.extent(data, d => (parseTime(d.key))))
  .range([margin.left, widthg - margin.right])
  var min = 5;
  var min_val = (d3.max(data,d=>d.value)<min)?min:d3.max(data,d=>d.value)+1;

  yScale_dots = d3.scaleLinear()
  .domain([-1,min_val])
  .range([heightg- margin.bottom,margin.top]);
  
  var dias_tot = (d3.max(data,d=>parseTime(d.key)).getTime()-d3.min(data,d=>parseTime(d.key)).getTime())/ (1000 * 3600 * 24);
  var num_vals_xScale = 6;
  dias = dias_tot/num_vals_xScale;
  var valores_xScale = [];
  var dt_tmp = null;

  for(var d = 0; d< num_vals_xScale+1;d++){
    if(d == 0){

      dt_tmp = d3.min(data,d=>parseTime(d.key));
      dt_tmp.setDate(dt_tmp.getDate()+(1));
    }else if(d == num_vals_xScale){
      dt_tmp = d3.max(data,d=>parseTime(d.key));
      
    }else{
      dt_tmp.setDate(dt_tmp.getDate()+(dias));
    }
    valores_xScale.push(new Date(dt_tmp.getTime()));

  }
  xAxis_dots_grah = g => g
  .attr("transform", `translate(${0},${heightg-margin.bottom})`)
  .transition(2000)
  .call(d3.axisBottom(xScale_dots).tickSizeOuter(0).tickValues(valores_xScale).tickFormat(d3.timeFormat("%Y-%m-%d"))
    );

  html_x = svg.append("g");
  
  html_x
  .attr("class","x--axis")
  .transition(2000)
  .call(xAxis_dots_grah);

  yAxis_dots_grah = g => g
  .attr("transform", `translate(${margin.left},${0})`)
  .call(d3.axisLeft(yScale_dots).ticks(6))
  .call(g => g.select(".domain").remove());

  html_y= svg.append("g");
  
  html_y
  .attr("class","y--axis")
  .transition(2000)
  .call(yAxis_dots_grah);
  

  paint_dots(data,div);
  paint_lines(data,div);
}
function paint_dots(data,div){

  var radio = 6;

  let dot_container = d3.select("#"+div).select(".general_svg")
  .selectAll(".g4dot")
  .data(data);

  var dots = dot_container
  .enter()
  .append("g")
  .attr("class","g4dot")
  .attr("transform", (d,i)=> "translate(" + xScale_dots(parseTime(d.key)) + "," + yScale_dots(d.value) + ")");

  dots.selectAll("circle")
  .data(function(d){return [d];})
  .enter()
  .append("circle")
  .style("fill", function(d){return config[d.label].color;})
  .style("fill-opacity",1)
  .attr("r", function(d){return radio});

  


  dot_container
  .transition()
  .duration(200)
  .attr("transform", (d,i)=> "translate(" + xScale_dots(parseTime(d.key)) + "," + yScale_dots(d.value) + ")");

  dot_container.exit().remove();
}
function paint_lines(data,div){
  var line = d3.line()
  .x(function(d) { return xScale_dots(parseTime(d.key));})
  .y(function(d) { return yScale_dots(d.value); });
  var subdata = Object.keys(config).map(function(label) {
    return {
      label: label,
      values: data.filter(d=> d.label == label).map(function(d) {
        return {key: d.key, value: d.value};
      })
    };
  });
  var emptydata = [];
  let line_container = d3.select("#"+div).select(".general_svg")
  .selectAll(".g4line")
  .data(emptydata);

  var lines = line_container
  .enter()
  .append("g")
  .attr("class","g4line");

  line_container.exit().remove();

  line_container = d3.select("#"+div).select(".general_svg")
  .selectAll(".g4line")
  .data(subdata);

  var lines = line_container
  .enter()
  .append("g")
  .attr("class","g4line");

  lines.selectAll("path")
  .data(function(d){return [d];})
  .enter()
  .append("path")
  .attr("class", "line")
  .attr("fill","none")
  .attr("d", function(d) { return line(d.values); })
  .style("stroke", function(d) {return config[d.label].color;});

  line_container.selectAll("path")
  .attr("d", function(d) { return line(d.values); })
  .attr("fill","none")
  .style("stroke", function(d) { return config[d.label].color; });
}



var context = null;

function graph(){
  get_graph_data();
  var canvas = document.querySelector("canvas"),
  context = canvas.getContext("2d"),
  width = canvas.width,
  height = canvas.height,
  searchRadius = 10;



  var simulation = d3.forceSimulation()
  .force("charge", d3.forceManyBody().strength(-250))
  .force("link", d3.forceLink().iterations(4).id(function(d) { return d.id; }))
  .force("x", d3.forceX())
  .force("y", d3.forceY());

  

  var users = d3.nest()
  .key(function(d) { return d.group; })
  .entries(graph_data.nodes)
  .sort(function(a, b) { return b.values.length - a.values.length; });



  simulation
  .nodes(graph_data.nodes)
  .on("tick", ticked);

  simulation.force("link")
  .links(graph_data.links);

  d3.select(canvas)
  //.on("mousemove", mousemoved)
  .on("click",mousemoved)
  .call(d3.drag()
    .container(canvas)
    .subject(dragsubject)
    .on("start", dragstarted)
    .on("drag", dragged)
    .on("end", dragended));

  function ticked() {
    context.clearRect(0, 0, width, height);
    context.save();
    context.translate(width / 2, height / 2);

    context.beginPath();
    graph_data.links.forEach(drawLink);
    context.strokeStyle = "#aaa";
    context.stroke();

    users.forEach(function(user) {
      context.beginPath();
      user.values.forEach(drawNode);
      context.fillStyle = colorScale2(user.key);
      context.fill();
    });

    context.restore();
  }

  function dragsubject() {
    return simulation.find(d3.event.x - width / 2, d3.event.y - height / 2, searchRadius);
  }

  function mousemoved() {
    var a = this.parentNode, m = d3.mouse(this), d = simulation.find(m[0] - width / 2, m[1] - height / 2, searchRadius);

    if (!d){
      document.getElementById("nombre_data").innerHTML = "";
      document.getElementById("cargo_data").innerHTML = "";
      document.getElementById("empresa_data").innerHTML = "";

    }else{
      document.getElementById("nombre_data").innerHTML = d.nombre;
      document.getElementById("cargo_data").innerHTML = d.cargo;
      document.getElementById("empresa_data").innerHTML = d.empresa;
    }
  }
  function dragstarted() {
    if (!d3.event.active) simulation.alphaTarget(0.3).restart();
    d3.event.subject.fx = d3.event.subject.x;
    d3.event.subject.fy = d3.event.subject.y;
  }

  function dragged() {
    d3.event.subject.fx = d3.event.x;
    d3.event.subject.fy = d3.event.y;
  }

  function dragended() {
    if (!d3.event.active) simulation.alphaTarget(0);
    d3.event.subject.fx = null;
    d3.event.subject.fy = null;
  }

  function drawLink(d) {
    context.moveTo(d.source.x, d.source.y);
    context.lineTo(d.target.x, d.target.y);
  }

  function drawNode(d) {
    context.moveTo(d.x + 3, d.y);
    context.arc(d.x, d.y, 9, 0, 2 * Math.PI);
  }


}
