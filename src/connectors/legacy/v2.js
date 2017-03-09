import net from 'net';
import tls from 'tls';
import constants from 'constants';
import Struct from 'struct';
import crc32 from 'buffer-crc32';

let svc = null;

const AgentPacket = Struct()
    .word32Ube('crc32_value')
    .word16Sle('exit_code')
    .word16Sbe('packet_type')
    .chars('output', 2048)
    .chars('cmdline', 2048)
    .chars('plugin', 2048)
    .chars('perf_handler', 1024);

const v1 = {
    check(service) {
        const self = this;
        svc = service;
        return Promise.resolve()
            .then(self.doCheck)
    },
    doCheck() {
        return new Promise((resolve, reject) => {
            const bench_start = new Date();
            let client = new net.Socket();
            const checkResult = {
                state: -1,
                output: ""
            };
            //Binary Payload
            const OutPacket = AgentPacket;
            OutPacket.allocate();
            const context = tls.createSecureContext({
                secureProtocol: "SSLv23_method",
                honorCipherOrder: false,
                secureOptions: constants.SSL_OP_NO_SSLv2 | constants.SSL_OP_NO_SSLv3,
                ciphers: "ADH",
            });
            client = tls.connect(svc.server.port, svc.server.ip, {
                minDHSize: 512,
                rejectUnauthorized: false,
                secureContext: context
            }, () => {
                const buf = OutPacket.buffer();
                buf.fill(0);
                const proxy = OutPacket.fields;
                proxy.crc32_value = 0;
                proxy.cmdline = svc.check.params;
                proxy.plugin = svc.check.plugin;
                proxy.perf_handler = ""
                proxy.packet_type = 1
                proxy.output = ""
                proxy.exit_code = -1
                const crc = crc32.unsigned(buf);

                proxy.crc32_value = crc;

                client.write(buf)
            });

            client.setTimeout(svc.check.timeout, () => {
                reject(new Error("Timeout"));
                client.destroy();
            })
            client.on('data', data => {
                const InPacket =  AgentPacket;
                InPacket.setBuffer(data);
                const proxy = InPacket.fields;
                checkResult.state = proxy.exit_code;
                checkResult.output = proxy.output;
                checkResult.performance_data = proxy.perf_handler;
            });
            client.on('close', () => {
                checkResult.bench = { ms: new Date() - bench_start };
                resolve(checkResult);
            });
            client.on('error', err => {
                reject(err);
            });
        });
    }
}

export default v1;