var root = $("#root-switch")[0].checked;
var input;

// Create datasets for nodes and edges
var nodes = new vis.DataSet();
var edges = new vis.DataSet();

// Store node and edges in one object
var data = {
      nodes: nodes,
      edges: edges
};

// Remove file name from file path and return just the directory that file (or folder) resides in
const directory = function(input) {
      // Create variable to store output
      var output = "";
      // Split input into name of each directory and the file name
      input = input.split("\\");
      // Loop through all folders in file path (but not the file name)
      for (var i = 0; i < input.length - 1; i++) {
            // Add folder name to output
            output += input[i];
            // Only add backslash if not on last directory of file path
            if (i < input.length - 2) {
                  output += "\\";
            }
      }
      // return output. this line is pretty self-explanatory
      return output;
}

// Get number of sub-directories within file path
const subfolders = function(input) {
      return input.split("\\").length;
}

// Get default file paths from dir.txt
var dir = $.ajax({
      url: "./dir.txt",
      async: false
}).responseText;

// Get div where network will be displayed
var container = $("#network")[0];

// Define options for network visualization
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

// Node group (color)
const color_nodes = function() {
      var group = 0;
      var file_types = [];

      for (var i = 0; i < Object.keys(data.nodes._data).length; i++) {
            // Split file path into individual folders and files
            var split = input[i].split("\\");
            // Get filename from file path
            var name = split[split.length - 1];

            if (color == "Object type") {
                  // Root node should be one color . . .
                  if (i == input.length - 1 && root) {
                        group = 3;
                  }
                  // Directories (folders) should be another . . .
                  else if (name.includes(".")) {
                        group = 1;
                  }
                  // And files should be another
                  else {
                        group = 2;
                  }
            } else if (color == "File level") {
                  group = subfolders(input[i]);
            } else if (color == "File type") {
                  if (name.includes(".")) {
                        var file_type = name.split(".")[1];
                        if (!file_types.includes(file_type)) {
                              file_types.push(file_type);
                        }
                        group = file_types.indexOf(file_type);
                  } else {
                        group = -1;
                  }
            }

            data.nodes.update({
                  id: i,
                  group: group
            });
      }
}

// Minimum number of nested directories in all file paths
var min_subfolders;
// Generate network visualization based on input data
const update = function() {
      // ID of current node
      var id = 0;

      // Create datasets for nodes and edges
      data.nodes = new vis.DataSet();
      data.edges = new vis.DataSet();

      // Get input text from textarea
      input = $("#input")[0].value;
      // If no input is provided, use default
      if (input == undefined || input == "") {
            input = dir;
      }
      // Split input string into array of lines
      input = input.split("\n");
      // Remove empty lines from input
      input = input.filter(Boolean);

      // Find shortest file path
      // Start with first file path
      min_subfolders = input[0];
      // Loop through all file paths
      for (var i = 0; i < input.length; i++) {
            // Compare current shortest directory to current file path
            // If file path has fewer subfolders than min_subfolders, update min_subfolders
            if (subfolders(input[i]) < subfolders(min_subfolders)) {
                  min_subfolders = input[i];
            }
      }
      var root_dir = directory(min_subfolders);
      if (root) {
            // Add root directory to list of file paths
            input.push(root_dir);
      }
      $("#root-switch-tooltip").text(root_dir);

      // Add nodes to represent files and folders
      // Loop through all file paths
      for (var i = 0; i < input.length; i++) {
            // Split file path into individual folders and files
            var split = input[i].split("\\");
            // Get filename from file path
            var name = split[split.length - 1];

            // Add node to network
            data.nodes.add({
                  id: id,
                  label: name,
                  path: input[i]
            });

            id++;
      }
      color_nodes();

      // Add connections/edges to network
      for (var i = 0; i < input.length; i++) {
            // Loop through all existing nodes
            for (var j = 0; j < Object.keys(data.nodes._data).length; j++) {
                  // Check if directory of current node matches the full path of any other nodes
                  if (directory(input[i]) == data.nodes._data[j].path) {
                        // If the node belongs to the current directory, add a connection between the two nodes
                        data.edges.add({
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

      // Display network
      network = new vis.Network(container, data, options);
}

var color = "File level";
const uc = function() {
      $("#color-indicator").text(color);
      color_nodes();
};
$("#color-object-type").click(
      () => {
            color = "Object type";
            uc();
      }
);
$("#color-file-level").click(
      () => {
            color = "File level";
            uc();
      }
);
$("#color-file-type").click(
      () => {
            color = "File type";
            uc();
      }
);
uc();

$("#root-switch").click(() => {
      root = $("#root-switch")[0].checked;
      update();
});

// Update network when program is started
update();

$("#load-button").click(update);