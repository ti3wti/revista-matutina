#https://qrz-proxy.wmarincr.workers.dev/


let cachedSession = null;
let sessionExpiry = 0;

async function getQrzSession() {
    const now = Date.now();
    if (cachedSession && now < sessionExpiry) return cachedSession;
    const loginRes = await fetch(`https://xml.qrz.com/xml/1.36/?username=ti3wti&password=mecago72&agent=qrz-proxy-worker`);
    const loginXml = await loginRes.text();
    const match = loginXml.match(/<Key>([^<]+)<\/Key>/);
    if (!match) throw new Error("Login QRZ fallido");
    cachedSession = match[1];
    sessionExpiry = now + (20 * 60 * 1000);
    return cachedSession;
}

export default {
    async fetch(request) {
        const url = new URL(request.url);

        // ── CLIMA ──────────────────────────────────────────────
        if (url.searchParams.get('weather') === '1') {
            const lat = url.searchParams.get('lat');
            const lon = url.searchParams.get('lon');
            if (!lat || !lon) return new Response("Faltan lat/lon", { status: 400 });
            try {
                const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&elevation=NaN&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,surface_pressure`;
                const weatherRes = await fetch(weatherUrl);
                const weatherData = await weatherRes.text();
                return new Response(weatherData, { headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Content-Type": "application/json",
                    "Cache-Control": "no-store, no-cache, must-revalidate",
                    "Pragma": "no-cache"
                }});
            } catch(err) {
                return new Response("Error clima", { status: 500 });
            }
        }

        // ── QRZ ────────────────────────────────────────────────
        const callsign = url.searchParams.get('callsign');
        if (callsign) {
            try {
                let sessionKey = await getQrzSession();
                let lookupRes = await fetch(`https://xml.qrz.com/xml/1.36/?s=${sessionKey}&callsign=${callsign}`);
                let lookupXml = await lookupRes.text();
                if (lookupXml.includes('<Error>') && lookupXml.includes('session')) {
                    cachedSession = null; sessionExpiry = 0;
                    sessionKey = await getQrzSession();
                    lookupRes = await fetch(`https://xml.qrz.com/xml/1.36/?s=${sessionKey}&callsign=${callsign}`);
                    lookupXml = await lookupRes.text();
                }
                return new Response(lookupXml, { headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Content-Type": "application/xml"
                }});
            } catch(err) {
                return new Response("Error QRZ", { status: 500 });
            }
        }

        // ── LEGACY: ?url= ──────────────────────────────────────
        const targetUrl = url.searchParams.get('url');
        if (!targetUrl) return new Response("Error: Falta parámetro", { status: 400 });
        try {
            const r = await fetch(targetUrl);
            const data = await r.text();
            return new Response(data, { headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "application/xml"
            }});
        } catch(err) {
            return new Response("Error de proxy", { status: 500 });
        }
    }
};
