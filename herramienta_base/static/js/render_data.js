var D3Network = window[	'vue-d3-network']

var grp = new Vue({
	el: '#app',
  	components: {
    	D3Network
  	},
	data () {
		return {
			nodes: [
			{ id: 1, name: 'AD'},
			{ id: 2, name: 'JD'},
			{ id: 3, name:'Tú', _color: 'white' },
			{ id: 4, name: 'LM'},
			{ id: 5, name: 'LM' },
			{ id: 6, name: 'LM' },
			{ id: 7, name: 'LM' },
			{ id: 8, name: 'LM' },
			{ id: 9, name: 'LM' }
			],
			links: [
			{ sid: 1, tid: 2 },
			{ sid: 2, tid: 8 },
			{ sid: 3, tid: 4 },
			{ sid: 4, tid: 5 },
			{ sid: 5, tid: 6 },
			{ sid: 7, tid: 8 },
			{ sid: 5, tid: 8 },
			{ sid: 3, tid: 8 },
			{ sid: 7, tid: 9 }
			],
			nodeSize:30,
			canvas:false
		}
	}
	,
	computed:{
		options(){
			return{
				force: 3000,
				size:{ w:600, h:600},
				nodeSize: this.nodeSize,
				nodeLabels: true,
				linkLabels:true,
				canvas: this.canvas,
				fontSize:15,
				linkWidth:4
			}
		}
	}
})