"use strict"
var net = require('net');
var tls = require('tls');
var constants = require('constants');
var Struct = require('struct');
var crc32 = require('buffer-crc32');
var svc = null;

const AgentPacket = Struct()
    .word32Ube('crc32_value')
    .word16Sle('exit_code')
    .word16Sbe('packet_type')
    .chars('output', 2048)
    .chars('cmdline', 2048)
    .chars('plugin', 2048)
    .chars('perf_handler', 1024);

const v1 = {
    check: function(service) {
        var self = this;
        svc = service;
        return Promise.resolve()
            .then(self.doCheck)
    },
    doCheck: function() {
        return new Promise(function(resolve, reject) {
            var client = new net.Socket();
            var checkResult = {
                state: -1,
                output: ""
            }
            //Binary Payload
            var OutPacket = AgentPacket;
            OutPacket.allocate();
            var context = tls.createSecureContext({
                secureProtocol: "SSLv23_method",
                honorCipherOrder: false,
                secureOptions: constants.SSL_OP_NO_SSLv2 | constants.SSL_OP_NO_SSLv3,
                ciphers: "ADH",
            })
            client = tls.connect(svc.server.port, svc.server.ip, {
                minDHSize: 512,
                rejectUnauthorized: false,
                secureContext: context
            }, function() {
                var buf = OutPacket.buffer();
                buf.fill(0);
                var proxy = OutPacket.fields;
                proxy.crc32_value = 0;
                proxy.cmdline = svc.check.params;
                proxy.plugin = svc.check.plugin;
                proxy.perf_handler = ""
                proxy.packet_type = 1
                proxy.output = ""
                proxy.exit_code = -1
                var crc = crc32.unsigned(buf);

                proxy.crc32_value = crc;

                client.write(buf)
            });

            client.setTimeout(svc.check.timeout, function() {
                reject(new Error("Timeout"));
                client.destroy();
            })
            client.on('data', function(data) {
                var InPacket =  AgentPacket;
                InPacket.setBuffer(data);
                var proxy = InPacket.fields;
                checkResult.state = proxy.exit_code;
                checkResult.output = proxy.output;
                checkResult.performance_data = proxy.perf_handler;
            });
            client.on('close', function() {
                resolve(checkResult);
            });
            client.on('error', function(err) {
                reject(err);
            });
        })
    }
}

module.exports = v1;