module.exports = function(grunt) {
    var port = grunt.option('port') || 8000;

    var endpoints = {
        "/user/": "json-files/user.json",
        "/product/": "json-files/product.json"
    };

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        watch: {

        },
        connect: {
            server: {
                options: {
                    port: port,
                    hostname: "localhost",
                    middleware: function(connect, options, middlewares) {
                        middlewares.push(function(req, res, next) {
                            var match = false;
                            var fileToRead = "";

                            Object.keys(endpoints).forEach(function(url) {
                                if (req.url.indexOf(url) == 0) {
                                    match = true;
                                    fileToRead = endpoints[url];
                                }
                            });

                            //no match with the url, move along
                            if (match == false) {
                                return next();
                            }

                            res.end(grunt.file.read(fileToRead));
                        });

                        return middlewares;
                    }
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-connect');

    //register the task
    grunt.registerTask('serve', ['connect', 'watch']);
};