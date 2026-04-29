const https = require('https');

const GHL_API_KEY = process.env.GHL_API_KEY;
const GHL_LOCATION_ID = process.env.GHL_LOCATION_ID || 'NziAAK6pVtnMjwM4rs2N';

function httpsPost(hostname, path, headers, body) {
  return new Promise((resolve, reject) => {
    const bodyStr = JSON.stringify(body);
    const req = https.request(
      {
        hostname,
        path,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(bodyStr),
          ...headers,
        },
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => resolve({ status: res.statusCode, body: data }));
      }
    );
    req.on('error', reject);
    req.write(bodyStr);
    req.end();
  });
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  // Netlify sends the webhook payload as JSON with a `data` object
  let payload;
  try {
    payload = JSON.parse(event.body);
  } catch {
    return { statusCode: 400, body: 'Invalid payload' };
  }

  // Netlify form webhook shape: { data: { full-name, email, phone, message, ... } }
  const fields = payload.data || payload;

  const name = (fields['full-name'] || '').trim();
  const email = (fields['email'] || '').trim();
  const phone = (fields['phone'] || '').trim();
  const message = (fields['message'] || '').trim();

  if (!name || !email) {
    return { statusCode: 400, body: 'Missing required fields' };
  }

  const [firstName, ...rest] = name.split(' ');
  const lastName = rest.join(' ');

  if (!GHL_API_KEY) {
    console.error('GHL_API_KEY not set');
    return { statusCode: 500, body: 'Configuration error' };
  }

  try {
    const ghlRes = await httpsPost(
      'rest.gohighlevel.com',
      '/v1/contacts/',
      { Authorization: `Bearer ${GHL_API_KEY}` },
      {
        firstName,
        lastName,
        email,
        phone,
        locationId: GHL_LOCATION_ID,
        source: 'Website Contact Form',
        tags: ['website-contact'],
        customField: [{ id: 'message', field_value: message }],
      }
    );
    console.log('HighLevel response:', ghlRes.status, ghlRes.body);
  } catch (e) {
    console.error('HighLevel error:', e.message);
    return { statusCode: 500, body: 'HighLevel error' };
  }

  return { statusCode: 200, body: 'OK' };
};
