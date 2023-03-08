var config_graph = {
  type: 'line',
  data: {
    datasets:[{
      label:"contactos",
      backgroundColor:"#f6e7fa",
      fill:false,
      data:[{x:"2020-01-01",y:2},{x:"2020-01-02",y:2},{x:"2020-01-03",y:6}],

    },
    {
      label:"oportunidades",
      backgroundColor:"#d1d8eb",
      fill:false,
      data:[{x:"2020-01-01",y:3},{x:"2020-01-02",y:9},{x:"2020-01-03",y:1}],

    }]
  },
  options: {
    responsive: true,
    title: {
      display: true,
      text: 'avance'
    },
    scales: {
      xAxes: [{
        type: 'time',
        display: true,
        scaleLabel: {
          display: true,
          labelString: 'Date'
        },
        ticks: {
          major: {
            fontStyle: 'bold',
            fontColor: '#FF0000'
          }
        }
      }],
      yAxes: [{
        display: true,
        scaleLabel: {
          display: true,
          labelString: 'value'
        }
      }]
    }
  }
};

function load_chart() {
  var ctx = document.getElementById("dot_chart").getContext("2d")

  window.myLine = new Chart(ctx, config_graph);
};
