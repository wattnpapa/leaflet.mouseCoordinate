/* global module */

module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        concat: {
            options: {
                separator: ';'
            },
            dist: {
                src: ['src/*.js'],
                dest: 'dist/<%= pkg.name %>.js'
            }
        },

        eslint: {
            all: {
                src: ['src/*.js']
            }
        },

        cssmin: {
            options: {
                shorthandCompacting: false,
                roundingPrecision: -1
            },
            target: {
                files: {
                    'dist/<%= pkg.name %>.css': ['src/*.css']
                }
            }
        },

        csslint: {
            strict: {
                src: ['src/*.css']
            }
        },

        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> Copyright by <%= pkg.author %> */\n'
            },
            build: {
                src: 'dist/<%= pkg.name %>.js',
                dest: 'dist/<%= pkg.name %>.min.js'
            }
        }
    });

    grunt.loadNpmTasks('grunt-eslint');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-csslint');
    grunt.loadNpmTasks('grunt-contrib-cssmin');

    grunt.registerTask('jsdoc', 'Generate JSDoc documentation', function () {
        var done = this.async();
        require('child_process').exec(
            'node node_modules/.bin/jsdoc src/ -d doc',
            function (err, stdout, stderr) {
                if (err) { grunt.log.error(stderr); return done(false); }
                grunt.log.ok('Documentation generated to doc/');
                done();
            }
        );
    });

    grunt.registerTask('check', ['eslint', 'csslint']);
    grunt.registerTask('default', ['eslint', 'csslint', 'concat', 'uglify', 'cssmin', 'jsdoc']);
};
