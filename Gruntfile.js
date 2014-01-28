module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        coffee: {
            compileJoined: {
                options: {
                    join: false
                },
                files: {
                    'deploy/public/javascripts/main.js': 'develop/public/javascripts/*.coffee',
                    'deploy/routes/*.js': 'develop/routes/*.coffee',
                    'deploy/models/*.js': 'models/*.coffee',
                    'deploy/app.js': 'develop/app.coffee'
                }
            }
        },

        stylus: {
            compile: {
                options: {
                    paths: ['develop/public/stylesheets/axis'],
                    import: ['axis'],
                    compress: true
                },
                files: {
                    'deploy/public/stylesheets/main.css': 'develop/public/stylesheets/main.styl',
                    'deploy/public/stylesheets/side-menu.css': 'develop/public/stylesheets/side-menu.styl'
                }

            }
        },

        jade: {
            compile: {
                options: {
                    data: {
                        debug: false
                    }
                },
                files: {
                    "deploy/public/index.html":["develop/views/index.jade"],
                    "deploy/public/draft.html":["develop/views/draft.jade"]
                }
            }
        },

        uglify: {
            options: {
                mangle: false,
                compress: true
            },
            my_target: {
                files: {
                    'deploy/public/javascripts/main.js': ['deploy/public/javascripts/*.js']
                }
            }
        },

        cssmin: {
            add_banner: {
                options: {
                    banner: '/* League Draft 2014 John Tan */'
                },
                files: {
                    'deploy/public/stylesheets/main.css': ['deploy/public/stylesheets/*.css']
                }
            }
        },

        htmlmin: {
            dist: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: {
                    'deploy/views/index.html': 'deploy/views/index.html'
                }
            }
        },

        watch: {

         
            livereload: {
                options: {livereload: true},
                files: ['deploy/public/**/*', 'deploy/views/*.html']
            },
            scripts: {
                files: ['develop/public/javascripts/*.coffee', 'develop/routes/*.coffee', 'develop/app.coffee'],
                tasks: ['coffee']
            },
            styles: {
                files: ['develop/public/stylesheets/*.styl'],
                tasks: ['stylus']
            },
            html: {
                files: ['develop/views/*.jade'],
                tasks: ['jade']
            }
        }

    })


    grunt.loadNpmTasks('grunt-contrib-coffee');
    grunt.loadNpmTasks('grunt-contrib-stylus');
    grunt.loadNpmTasks('grunt-contrib-jade')
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', ['watch'])
    grunt.registerTask('deploy', ['uglify, cssmin', 'htmlmin'])
}