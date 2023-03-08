/*
function focus_filter(arr) {
    var nodos_arr = document.getElementsByClassName("nodes")[0];
    for(var o in nodos_arr.children){
        var id = -1;
        try{
            id = nodos_arr.children[o].id.split("_")[1]
            console.log(id)
        }catch(e){

        }
        if(arr.includes(parseInt(id))){
            try{
                nodos_arr.children[o].style.opacity = 1;
            }catch(e){
                console.log(nodos_arr.children[o])
            }
        }else{
            try{
                nodos_arr.children[o].style.opacity = .15;
            }catch(e){
                console.log(nodos_arr.children[o])
            }
        }

    }
    var links_arr = document.getElementsByClassName("links")[0];
    for(var o in links_arr.children){
        try{
            links_arr.children[o].style.opacity = .1;
        }catch(e){
         console.log(links_arr.children[o])   
     }

 }

}
*/
var zoom = null;
var container = null;
function paint_network(graph,width,height){
    var label = {
        'nodes': [],
        'links': []
    };

    graph.nodes.forEach(function(d, i) {
        label.nodes.push({node: d});
        label.nodes.push({node: d});
        label.links.push({
            source: i * 2,
            target: i * 2 + 1
        });
    });

    /*var labelLayout = d3.forceSimulation(label.nodes)
    .force("charge", d3.forceManyBody().strength(-500))
    .force("link", d3.forceLink(label.links).distance(0).strength(2));
    */

    var graphLayout = d3.forceSimulation(graph.nodes)
    .force("charge", d3.forceManyBody().strength(-8000))
    .force("center", d3.forceCenter(width / 2, height / 2))
    .force("x", d3.forceX().strength(.7).x(function(d){ return (((width-50)/4)*d.group)}))
    .force("y", d3.forceY().strength(.7).y(height / 2))
    .force("link", d3.forceLink(graph.links).id(function(d) {return d.id; }).distance(50).strength(0))
    .on("tick", ticked);

    var adjlist = [];

    graph.links.forEach(function(d) {
        adjlist[d.source.index + "-" + d.target.index] = true;
        adjlist[d.target.index + "-" + d.source.index] = true;
    });

    function neigh(a, b) {
        return a == b || adjlist[a + "-" + b];
    }

    var cont_svg = document.getElementById("svg_network");
    if(cont_svg.getElementsByTagName("g").length > 0){
        cont_svg.removeChild(cont_svg.getElementsByTagName("g")[0])
    }
    var svg = d3.select("#svg_network");
    container = svg.append("g");
    zoom = d3.zoom()
    .scaleExtent([.4, 1])
    .on("zoom", function() { container.attr("transform", d3.event.transform); });
    svg.call(zoom)

    d3.select("#zoom_in").on("click", function() {
      zoom.scaleBy(svg.transition().duration(750), 1.2);
  });
    d3.select("#zoom_out").on("click", function() {
      zoom.scaleBy(svg.transition().duration(750), 0.8);
  });
    
    var link = container.append("g").attr("class", "links")
    .selectAll("line")
    .data(graph.links)
    .enter()
    .append("line")
    .attr("id",function(d){return "link_"+d.id})
    .attr("stroke", function(d) { return niveles_networking[d.nivel].color; })
    .attr("stroke-width", "3px")
    .style("opacity",.9);

    var nodes_g = container.append("g").attr("class", "nodes")
    .selectAll("g")
    .data(graph.nodes);

    var node = nodes_g
    .enter()
    .append("g")
    .attr("id",function(d){return "node_"+d.id})
    .attr("class", "noden");

    node
    .append("circle")
    .attr("r",function(d){return (d.group == 0)?17:1})
    .attr("class","circle_node")
    .attr("fill", function(d) { return niveles_cercania[d.group].color; })
    .attr("stroke-width",0);
    
    node
    .append("rect")
    .attr("class" ,function(d){return (d.group == 0)?"rect_node invisible":"rect_node"})
    .attr("rx",10)
    .attr("ry",10)
    .attr("stroke", "#b3b3b3")
    .attr("fill","#ffffffe6");
    
    var text = node
    .append("text")
    .attr("class","text_node")
    .attr("fill", function(d) { return niveles_cercania[d.group].colort; })
    .attr("dx", function(d){return (d.group == 0)?-9:5})
    .attr("dy", function(d){return (d.group == 0)?5:27})
    .style("pointer-events", "none");

    text
    .append("tspan")
    .attr("x",function(d){return (d.group == 0)?-1:-10})
    .attr("dy",function(d){return (d.group == 0)?"0.4em":"-5"})
    .text(function(d){return acotar_texto(d.name.split("---")[0]);});
    text
    .append("tspan")
    .attr("dy","1.3em")
    .attr("x",-5)
    .attr("fill","#565656")
    .text(function(d){console.log(parseInt(d.id)); return (d.group == 0)?"":acotar_texto(d.name.split("---")[1]);});


    //node.on("click", focus);//.on("mouseout", unfocus);
    node.on("click", select_node);//.on("mouseout", unfocus);
    node.on("mouseover", focus);
    node.on("mouseout", unfocus);
    node.call(
        d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended)
        );


     function ticked() {

        node.call(updateNode);
        link.call(updateLink);



    }
    function acotar_texto(t){
        var limite = 22;
        return (t.length > limite)?t.substring(0,limite)+"...":t;
    }
    function fixna(x) {
        if (isFinite(x)) return x;
        return 0;
    }
    function select_node(d){
        conlis_red.filtros = ["#id:"+d3.select(d3.event.target).datum().id];
    }
    function focus(d) {
        
        d3.event.stopPropagation();
        d3.select(this).style("cursor", "pointer");
        var index = d3.select(d3.event.target).datum().index;
        node.style("opacity", function(o) {
            if(neigh(index, o.index)){
                return 1;

            }else{
                return 0.01;
            }
        });
        
        link.style("opacity", function(o) {
            return o.source.index == index || o.target.index == index ? 1 : 0.01;
        });
    }
    
    function unfocus() {

        d3.event.stopPropagation();
        d3.select(this).style("cursor", "default"); 
        node.style("opacity", 1);
        link.style("opacity", 1);
    }

    function updateLink(link) {
        link.attr("x1", function(d) { return fixna(d.source.x); }).attr("y1", function(d) { return fixna(d.source.y); }).attr("x2", function(d) { return fixna(d.target.x); }).attr("y2", function(d) { return fixna(d.target.y); });
    }

    function updateNode(node) {
        node.attr("transform", function(d) {
            return "translate(" + fixna(d.x) + "," + fixna(d.y) + ")";
        });
    }

    function dragstarted(d) {
        d3.event.sourceEvent.stopPropagation();
        if (!d3.event.active) graphLayout.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    function dragged(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
    }

    function dragended(d) {
        if (!d3.event.active) graphLayout.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }

}