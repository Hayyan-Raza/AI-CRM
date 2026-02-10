
export class GoogleService {
    private static readonly CALENDAR_BASE_URL = 'https://www.googleapis.com/calendar/v3';
    private static readonly GMAIL_BASE_URL = 'https://gmail.googleapis.com/gmail/v1/users/me';

    static async getCalendarEvents(accessToken: string, maxResults = 10) {
        try {
            const response = await fetch(
                `${this.CALENDAR_BASE_URL}/calendars/primary/events?maxResults=${maxResults}&orderBy=startTime&singleEvents=true`,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );

            if (response.status === 401) {
                throw new Error('TOKEN_EXPIRED');
            }

            if (!response.ok) {
                throw new Error('Failed to fetch calendar events');
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching calendar events:', error);
            throw error;
        }
    }

    static async getGmailMessages(accessToken: string, maxResults = 10, query = 'is:unread newer_than:1d') {
        try {
            const url = new URL(`${this.GMAIL_BASE_URL}/messages`);
            url.searchParams.append('maxResults', maxResults.toString());
            if (query) url.searchParams.append('q', query);

            const response = await fetch(
                url.toString(),
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );

            if (response.status === 401) {
                throw new Error('TOKEN_EXPIRED');
            }

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error('Gmail API Error:', errorData);
                throw new Error('Failed to fetch Gmail messages');
            }

            const data = await response.json();

            // Fetch details for each message to get snippet/subject
            const messages = await Promise.all(
                (data.messages || []).map(async (msg: any) => {
                    const detailResponse = await fetch(
                        `${this.GMAIL_BASE_URL}/messages/${msg.id}`,
                        {
                            headers: {
                                Authorization: `Bearer ${accessToken}`,
                            },
                        }
                    );

                    if (detailResponse.status === 401) {
                        throw new Error('TOKEN_EXPIRED');
                    }

                    return detailResponse.json();
                })
            );

            return messages;
        } catch (error) {
            console.error('Error fetching Gmail messages:', error);
            throw error;
        }
    }

    static async sendGmailMessage(accessToken: string, to: string, subject: string, body: string) {
        const message = [
            `To: ${to}`,
            'Content-Type: text/plain; charset=utf-8',
            'MIME-Version: 1.0',
            `Subject: ${subject}`,
            '',
            body,
        ].join('\n');

        const encodedMessage = btoa(message).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

        try {
            const response = await fetch(`${this.GMAIL_BASE_URL}/messages/send`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    raw: encodedMessage,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to send email');
            }

            return await response.json();
        } catch (error) {
            console.error('Error sending email:', error);
            throw error;
        }
    }
}
