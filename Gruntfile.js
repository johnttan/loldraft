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
                }
            },
            glob_to_multiple: {
                expand: true,
                flatten: true,
                cwd: 'develop/routes/',
                src: ['*.coffee'],
                dest: 'deploy/routes/',
                ext: '.js'
                },
            glob_to_multiple1: {
                expand: true,
                flatten: true,
                cwd: 'develop/models/',
                src: ['*.coffee'],
                dest: 'deploy/models/',
                ext: '.js'
                },
            glob_to_multiple2: {
                expand: true,
                flatten: true,
                cwd: 'develop/',
                src: ['*.coffee'],
                dest: 'deploy/',
                ext: '.js'
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
                    "deploy/views/draft.html":["develop/views/draft.jade"]
                }
            }
        },

        copy: {
            main:{
                files: [
                {
                    src: 'develop/views/index.jade',
                    dest:'deploy/views/index.jade'
                }

                ]
                
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

        // htmlmin: {
        //     dist: {
        //         options: {
        //             removeComments: true,
        //             collapseWhitespace: true
        //         },
        //         files: {
        //             'deploy/views/index.html': 'deploy/views/index.html'
        //         }
        //     }
        // },

        watch: {

         
            livereload: {
                options: {livereload: true},
                files: ['deploy/public/**/*', 'deploy/views/*.jade']
            },
            scripts: {
                files: ['develop/public/javascripts/*.coffee', 'develop/routes/*.coffee', 'develop/*.coffee', 'develop/models/*.coffee'],
                tasks: ['coffee']
            },
            styles: {
                files: ['develop/public/stylesheets/*.styl'],
                tasks: ['stylus']
            },
            copy: {
                files: ['develop/views/*.jade'],
                tasks: ['copy']
            }
        }

    })


    grunt.loadNpmTasks('grunt-contrib-coffee');
    grunt.loadNpmTasks('grunt-contrib-stylus');
    grunt.loadNpmTasks('grunt-contrib-jade');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-copy');

    grunt.registerTask('default', ['watch'])
    grunt.registerTask('deploy', ['uglify, cssmin', 'htmlmin'])
}