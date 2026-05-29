import { net } from "electron";
export async function networkServiceCall(method, url, params = {}, headers = {}) {
    try {
        const upperMethod = method.toUpperCase();
        let body = undefined;
        let finalUrl = url;
        if (upperMethod !== "GET") {
            body = JSON.stringify(params);
        }
        else if (params && Object.keys(params).length > 0) {
            const query = new URLSearchParams(Object.entries(params).reduce((acc, [key, value]) => {
                if (value !== undefined && value !== null) {
                    acc[key] = String(value);
                }
                return acc;
            }, {})).toString();
            finalUrl += `?${query}`;
        }
        const response = await new Promise((resolve, reject) => {
            const req = net.request({
                method: upperMethod,
                url: finalUrl,
            });
            // Set headers
            req.setHeader("Content-Type", "application/json");
            Object.entries(headers).forEach(([key, value]) => {
                req.setHeader(key, value.toString());
            });
            let responseBody = '';
            req.on('response', (res) => {
                res.on('data', (chunk) => {
                    responseBody += chunk.toString();
                });
                res.on('end', () => {
                    resolve({
                        status: res.statusCode,
                        headers: res.headers,
                        body: responseBody,
                    });
                });
                res.on('error', reject);
            });
            req.on('error', reject);
            if (body) {
                req.write(body);
            }
            req.end();
        });
        let data = {};
        try {
            data = JSON.parse(response.body);
        }
        catch (e) {
            // If not JSON, use raw body
            data = response.body;
        }
        if ((response.status >= 200 && response.status < 300) || data?.httpstatus === 200) {
            return { httpstatus: 200, data: data?.data || data };
        }
        return {
            httpstatus: response.status,
            data: { title: "ERROR", message: data?.message || "Network Error" },
        };
    }
    catch (err) {
        return {
            httpstatus: 404,
            data: { title: "ERROR", message: err.message },
        };
    }
}
