import { createClient } from '@supabase/supabase-js';
import webpush from 'web-push';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// VAPID Keys (Generated dynamically for this setup)
const publicVapidKey = 'BC6YTs1AcEQB1nhIp11jlDyL5cY7iHu8OS_g76_FrfWQv8maOLg0IoLDKJu4uMrJhJN_rs5n3gCXzywm3SwOXaI';
const privateVapidKey = 'WrKYFTBLA8UyKUHGRh8sb_ajye_bpcOATHDuZ9VkcB8';

webpush.setVapidDetails(
    'mailto:your-email@example.com',
    publicVapidKey,
    privateVapidKey
);

export default async function handler(request, response) {
    if (request.method !== 'POST') {
        return response.status(405).json({ error: 'Method not allowed' });
    }

    const { title, body, url } = request.body;
    const payload = JSON.stringify({
        title: title || 'New Mission Assigned!',
        body: body || 'Check the app for details.',
        url: url || '/team'
    });

    try {
        // 1. Fetch all subscriptions
        const { data: subscriptions, error } = await supabase
            .from('push_subscriptions')
            .select('*');

        if (error) throw error;

        // 2. Send notifications
        const results = await Promise.allSettled(
            subscriptions.map(sub => {
                const pushSubscription = sub.subscription;
                return webpush.sendNotification(pushSubscription, payload)
                    .catch(err => {
                        if (err.statusCode === 404 || err.statusCode === 410) {
                            // Subscription expired, delete from DB
                            console.log('Subscription expired, deleting:', sub.id);
                            supabase.from('push_subscriptions').delete().eq('id', sub.id).then();
                        }
                        throw err;
                    });
            })
        );

        return response.status(200).json({ success: true, results: results.length });
    } catch (error) {
        console.error('Push Error:', error);
        return response.status(500).json({ error: error.message });
    }
}
