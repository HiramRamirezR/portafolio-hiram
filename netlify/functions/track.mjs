import { getStore } from '@netlify/blobs';

export default async (req, context) => {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers });
  }

  try {
    const { type, event } = await req.json();
    const store = getStore('visits');
    const now = new Date();
    const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    let monthlyCount = 0;
    let totalCount = 0;

    if (type === 'pageview') {
      const monthly = await store.get(monthKey, { type: 'json' });
      monthlyCount = (monthly?.count || 0) + 1;
      await store.setJSON(monthKey, { count: monthlyCount });

      const total = await store.get('total', { type: 'json' });
      totalCount = (total?.count || 0) + 1;
      await store.setJSON('total', { count: totalCount });
    }

    if (type === 'event' && event) {
      const eventsKey = `events:${monthKey}`;
      const events = await store.get(eventsKey, { type: 'json' }) || {};
      events[event] = (events[event] || 0) + 1;
      await store.setJSON(eventsKey, events);

      const totalEventsKey = 'events_total';
      const totalEvents = await store.get(totalEventsKey, { type: 'json' }) || {};
      totalEvents[event] = (totalEvents[event] || 0) + 1;
      await store.setJSON(totalEventsKey, totalEvents);
    }

    return new Response(JSON.stringify({ monthlyCount, totalCount }), { status: 200, headers });
  } catch (err) {
    console.error('track error:', err);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500, headers });
  }
};
