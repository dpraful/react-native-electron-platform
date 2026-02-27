export async function networkServiceCall(method, url, params = {}, headers = {}) {
  try {
    const upperMethod = method.toUpperCase();
    const options = {
      method: upperMethod,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
    };

    if (upperMethod !== "GET") {
      options.body = JSON.stringify(params);
    } else if (params && Object.keys(params).length > 0) {
      const query = new URLSearchParams(params).toString();
      url += `?${query}`;
    }

    const response = await fetch(url, options);
    const data = await response.json().catch(() => ({}));

    if (response.ok || data?.httpstatus === 200) {
      return { httpstatus: 200, data: data?.data || data };
    }

    return {
      httpstatus: response.status,
      data: { title: "ERROR", message: data?.message || "Network Error" },
    };
  } catch (err) {
    return {
      httpstatus: 404,
      data: { title: "ERROR", message: err.message },
    };
  }
}