/**
 * @author    carlosperate
 * @copyright 2015 carlosperate https://github.com/carlosperate
 * @license   Licensed under the The MIT License (MIT), a copy can be found in
 *            the electron project directory LICENSE file.
 *
 * @fileoverview Manages the Ardublockly server.
 */
var winston = require('winston');
var childProcess = require('child_process');
var projectLocator = require('./projectlocator.js');

var tag = '[Server mgr] '

var serverProcess = null;

module.exports.startServer = function() {
    if (serverProcess === null) {
        var serverExecLocation = projectLocator.getServerExecPath();
        winston.info(tag + 'Command: ' + serverExecLocation +
                     ' --findprojectroot --nobrowser');
        serverProcess = childProcess.spawn(
                serverExecLocation, ['--findprojectroot', '--nobrowser']);

        // Setting the listeners
        serverProcess.stdout.on('data', function(data) {
            winston.info('[Ardublockly server] ' + data);
        });

        serverProcess.stderr.on('data', function(data) {
            winston.error('[Ardublockly server] ' + data);
        });

        serverProcess.on('close', function(code) {
            if (code !== 0) {
                winston.info('[Ardublockly server] Process exited with code ' +
                             code);
            }
            serverProcess = null;
        });
    }
};

module.exports.stopServer = function() {
    if (serverProcess !== null) {
        // Server executable needs to clean up (kill child), so no SIGKILL
        serverProcess.kill('SIGTERM');
        serverProcess = null;
    }
};

module.exports.restartServer = function() {
    module.exports.stopServer();
    setTimeout(function() {
        module.exports.startServer();
    }, 1000);
};
