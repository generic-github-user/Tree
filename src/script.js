var len = undefined;

var nodes = new vis.DataSet();
var edges = new vis.DataSet();

var data = {
	nodes: nodes,
	edges: edges
};

const directory = function(input) {
	var dir = "";
	input = input.split("\\");
	for (var i = 0; i < input.length - 1; i++) {
		dir += input[i];
		if (i < input.length - 2) {
			dir += "\\";
		}
	}
	return dir;
}

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
			group: 1,
			path: input[i]
		});
		
		id++;
	}
	for (var i = 0; i < input.length; i++) {
		for (var j = 0; j < Object.keys(data.nodes._data).length; j ++) {
			if (directory(input[i]) == data.nodes._data[j].path) {
				edges.add({
					from: i,
					to: j
				});
			}
		}
	}
}

var container = document.getElementById("network");

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