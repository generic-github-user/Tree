var len = undefined;

var nodes = new vis.DataSet();
var edges = new vis.DataSet();

var data = {
      nodes: nodes,
      edges: edges
};

const directory = function(input) {
      var output = "";
      input = input.split("\\");
      for (var i = 0; i < input.length - 1; i++) {
            output += input[i];
            if (i < input.length - 2) {
                  output += "\\";
            }
      }
      return output;
}

const subfolders = function(input) {
      return input.split("\\").length;
}

$.ajaxSetup({
      async: false
});
var dir = $.ajax({
      url: "./dir.txt",
      async: false
}).responseText;

var id = 0;
var group = 1;
var min_subfolders;
const update = function() {
      var input = $("#input")[0].value;
      if (input == undefined || input == "") {
            input = dir;
      }
      input = input.split("\n").filter(Boolean);
      min_subfolders = input[0];
      for (var i = 0; i < input.length; i++) {
            if (subfolders(input[i]) < subfolders(min_subfolders)) {
                  min_subfolders = input[i];
            }
      }
      input.push(directory(min_subfolders));

      for (var i = 0; i < input.length; i++) {
            var split = input[i].split("\\");
            var name = split[split.length - 1];
            if (i == input.length - 1) {
                  group = 3;
            } else if (name.includes(".")) {
                  group = 1;
            } else {
                  group = 2;
            }
            nodes.add({
                  id: id,
                  label: name,
                  group: group,
                  path: input[i]
            });

            id++;
      }
      for (var i = 0; i < input.length; i++) {
            for (var j = 0; j < Object.keys(data.nodes._data).length; j++) {
                  if (directory(input[i]) == data.nodes._data[j].path) {
                        edges.add({
                              from: j,
                              to: i
                        });
                        //nodes.update({
                        //id: i,
                        //group: group
                        //});
                        //group++;
                  }
            }
      }
}

update();

var container = $("#network")[0];

var options = {
      nodes: {
            shape: 'dot',
            size: 30,
            font: {
                  size: 16
            },
            borderWidth: 2,
            shadow: true
      },
      edges: {
            width: 2,
            shadow: true
      }
};
network = new vis.Network(container, data, options);