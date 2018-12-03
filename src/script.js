var len = undefined;

var nodes = new vis.DataSet();
var edges = new vis.DataSet();

var id = 0;
const update = function () {
	var input = document.querySelector("#input").value;
	input = input.split("\n");
	
	for (var i = 0; i < input.length; i++) {
		var split = input[i].split("\\");
		var name = split[split.length - 1];
		nodes.add({
			id: id,
			label: name,
			group: 1
		});
		
		id++;
	}
}

var container = document.getElementById("network");
var data = {
	nodes: nodes,
	edges: edges
};
var options = {
	nodes: {
		shape: 'dot',
		size: 30,
		font: {
			size: 32
		},
		borderWidth: 2,
		shadow:true
	},
	edges: {
		width: 2,
		shadow:true
	}
};
network = new vis.Network(container, data, options);