"use strict";
module.exports = function(grunt) {
	// load the plugins
	grunt.loadNpmTasks("grunt-contrib-watch");
	grunt.loadNpmTasks("grunt-shell");

	// watch config
	grunt.initConfig({
		shell: {
			jekyll_serve: {
				command: "jekyll serve --config _config.yml,_config.dev.yml &"
			}
		},
		watch: {
			jekyll_assets: {
				files: [
					"_includes/*.*",
					"_layouts/*.*",
					"_posts/*.md",
					"_config.dev.yml",
					"_config.yml",
					"assets/*.*",
					"*/index.*",
					"index.*"
				],
				tasks: [
					"shell:jekyll_serve"
				],
				options: {
					spawn: false,
					interrupt: true,
					atBegin: true
				}
			}
		}
	});

	// Default task(s).
	grunt.registerTask("default", ["watch"]);
};