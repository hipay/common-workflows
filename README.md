# Common script for GitHub Workflows

## Slack Message

Prepare a specific step in order to use the **Slack Message** script :

```yaml
- name: Prepare and send Slack message
    run: |-
      curl -s https://raw.githubusercontent.com/hipay/common-workflows/main/scripts/slack-message.js | node
```

In order to use this script, you should delcare some environment variables in your GitHub step :

- `GITHUB_PROJECT_NAME` : the GitHub project name
- `GITHUB_RELEASE_TAG` : the GitHub tag of the current release
- `GITHUB_RELEASE_URL` : the GitHub release URL
- `SLACK_CHANNEL_ID` : a Slack channel ID
- `SLACK_API_TOKEN` : a Slack API token in order to use Slack APIs. Declare it as a **secret GitHub variable**
- `JIRA_DOMAIN` : the domain of your JIRA platform

This script also requires artifacts (as a JSON format) of your JIRA tickets used for the current release.
