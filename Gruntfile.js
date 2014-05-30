module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),
    coffee: {
      options: {
        join: true,
        sourceMap: true,
        expand: true
      },
      compile: {
        files: {
          "js/multiselectinput.jquery.js": ["coffeescript/multiselectinput.jquery.coffee"]
        }
      }
    },
    stylus: {
      compile: {
        files: {
          "css/multiselectinput.jquery.css": ["stylus/**/*.styl"]
        }
      }
    },
    uglify: {
      options: {
        report: "min",
        mangle: {
          except: ["jQuery"]
        },
        compress: {
          drop_console: true
        },
        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' + '<%= grunt.template.today("yyyy-mm-dd") %> */'
      },
      multiselectinput: {
        files: {
          "dist/js/multiselectinput.jquery.min.js": ["js/multiselectinput.jquery.js"]
        }
      }
    },
    copy: {
      main: {
        files: [
          { expand: true, src: "css/multiselectinput.jquery.css", dest: "dist/", filter: "isFile" },
          { expand: true, src: "js/multiselectinput.jquery.js", dest: "dist/", filter: "isFile" }
        ]
      }
    },
    watch: {
      stylus: {
        files: ["stylus/**/*.styl"],
        tasks: ["stylus"]
      },
      coffee: {
        files: ["coffeescript/multiselectinput.jquery.coffee"],
        tasks: ["coffee"]
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-stylus');
  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-copy');

  grunt.registerTask("develop", ["watch"]);
  grunt.registerTask("default", ["stylus", "coffee"]);
  grunt.registerTask("distribute", ["stylus", "coffee", "uglify", "copy"]);
  grunt.event.on("watch", function(action, filepath) {
    grunt.log.writeln(filepath + " has " + action);
  });
};
