// http://localhost:3000/api/discord
// {
//     "server_env": "GENERAL_DISCORD_WEBHOOK_URL",
//     "message": "Hello from Postman!"
// }
import axios from 'axios';

type ServerEnv = 'MESSAGES_DISCORD_WEBHOOK_URL' | 'VISITORS_DISCORD_WEBHOOK_URL' | 'GITHUB_NOTIF_DISCORD_WEBHOOK_URL' | 'GENERAL_DISCORD_WEBHOOK_URL';

export default async function handler(req: any, res: any) {
    if (req.method === 'POST') {
        const { message, server_env }: { message: string; server_env: ServerEnv } = req.body;

        if (!isValidServerEnv(server_env)) {
            return res.status(400).json({ success: false, error: 'Invalid server_env value' });
        }

        const webhookURL = process.env[server_env]! as string;

        try {
            await axios.post(webhookURL, { content: message });
            res.status(200).json({ success: true });
        } catch (error) {
            console.error('Error sending message to Discord:', error);
            res.status(500).json({ success: false, error: 'Failed to send message to Discord' });
        }
    } else {
        res.status(405).json({ success: false, error: 'Method Not Allowed' });
    }
}

function isValidServerEnv(value: string): value is ServerEnv {
    return ['MESSAGES_DISCORD_WEBHOOK_URL', 'VISITORS_DISCORD_WEBHOOK_URL', 'GITHUB_NOTIF_DISCORD_WEBHOOK_URL', 'GENERAL_DISCORD_WEBHOOK_URL'].includes(value);
}
