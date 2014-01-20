/* jshint node: true */

/*
This Grunt task updates the npm-shrinkwrap.canonical.json file that's used as the key for Bootstrap's npm packages cache.
This task should be run and the updated file should be committed whenever Bootstrap's dependencies change.
*/

var canonicallyJsonStringify = require('canonical-json');
var npm = require('npm');


function updateShrinkwrap(grunt) {
  var done = this.async();
  var DEST_FILE = 'test-infra/npm-shrinkwrap.canonical.json';
  npm.load(function (npmErr, npm) {
    if (npmErr) {
      grunt.fail.warn(npmErr);
    }
    grunt.log.writeln('Running ' + 'npm update'.bold + '...');
    npm.commands.update([], function (updateErr) {
      if (updateErr) {
        grunt.fail.warn(updateErr);
      }
      npm.config.set('dev', true);// include devDependencies
      npm.commands.shrinkwrap([], true, function (err, shrinkwrapData) {
        if (err) {
          grunt.fail.warn(err);
        }
        // Can't tell npm not to create this file, so delete it ourselves
        grunt.file.delete('npm-shrinkwrap.json');
        // Output as Canonical JSON in correct location
        grunt.file.write(DEST_FILE, canonicallyJsonStringify(shrinkwrapData));
        grunt.log.writeln('File ' + DEST_FILE.cyan + ' updated.');
        done(true);
      });
    });
  });
}


module.exports = updateShrinkwrap;
