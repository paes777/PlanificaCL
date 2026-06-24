const path = require('path');
const fs = require('fs');
const https = require('https');
const Module = require('module');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const firebaseToolsPath = path.join(process.env.APPDATA, 'npm', 'node_modules', 'firebase-tools');

// Interceptar logger de Firebase para imprimir todos los logs y capturar la URL
let loginUrl = '';
try {
    const loggerPath = path.join(firebaseToolsPath, 'lib', 'logger');
    const loggerModule = require(loggerPath);
    
    const originalLog = loggerModule.logger.log;
    loggerModule.logger.log = function(levelOrEntry, message, ...meta) {
        let text = '';
        if (levelOrEntry && typeof levelOrEntry === 'object') {
            text = levelOrEntry.message || '';
        } else {
            text = message || '';
        }
        
        if (text && typeof text === 'string') {
            console.log(text);
            if (text.includes('https://auth.firebase.tools/login')) {
                loginUrl = text.trim();
            }
        }
        return originalLog.apply(this, arguments);
    };
    
    loggerModule.logger.info = function(...args) {
        const text = args.join(' ');
        console.log(text);
        if (text.includes('https://auth.firebase.tools/login')) {
            loginUrl = text.trim();
        }
    };
    loggerModule.logger.warn = function(...args) {
        console.log("[WARN]", args.join(' '));
    };
    loggerModule.logger.error = function(...args) {
        console.error("[ERROR]", args.join(' '));
    };
} catch (e) {
    console.error("Error al configurar loggers:", e.message);
}

// Función auxiliar para leer un Stream Readable a String
function readStream(stream) {
    return new Promise((resolve, reject) => {
        let chunks = [];
        stream.on('data', (chunk) => chunks.push(chunk));
        stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
        stream.on('error', (err) => reject(err));
    });
}

// Función para parsear multipart form data
function parseMultipart(bodyStr, boundary) {
    const params = {};
    const parts = bodyStr.split(boundary);
    for (const part of parts) {
        if (part.includes('name=')) {
            const nameMatch = part.match(/name="([^"]+)"/);
            if (nameMatch) {
                const name = nameMatch[1];
                const valuePart = part.split('\r\n\r\n')[1];
                if (valuePart) {
                    const value = valuePart.split('\r\n')[0];
                    params[name] = value;
                }
            }
        }
    }
    return params;
}

// Función para realizar HTTPS POST con módulo nativo
function nativeHttpsPost(url, headers, body) {
    return new Promise((resolve, reject) => {
        const u = new URL(url);
        const req = https.request({
            hostname: u.hostname,
            path: u.pathname + u.search,
            method: 'POST',
            headers: headers
        }, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(data);
                    resolve({ status: res.statusCode, body: parsed });
                } catch (e) {
                    resolve({ status: res.statusCode, body: data });
                }
            });
        });
        req.on('error', (err) => reject(err));
        if (body) {
            req.write(body);
        }
        req.end();
    });
}

// Interceptar peticiones HTTP de firebase-tools
try {
    const apiv2Path = path.join(firebaseToolsPath, 'lib', 'apiv2');
    const apiv2 = require(apiv2Path);
    const originalRequest = apiv2.Client.prototype.request;
    
    apiv2.Client.prototype.request = async function(options) {
        const urlPrefix = this.opts.urlPrefix || '';
        const pathStr = options.path || '';
        
        // Interceptar solo la llamada al intercambio de tokens de Google
        if (urlPrefix.includes('accounts.google.com') && pathStr.includes('/o/oauth2/token')) {
            try {
                const incomingHeaders = options.headers || {};
                const contentType = incomingHeaders['content-type'] || incomingHeaders['Content-Type'] || '';
                const boundaryMatch = contentType.match(/boundary=(.+)/);
                const boundary = boundaryMatch ? boundaryMatch[1] : '';
                
                // Leer el body (que es un Stream FormData)
                const rawBody = await readStream(options.body);
                const params = parseMultipart(rawBody, boundary);
                
                // Formatear como x-www-form-urlencoded
                const postData = Object.entries(params)
                    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
                    .join('&');
                
                const headers = {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Content-Length': Buffer.byteLength(postData)
                };
                
                // Hacer la petición nativa segura
                const response = await nativeHttpsPost('https://accounts.google.com/o/oauth2/token', headers, postData);
                
                if (response.status >= 400) {
                    const err = new Error(response.body.error_description || response.body.error || `HTTP ${response.status}`);
                    err.context = { body: response.body };
                    throw err;
                }
                
                return response;
            } catch (err) {
                const logMsg = `\n[INTERCEPT_ERROR]\n${err.stack || err.message || String(err)}\n`;
                fs.appendFileSync('C:/Users/Oscar/PlanificaCL_error.log', logMsg);
                throw err;
            }
        }
        
        // Ejecutar normalmente las demás peticiones (como /attest)
        return originalRequest.call(this, options);
    };
} catch (e) {
    console.error("Error al configurar interceptores de peticiones:", e.message);
}

// Interceptar require de Node.js para mockear @inquirer/prompts
const originalRequire = Module.prototype.require;
Module.prototype.require = function(id) {
    const exports = originalRequire.apply(this, arguments);
    if (id === '@inquirer/prompts' || id.includes('node_modules/@inquirer/prompts') || id.includes('node_modules\\@inquirer\\prompts')) {
        return {
            Separator: exports.Separator,
            input: async function(opts) {
                console.log("\n==================================================================");
                console.log("          INICIANDO CONEXIÓN A FIREBASE HOSTING                   ");
                console.log("==================================================================");
                
                if (loginUrl) {
                    console.log("\n1. COPIA y ABRE este enlace en tu navegador para iniciar sesion:");
                    console.log("   " + loginUrl);
                } else {
                    console.log("\n1. Usa el enlace de Firebase de arriba para iniciar sesion.");
                }
                
                console.log("\n2. Pega el codigo de autorizacion aqui abajo (clic derecho para pegar):");
                
                const readline = require('readline').createInterface({
                    input: process.stdin,
                    output: process.stdout
                });
                return new Promise((resolve) => {
                    readline.question('\nCodigo > ', (answer) => {
                        readline.close();
                        resolve(answer.trim());
                    });
                });
            },
            confirm: async () => true,
            select: async (opts) => opts.default || '',
            checkbox: async (opts) => opts.default || [],
            number: async (opts) => opts.default || 0,
            password: async () => '',
            search: async () => ''
        };
    }
    return exports;
};

const firebase = require(firebaseToolsPath);

firebase.login({
    localhost: false,
    reauth: true,
    interactive: true,
    nonInteractive: false
}).then((result) => {
    console.log("\nSUCCESS_LOGIN");
    process.exit(0);
}).catch((err) => {
    console.error("\nERROR_LOGIN:", err.message || err);
    try {
        fs.appendFileSync('C:/Users/Oscar/PlanificaCL_error.log', `\n[FINAL_ERROR]\n${err.stack || err.message || String(err)}\n`);
    } catch(e) {}
    process.exit(1);
});
