module.exports = function (grunt) {

    let today = new Date();
    let version = today.getFullYear() + "." + (today.getMonth() + 1) + "." + today.getDate();

    let banner = [];
    banner.push("// " + "*".repeat(80));
    banner.push("// *");
    banner.push("// *" + " VK.js by Varun Agrawal (https://Varunagw.com/)");
    banner.push("// *" + " Version: v" + version);
    banner.push("// *");
    banner.push("// *" + "*".repeat(80));
    banner.push("");
    banner.push("");

    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        concat: {
            options: {
                banner: banner.join("\n"),
            },
            dist: {
                src: ["src/*"],
                dest: "VK.js",
            },
        },
        watch: {
            scripts: {
                files: ["src/*.js"],
                tasks: ["default"],
                options: {
                    spawn: false,
                },
            },
        },

    });

    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks("grunt-contrib-watch");

    grunt.registerTask("default", ["concat"]);
};

