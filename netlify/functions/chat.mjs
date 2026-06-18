// Netlify Serverless Function — /api/chat
// 兼容 Netlify Functions 格式

export default async (req, context) => {
  // 只允许 POST
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json', 'Allow': 'POST' },
    });
  }

  const API_URL = process.env.API_URL || 'https://api.deepseek.com/chat/completions';
  const API_KEY = process.env.API_KEY;

  if (!API_KEY) {
    return new Response(JSON.stringify({
      error: '服务端未配置 API_KEY，请在 Netlify 项目的 Environment Variables 中添加 API_KEY。',
    }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }

  try {
    let body;
    try {
      body = await req.json();
    } catch {
      return new Response(JSON.stringify({ error: '请求体不是有效JSON' }), {
        status: 400, headers: { 'Content-Type': 'application/json' },
      });
    }

    const { system, user, model, temperature, max_tokens } = body || {};

    if (!user) {
      return new Response(JSON.stringify({ error: '缺少必要参数：user' }), {
        status: 400, headers: { 'Content-Type': 'application/json' },
      });
    }

    const messages = [];
    if (system) messages.push({ role: 'system', content: system });
    messages.push({ role: 'user', content: user });

    const upstream = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: model || 'deepseek-chat',
        messages,
        temperature: temperature ?? 0.8,
        max_tokens: max_tokens ?? 2000,
      }),
    });

    const data = await upstream.json();

    if (!upstream.ok) {
      return new Response(JSON.stringify({
        error: data?.error?.message || '上游 API 调用失败',
        detail: data,
      }), { status: upstream.status, headers: { 'Content-Type': 'application/json' } });
    }

    const content = data?.choices?.[0]?.message?.content || '';
    return new Response(JSON.stringify({ content, raw: data }), {
      status: 200, headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: '服务端处理出错', detail: String(err) }), {
      status: 500, headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const config = {
  path: '/api/chat',
};
