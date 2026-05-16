export const API_URL = window.location.hostname === 'localhost' ? 'http://localhost:3000': 'https://api.apextunnel.top';

export const setCookie = (name, value, days) =>{
  const maxAge = days * 24 * 60 * 60;
  document.cookie = `
    ${name}=${value}; path=/; max-age=${maxAge}; sameSite=Strict
    `;
};

export const VERSION = 'v2.0.0';