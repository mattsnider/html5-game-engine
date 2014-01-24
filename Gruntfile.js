module.exports = function(grunt) {
	'use strict';

	// Project configuration.
	grunt.initConfig({
		// Before generating any new files, remove any previously-created files.
		clean: {
//			tests: ['tmp']
		},

		concat: {
			options: {
			},
			build: {
				src: [
					'src/init.js', 'src/board_object.js', 'src/board.js',
					'src/character.js', 'src/game.js'
				],
				dest: 'build/<%= pkg.name %>.js'
			},
			snake: {
				src: [
					'src/init.js', 'src/board_object.js', 'src/board.js',
					'src/character.js', 'src/game.js', 'src/snake/board.js',
					'src/snake/character.js', 'src/snake/game.js',
					'src/snake/main.js'
				],
				dest: 'build/<%= pkg.name %>-snake.js'
			}
		},

		// lint the JavaScript files
		jshint: {
			// define the files to lint
			files: ['gruntfile.js', 'src/**/*.js', 'test/**/*.js'],
			// configure JSHint (documented at http://www.jshint.com/docs/)
			options: {
//				camelcase		: true,
				curly				: true,
				eqeqeq			: true,
				freeze			: true,
				latedef			: true,
				newcap			: true,
				noarg				: true,
				noempty			: true,
				nonew				: true,
				quotmark		: 'single',
				undef				: true,
//				unused			: true,
				strict			: true,
				trailing		: true,
				maxparams		: 4,
				maxdepth		: 3,
//				maxstatements		: 10,
//				maxlen			: 80,

				// more options here if you want to override JSHint defaults
				globals: {
					// general globals
					'$'						: true,
					alert					: true,
					clearInterval	: true,
					clearTimeout	: true,
					console				: true,
					document			: true,
					module				: true,
					window				: true,

					// project globals
					Board					: true,
					BoardObject		: true,
					BoardSnake		: true,
					Character			: true,
					CharacterSnake: true,
					Game					: true,
					GameSnake			: true
				}
			}
		},

		pkg: grunt.file.readJSON('package.json'),

		// minify the JS
		uglify: {
			options: {
				banner: '/*! <%= pkg.name %> v<%= pkg.version %> | ' +
						'(c) 2007 - <%= grunt.template.today("yyyy") %> Matt Snider. | ' +
						'mattsnider.com/projects/license/ */\n',
				beautify: {
					ascii_only: true
				},
				compress: {
					drop_console: true,
					join_vars: true
				}
			},
			build: {
				src: 'build/<%= pkg.name %>.js',
				dest: 'build/<%= pkg.name %>.min.js'
			},
			snake: {
				src: 'build/<%= pkg.name %>-snake.js',
				dest: 'build/<%= pkg.name %>-snake.min.js'
			}
		}
	});

	// Load the plugin that provides the "concat" task.
	grunt.loadNpmTasks('grunt-contrib-concat');

	// Load the plugin that provides the "jshint" task.
	grunt.loadNpmTasks('grunt-contrib-jshint');

	// Load the plugin that provides the "uglify" task.
	grunt.loadNpmTasks('grunt-contrib-uglify');

	grunt.registerTask(
			'default', ['jshint', 'concat', 'uglify']);

};