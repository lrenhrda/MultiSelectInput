module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),
    coffee: {
      options: {
        join: true,
        sourceMap: true,
        expand: true
      },
      multiselectinput: {
        files: {
          "dist/js/multiselectinput.jquery.js": ["src/coffeescript/multiselectinput.jquery.coffee"]
        }
      }
    },
    stylus: {
      multiselectinput: {
        files: {
          "dist/css/multiselectinput.jquery.css": ["src/stylus/**/*.styl"]
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
          "dist/js/multiselectinput.jquery.min.js": ["dist/js/multiselectinput.jquery.js"]
        }
      }
    },
    watch: {
      stylus: {
        files: ["src/stylus/**/*.styl"],
        tasks: ["stylus"]
      },
      coffee: {
        files: ["src/coffeescript/multiselectinput.jquery.coffee"],
        tasks: ["coffee"]
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-stylus');
  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask("default", ["stylus", "coffee"]);
  grunt.registerTask("develop", ["watch"]);
  grunt.registerTask("dist", ["stylus", "coffee", "uglify"]);

  grunt.event.on("watch", function(action, filepath) {
    grunt.log.writeln(filepath + " has " + action);
  });
};
