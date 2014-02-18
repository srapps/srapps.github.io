"use strict";
module.exports = function(grunt) {
	var fs = require("fs")
	var path = require("path");
	var xml_parser = require("xml2js");
	var CleanCSS = require("clean-css");
	var UglifyJS = require("uglify-js");

	var base_path = path.resolve(grunt.option("base-path") || ".").replace(/\/+$/, ""); // grunt --base-path "/your/root/path"
	var assets_xml = base_path + "/assets.xml";

	var js_assets_dest = base_path + "/assets/";
	var js_watch_files = [base_path + "/js/*.js", "!" + js_assets_dest, assets_xml];
	var js_sections =  ["assets.min.js", "polyfill.min.js"]; // grunt --js-sections "a,b,c"

	var css_assets_dest = base_path + "/assets/"; // grunt --css-sections "x,y,z"
	var css_watch_files = [base_path + "/css/*.css", "!" + css_assets_dest, assets_xml];
	var css_sections =  ["assets.min.css"]; // grunt --css-sections "a,b,c"

	var css_clean_options = {
		keepSpecialComments: 0,
		keepBreaks: true,
		noRebase: true,
		processImport: false,
		noAdvanced: true
	};

	// load the plugins
	grunt.loadNpmTasks("grunt-contrib-concat");
	grunt.loadNpmTasks("grunt-contrib-watch");

	// watch config
	grunt.initConfig({
		concat: {
			js_assets: {
				options: {
					banner: '"use strict";' + "\n",
					process: function(src, filepath) {
						var min = src;
						if (!filepath.match(/min\.js$/)) {
							try {
								min = UglifyJS.minify(src, {fromString: true}).code;
							}
							catch(e) {
								console.log(e);
								min = src;
							}
						}
						return "/* " + filepath.replace(/^.*?\/js\//, "/js/") + " */\n" + 
							min.
								replace(/^\s*\/\*[\s\S]*?\*\/\s*/g, "").
								replace(/(^|\n)\/\/[#@] sourceMappingURL=.*?(\n|$)/g, "").
								replace(/(^|\n)[ \t]*(?:'use strict'|"use strict");?\s*/g, "$1");
					}
				},
				files: {
				}
			},
			css_assets: {
				options: {
					process: function(src, filepath) {
						var min = "";
						try {
							min = new CleanCSS(css_clean_options).minify(src);
						}
						catch (e) {
							console.error(e);
							min = src;
						}

						return "/* " + filepath.replace(/^.*?\/css\//, "/css/") + " */\n" + min;
					}
				},
				files: {
				}
			}
		},
		watch: {
			js_assets: {
				files: js_watch_files,
				tasks: [
					"concat:js_assets:files"
				],
				options: {
					spawn: false
				}
			},
			css_assets: {
				files: css_watch_files,
				tasks: [
					"concat:css_assets:files"
				],
				options: {
					spawn: false
				}
			}
		}
	});

	// parse task
	grunt.task.registerTask("parse", "parse", function() {
		var done = this.async();
		var js_assets = {};
		var css_assets = {};

		// read in assets_xml
		fs.readFile(assets_xml, {encoding: "utf8"}, function (assets_err, assets_data) {
			if (assets_err) {
				console.error("No assests file");
			}
			else {
				xml_parser.parseString(assets_data, function (json_err, json_data) {
					if (!json_err) {
						var pages = json_data.section.pages[0].page || [];

						// js_assets
						for (var i=0, n=js_sections.length; i<n; i++) {
							var js_asset = js_assets[js_assets_dest+js_sections[i]] = [];
							for(var j=0, m=pages.length; j<m; j++) {
								if (pages[j].$.name == js_sections[i]) {
									var scripts = pages[j].modules[0].module[0].parameters[0].script;
									for (var k=0, l=scripts.length; k<l; k++) {
										js_asset.push(base_path + "/" + scripts[k].$.file);
									}
								}
							}
						}
						// update config
						grunt.config("concat.js_assets.files", js_assets);
						//console.log(js_assets);

						// css_assets
						for (var i=0, n=css_sections.length; i<n; i++) {
							var css_asset = css_assets[css_assets_dest+css_sections[i]] = [];
							for(var j=0, m=pages.length; j<m; j++) {
								if (pages[j].$.name == css_sections[i]) {
									var links = pages[j].modules[0].module[0].parameters[0].link;
									for (var k=0, l=links.length; k<l; k++) {
										css_asset.push(base_path + "/" + links[k].$.file);
									}
								}
							}
						}
						// update config
						grunt.config("concat.css_assets.files", css_assets);
						//console.log(css_assets);

						// next
						done();
					}
				});
			}
		});
	});

	// on watch - parse first if assest file changes
	grunt.event.on("watch", function(not_used_action, filepath) {
		if (path.resolve(filepath) === assets_xml) {
			grunt.task.run(["parse"]);
		}
	});

	// Default task(s).
	grunt.registerTask("default", ["parse", "concat", "watch"]);
};