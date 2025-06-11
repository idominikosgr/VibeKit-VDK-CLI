# Vibe Coding Rules Hub Integration

This document explains the integration between the Vibe Coding Rules GitHub repository and the Vibe Coding RulesHub web application.

## Architecture Overview

The integration uses a GitHub API-driven synchronization system with Supabase as the persistent storage layer. This approach provides the best balance of performance, freshness, and maintainability.

![Architecture Diagram](docs/images/integration-architecture.png)

### Key Components

1. **Vibe Coding Rules Repository**: The canonical source of truth for all rule content, containing MDC files organized in a structured way.

2. **Vibe Coding RulesHub**: The frontend application that provides a user interface for browsing, searching, and downloading rules.

3. **Supabase Database**: Serves as the intermediary database and backend for the Vibe Coding RulesHub application.

4. **Synchronization System**: Keeps the Supabase database in sync with the GitHub repository.

## Synchronization Process

The synchronization between the GitHub repository and Supabase database happens through three mechanisms:

### 1. Scheduled Sync

A scheduled job runs periodically (e.g., every 6 hours) to ensure the database stays in sync with the repository. This is implemented using Supabase Edge Functions with cron scheduling.

### 2. GitHub Webhooks

When changes are pushed to the repository, GitHub sends a webhook to the application, which triggers an immediate synchronization of the affected rules.

### 3. Manual Sync

Administrators can trigger a manual sync from the admin dashboard, which is useful for testing or ensuring immediate updates.

## Database Schema

The database schema is designed to efficiently store and query rule data:

- **`rules_hub.categories`**: Stores categories (assistants, languages, stacks, etc.)
- **`rules_hub.rules`**: Stores individual rules with metadata and content
- **`rules_hub.rule_versions`**: Stores historical versions of rules
- **`rules_hub.user_votes`**: Tracks user votes on rules
- **`rules_hub.collections`**: User-created collections of rules
- **`rules_hub.collection_items`**: Items in user collections
- **`rules_hub.sync_logs`**: Logs of synchronization operations

## Setup Instructions

### 1. Environment Configuration

Copy the `.env.example` file to `.env.local` and fill in the required values:

```bash
cp .env.example .env.local
# Edit .env.local with your configuration values
```

### 2. GitHub Setup

1. Create a Personal Access Token with `repo` permissions
2. Set up a webhook in your GitHub repository:
   - Payload URL: `https://your-domain.com/api/webhooks/github`
   - Content type: `application/json`
   - Secret: Create a secure secret and add it to your environment variables
   - Events: Select "Push" events

### 3. Supabase Setup

1. Run the database migrations in `lib/supabase/schema-enhanced.sql`
2. Set up Edge Functions:
   ```bash
   supabase functions deploy sync-rules
   supabase secrets set --env-file .env.local
   ```

3. Configure Edge Function scheduling through the Supabase dashboard

### 4. First Sync

After setting up the environment, run the first sync manually:

```bash
curl -X POST https://your-domain.com/api/admin/sync \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN"
```

## Usage

### For End Users

End users interact with the Vibe Coding RulesHub to:

1. Browse and search for rules
2. View rule details and compatibility
3. Download or copy rules
4. Create personal collections of rules

### For Administrators

Administrators can:

1. Trigger manual syncs
2. View sync logs
3. Monitor errors and resolve issues
4. Manage rule categories

### For Contributors

Contributors can submit new rules or modifications through the GitHub repository:

1. Fork the Vibe Coding Rules repository
2. Add or modify rules following the [Rule Authoring Guide](docs/Rule-Authoring-Guide.md)
3. Submit a pull request
4. Once merged, the changes will be synchronized to the hub automatically

## Troubleshooting

If you encounter sync issues:

1. Check the sync logs in the admin dashboard
2. Verify GitHub webhook payloads and delivery status
3. Ensure your environment variables are correctly set
4. Check the Supabase Edge Function logs for errors

## Future Enhancements

Planned improvements:

1. Two-way synchronization to allow edits from the web UI
2. Enhanced versioning and rule comparison features
3. Rule authoring tools integrated into the hub

## Analytics & Feedback

The Vibe Coding RulesHub includes support for analytics tracking and user feedback collection to help improve rule quality and understand usage patterns.

### Analytics Features

The analytics system tracks:

- Rule views, downloads, and copies
- Search queries and results
- Per-rule engagement metrics
- Usage patterns over time

This data helps identify which rules are most valuable to users and informs future rule development priorities.

### Feedback System

The feedback system allows users to:

- Report issues with specific rules
- Suggest improvements to existing rules
- Provide general feedback and ratings

All feedback is collected and made available to administrators for review and action.

For detailed implementation guidance, see the [Analytics & Feedback Guide](docs/Analytics-Feedback-Guide.md).
