'use strict';

const artifact = require('./artifact.json');

(async () => {
  console.log('Preparing Slack message...', artifact);

  const payload = {
    channel: process.env.SLACK_CHANNEL_ID,
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*[NEW]* ${process.env.GITHUB_PROJECT_NAME} - ${process.env.GITHUB_RELEASE_TAG}`
        },
        accessory: {
          type: 'button',
          text: {
            type: 'plain_text',
            text: 'Show release :rocket:',
            emoji: true
          },
          url: process.env.GITHUB_RELEASE_URL
        }
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: ':clipboard: Tickets JIRA :'
        }
      },
      {
        type: 'rich_text',
        elements: [
          {
            type: 'rich_text_list',
            style: 'bullet',
            elements: []
          }
        ]
      }
    ]
  };

  if (artifact.tickets?.length) {
    artifact.tickets.forEach((ticket) => {
      ticket = ticket.toUpperCase();
      payload.blocks[2].elements[0].elements.push({
        type: 'rich_text_section',
        elements: [
          {
            type: 'link',
            url: `https://${process.env.JIRA_DOMAIN}/browse/${ticket}`,
            text: ticket
          }
        ]
      });
    });
  } else {
    payload.blocks.splice(2, 1);
    payload.blocks.splice(1, 1);

    if (artifact.jira_version) {
      payload.blocks.push({
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `:clipboard: JIRA Version - <${artifact.jira_version.url}|${artifact.jira_version.name}>`
        }
      });
    }
  }

  console.log('payload', payload);

  try {
    const slackResponse = await fetch(
      'https://slack.com/api/chat.postMessage',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.SLACK_API_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      }
    );

    if (!slackResponse.ok) {
      const err = await slackResponse.json();
      throw new Error(`Failed to send message: ${JSON.stringify(err)}`);
    }

    console.log('Message sent successfully !');
  } catch (error) {
    console.error('Request error', error.message);
  }
})();
