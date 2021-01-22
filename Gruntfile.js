module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            options: {
                // separator: ';',
            },
            dist: {
                src: ['src/*'],
                dest: 'VK.js',
            },
        },
        watch: {
            scripts: {
                files: ['src/*.js'],
                tasks: ['default'],
                options: {
                    spawn: false,
                },
            },
        },

    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', ['concat', 'watch']);
};

