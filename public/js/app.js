/**
 * API Helper - Replaces google.script.run with fetch() REST API calls
 */
const API_BASE = '';

const api = {
  getToken() {
    return localStorage.getItem('sessionToken');
  },

  setToken(token) {
    localStorage.setItem('sessionToken', token);
  },

  removeToken() {
    localStorage.removeItem('sessionToken');
  },

  async request(method, url, data = null) {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const token = this.getToken();
    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    if (data && (method === 'POST' || method === 'PUT')) {
      options.body = JSON.stringify(data);
    }

    const res = await fetch(`${API_BASE}${url}`, options);
    const json = await res.json();

    if (!res.ok) {
      throw json;
    }

    return json;
  },

  get(url) {
    return this.request('GET', url);
  },

  post(url, data) {
    return this.request('POST', url, data);
  },

  put(url, data) {
    return this.request('PUT', url, data);
  },

  delete(url) {
    return this.request('DELETE', url);
  },

  async uploadFile(url, file, fieldName = 'image') {
    const formData = new FormData();
    formData.append(fieldName, file);

    const options = {
      method: 'POST',
      headers: {}
    };

    const token = this.getToken();
    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    options.body = formData;

    const res = await fetch(`${API_BASE}${url}`, options);
    const json = await res.json();

    if (!res.ok) {
      throw json;
    }

    return json;
  }
};
