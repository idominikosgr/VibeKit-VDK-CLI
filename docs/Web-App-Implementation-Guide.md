# Vibe Coding RulesHub Web App Implementation Guide

This guide outlines the steps needed to implement the web application features required for successful integration with the Vibe Coding Rules repository.

## Overview

The Vibe Coding RulesHub web application is built with Next.js and uses Supabase for backend functionality. To integrate with the Vibe Coding Rules repository, you'll need to implement several key features:

1. Rule synchronization from GitHub
2. Rule browsing and searching
3. User collections and voting
4. Admin dashboard for sync management

## Prerequisites

Before implementing these features, ensure you have:

1. A Next.js application set up with Supabase integration
2. Access to the Vibe Coding Rules repository
3. GitHub API access via a Personal Access Token
4. Supabase project with appropriate permissions

## Implementation Steps

### 1. Database Setup

First, ensure your Supabase database has the correct schema:

1. Run the migration script provided in the repository:
   ```bash
   psql -h YOUR_SUPABASE_URL -d postgres -U postgres -f lib/supabase/schema-enhanced.sql
   ```

   Alternatively, you can run the SQL commands through the Supabase SQL Editor in the dashboard.

2. Set up RLS (Row Level Security) policies to control access:
   - Public read access for rules and categories
   - Authenticated access for user collections and votes
   - Admin-only access for sync operations

3. Apply the analytics and feedback schema extensions:
   ```bash
   psql -h YOUR_SUPABASE_URL -d postgres -U postgres -f lib/supabase/schema-analytics-extension.sql
   ```

   This creates tables and functions for tracking rule usage, collecting user feedback, and generating analytics reports.

### 2. API Routes Implementation

#### A. GitHub Webhook Endpoint

Create an API route at `app/api/webhooks/github/route.ts` to receive webhook notifications from GitHub:

```typescript
// Implementation already provided in the repository
// Ensure this endpoint is properly configured in your Next.js project
```

Key functionality to implement:
- Webhook signature verification
- Parse changed files to determine which rules to sync
- Trigger the appropriate sync function

#### B. Admin Sync API

Create an API route at `app/api/admin/sync/route.ts` for manual sync triggers:

```typescript
// Implementation already provided in the repository
// Ensure this endpoint is properly configured in your Next.js project
```

Key functionality to implement:
- Authentication and authorization for admin users
- Manual sync trigger with options
- Result reporting

### 3. Rule Display Components

Implement the following components for displaying rules:

#### A. Rule List Component

Create a component to display a list of rules with filtering and sorting:

```tsx
// Example implementation
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { RuleCard } from './rule-card';
import { Pagination } from './ui/pagination';
import { Input } from './ui/input';
import { Select } from './ui/select';

export function RuleList({ category = null }) {
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('latest');

  useEffect(() => {
    fetchRules();
  }, [category, page, sort]);

  const fetchRules = async () => {
    setLoading(true);

    let query = supabase
      .from('rules_hub.rules')
      .select('*, categories:rules_hub.categories(name, slug)', { count: 'exact' });

    if (category) {
      query = query.eq('categories.slug', category);
    }

    if (search) {
      query = query.textSearch('title || description || content', search);
    }

    if (sort === 'latest') {
      query = query.order('last_updated', { ascending: false });
    } else if (sort === 'popular') {
      query = query.order('downloads', { ascending: false });
    } else if (sort === 'votes') {
      query = query.order('votes', { ascending: false });
    }

    const { data, count, error } = await query
      .range((page - 1) * 10, page * 10 - 1);

    if (!error) {
      setRules(data || []);
      setTotalPages(Math.ceil((count || 0) / 10));
    }

    setLoading(false);
  };

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <Input
          placeholder="Search rules..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && fetchRules()}
        />
        <Select value={sort} onValueChange={setSort}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="latest">Latest</SelectItem>
            <SelectItem value="popular">Most Downloads</SelectItem>
            <SelectItem value="votes">Most Votes</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="grid gap-4">
          {[...Array(3)].map((_, i) => (
            <RuleCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <>
          <div className="grid gap-4">
            {rules.map(rule => (
              <RuleCard key={rule.id} rule={rule} />
            ))}
          </div>

          {totalPages > 1 && (
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
              className="mt-6"
            />
          )}
        </>
      )}
    </div>
  );
}
```

#### B. Rule Detail Component

Create a component to display detailed rule information:

```tsx
// Example implementation
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Markdown } from '@/components/ui/markdown';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export function RuleDetail({ slug }) {
  const [rule, setRule] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRule();
  }, [slug]);

  const fetchRule = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from('rules_hub.rules')
      .select('*, categories:rules_hub.categories(name, slug)')
      .eq('slug', slug)
      .single();

    if (!error && data) {
      setRule(data);
    }

    setLoading(false);
  };

  const handleDownload = async () => {
    if (!rule) return;

    // Increment download count
    await supabase.rpc('rules_hub.increment_download_count', { rule_id: rule.id });

    // Download the rule content
    const element = document.createElement('a');
    const file = new Blob([rule.content], { type: 'text/markdown' });
    element.href = URL.createObjectURL(file);
    element.download = `${rule.slug}.mdc`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    toast.success('Rule downloaded successfully');
  };

  // ... render the rule details
}
```

#### C. Rule Voting Component

Create a component for users to vote on rules:

```tsx
// Example implementation
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { ThumbsUpIcon } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/use-auth';

export function RuleVoteButton({ ruleId }) {
  const [hasVoted, setHasVoted] = useState(false);
  const [voteCount, setVoteCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const { user, signIn } = useAuth();

  useEffect(() => {
    fetchVoteStatus();
  }, [ruleId, user?.id]);

  const fetchVoteStatus = async () => {
    if (!user) {
      setHasVoted(false);
      return;
    }

    // Get vote count
    const { data: rule } = await supabase
      .from('rules_hub.rules')
      .select('votes')
      .eq('id', ruleId)
      .single();

    if (rule) {
      setVoteCount(rule.votes || 0);
    }

    // Check if user has voted
    const { data } = await supabase
      .from('rules_hub.user_votes')
      .select('id')
      .eq('rule_id', ruleId)
      .eq('user_id', user.id)
      .maybeSingle();

    setHasVoted(!!data);
  };

  const handleVote = async () => {
    if (!user) {
      toast('Please sign in to vote', {
        action: {
          label: 'Sign in',
          onClick: () => signIn(),
        },
      });
      return;
    }

    setLoading(true);

    if (hasVoted) {
      // Remove vote
      await supabase.rpc('rules_hub.remove_rule_vote', {
        rule_id: ruleId,
      });
      setHasVoted(false);
      setVoteCount(count => Math.max(0, count - 1));
      toast.success('Vote removed');
    } else {
      // Add vote
      await supabase.rpc('rules_hub.vote_for_rule', {
        rule_id: ruleId,
      });
      setHasVoted(true);
      setVoteCount(count => count + 1);
      toast.success('Vote added');
    }

    setLoading(false);
  };

  return (
    <Button
      variant={hasVoted ? 'default' : 'outline'}
      onClick={handleVote}
      disabled={loading}
      className="flex gap-1 items-center"
    >
      <ThumbsUpIcon className="w-4 h-4" />
      <span>{voteCount}</span>
    </Button>
  );
}
```

### 4. Admin Dashboard Implementation

Implement an admin dashboard at `app/admin/sync/page.tsx` to manage synchronization:

```tsx
// Implementation already provided in the repository
// Ensure this component is properly configured in your Next.js project
```

Key functionality to implement:
- Manual sync trigger with options
- View sync logs and results
- Error monitoring
- Category management

### 5. User Collection Features

Implement user collections to allow saving and organizing favorite rules:

```tsx
// Example implementation for a user collection component
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/use-auth';
import { toast } from 'sonner';

export function UserCollections() {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchCollections();
    }
  }, [user]);

  const fetchCollections = async () => {
    if (!user) return;

    setLoading(true);

    const { data, error } = await supabase
      .from('rules_hub.collections')
      .select('*, items:rules_hub.collection_items(rule:rules_hub.rules(*))')
      .eq('user_id', user.id);

    if (!error) {
      setCollections(data || []);
    }

    setLoading(false);
  };

  // ... implement collection CRUD operations
}

// Add to collection button for use on rule detail pages
export function AddToCollectionButton({ ruleId }) {
  const [collections, setCollections] = useState([]);
  const [open, setOpen] = useState(false);
  const { user, signIn } = useAuth();

  // ... implement add to collection functionality
}
```

### 6. Subscription for Real-Time Updates

Implement Supabase subscriptions for real-time data updates:

```tsx
// Example hook for real-time rule updates
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';

export function useRuleSubscription(ruleId) {
  const [rule, setRule] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRule();

    // Set up subscription for real-time updates
    const subscription = supabase
      .channel(`rule-${ruleId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'rules_hub',
          table: 'rules',
          filter: `id=eq.${ruleId}`,
        },
        (payload) => {
          setRule(payload.new);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [ruleId]);

  const fetchRule = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from('rules_hub.rules')
      .select('*, categories:rules_hub.categories(name, slug)')
      .eq('id', ruleId)
      .single();

    if (!error && data) {
      setRule(data);
    }

    setLoading(false);
  };

  return { rule, loading };
}
```

### 7. Repository Dispatch Handler

Implement a handler for GitHub repository dispatch events:

```tsx
// app/api/webhooks/repository-dispatch/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createGitHubSync } from '@/lib/sync/github-sync';

export async function POST(request: NextRequest) {
  try {
    // Validate the request is coming from GitHub Actions
    const authorization = request.headers.get('Authorization');
    if (!authorization || authorization !== `Bearer ${process.env.GITHUB_REPO_DISPATCH_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get payload
    const payload = await request.json();

    // Ensure this is a rules-updated event
    if (payload.event_type !== 'rules-updated') {
      return NextResponse.json({
        status: 'skipped',
        message: `Ignoring event: ${payload.event_type}`,
      });
    }

    // Run a full sync
    const sync = createGitHubSync({
      logResults: true,
    });

    const result = await sync.syncAllRules();

    return NextResponse.json({
      status: 'success',
      message: `Sync completed due to repository dispatch event`,
      result: {
        added: result.added,
        updated: result.updated,
        errors: result.errors.length,
        duration: `${result.duration}ms`,
      }
    });
  } catch (error) {
    console.error('Error processing repository dispatch webhook:', error);

    return NextResponse.json(
      { error: 'Failed to process repository dispatch webhook', message: error.message },
      { status: 500 }
    );
  }
}
```

### 8. Analytics Implementation

To track rule usage and generate usage insights:

#### A. Rule View Tracking

Create an API endpoint to track when a rule is viewed:

```typescript
// app/api/analytics/event/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server-client';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { eventType, ruleId, metadata = {}, clientInfo = {} } = body;

    if (!eventType || !ruleId) {
      return NextResponse.json(
        { error: 'Event type and rule ID are required' },
        { status: 400 }
      );
    }

    // Create supabase client
    const supabase = createClient();

    // Record the analytics event
    const { error } = await supabase.rpc(
      'rules_hub.record_analytics_event',
      {
        event_type: eventType,
        rule_id: ruleId,
        metadata: metadata,
        client_info: clientInfo,
      }
    );

    if (error) {
      return NextResponse.json(
        { error: 'Failed to record analytics event' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}
```

#### B. Search Analytics

Create an endpoint to track search queries:

```typescript
// app/api/analytics/search/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server-client';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, category, resultCount, sessionId } = body;

    if (!query) {
      return NextResponse.json(
        { error: 'Search query is required' },
        { status: 400 }
      );
    }

    // Create supabase client
    const supabase = createClient();

    // Record the search analytics
    const { error } = await supabase.rpc(
      'rules_hub.record_search_analytics',
      {
        query_text: query,
        category_slug: category || null,
        result_count: resultCount || 0,
        session_id: sessionId || null
      }
    );

    if (error) {
      return NextResponse.json(
        { error: 'Failed to record search analytics' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}
```

#### C. Analytics Dashboard

Create a dashboard page to visualize analytics data at `app/admin/analytics/page.tsx`. This should include:

- Total views, downloads, and copies
- Popular rules by downloads
- Search analytics
- Usage trends over time

Use visualization libraries like Recharts, D3.js, or Chart.js to display the data.

### 9. Feedback System Implementation

Implement a feedback system to collect user input on rules:

#### A. Feedback API Endpoint

```typescript
// app/api/feedback/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server-client';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { ruleId, feedbackType, subject, message, rating, sessionId } = body;

    if (!ruleId || !feedbackType || !subject || !message) {
      return NextResponse.json(
        { error: 'Required fields missing' },
        { status: 400 }
      );
    }

    // Create supabase client
    const supabase = createClient();

    // Submit the feedback
    const { data, error } = await supabase.rpc(
      'rules_hub.submit_feedback',
      {
        rule_id: ruleId,
        feedback_type: feedbackType,
        subject,
        message,
        rating,
        session_id: sessionId
      }
    );

    if (error) {
      return NextResponse.json(
        { error: 'Failed to submit feedback' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      feedbackId: data
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}
```

#### B. Feedback UI Components

Create UI components for:

1. A feedback form with fields for:
   - Feedback type (issue, suggestion, general)
   - Subject
   - Message
   - Optional rating

2. A feedback button or dialog trigger that can be easily added to rule display pages

3. An admin dashboard for reviewing and managing feedback at `app/admin/feedback/page.tsx`

#### C. Feedback Workflow

Implement a workflow for administrators to:

1. Review incoming feedback
2. Mark feedback as resolved, rejected, or pending
3. Add notes to feedback items
4. Export feedback data for rule improvement initiatives

## Installation Instructions

To install and configure these components in your Next.js application:

1. Copy the necessary server-side components:
   - API routes for webhooks and admin
   - Sync modules and parsers
   - Database schema files

2. Copy the UI components needed:
   - Rule list and detail components
   - Admin dashboard
   - User collection components

3. Configure environment variables:
   ```
   # Add these to your .env.local file
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-public-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   GITHUB_TOKEN=your-github-pat
   GITHUB_WEBHOOK_SECRET=your-webhook-secret
   GITHUB_REPO_OWNER=repo-owner
   GITHUB_REPO_NAME=repo-name
   GITHUB_REPO_DISPATCH_SECRET=your-dispatch-secret
   ```

4. Add required dependencies:
   ```bash
   npm install octokit p-limit gray-matter marked
   ```

5. Initialize the database:
   ```bash
   # Run the Supabase schema migration
   ```

6. Set up GitHub webhooks:
   - Point to your `/api/webhooks/github` endpoint
   - Configure with your webhook secret
   - Select "Push" events

## Testing the Integration

To test the integration:

1. Run a manual sync from the admin dashboard
2. Make a small change to a rule in the GitHub repository
3. Verify the change appears in the hub after sync
4. Test the collection and voting features
5. Verify search functionality works correctly

## Common Issues and Solutions

### Sync Fails with Authentication Error

**Problem**: GitHub API returns 401 Unauthorized

**Solution**:
- Verify your GitHub token has the correct permissions
- Check that the token hasn't expired
- Regenerate the token if necessary

### Webhook Events Not Triggering Sync

**Problem**: Pushing to the repository doesn't trigger sync

**Solutions**:
- Check webhook delivery logs in GitHub repository settings
- Verify webhook secret is correctly configured
- Check server logs for any errors in the webhook handler
- Test the webhook endpoint with a tool like Postman

### Database Errors During Sync

**Problem**: Supabase errors during sync process

**Solutions**:
- Check Supabase service role permissions
- Verify the schema has been set up correctly
- Review RLS policies to ensure they allow the necessary operations
- Monitor Supabase logs for detailed error information

## Recommended Enhancements

Once the basic integration is working, consider these enhancements:

1. **Rule Import/Export**: Allow users to bulk import/export rules
2. **Version Comparison**: Add a visual diff viewer for rule versions
3. **Advanced Analytics**: Implement more sophisticated analytics with:
   - A/B testing for rule variations
   - Conversion tracking for rule application
   - Integration with external analytics platforms
4. **Integration Documentation**: Generate API docs for programmatic access
5. **Rule Authoring UI**: Add a web-based editor for creating rules
6. **Notification System**: Alert users when rules they use are updated
7. **Feedback-Driven Improvements**: Implement a workflow that integrates user feedback directly into the rule improvement process
8. **Recommendation Engine**: Create a system that suggests relevant rules based on user behavior and preferences

## Conclusion

By implementing these components, your Vibe Coding RulesHub web application will be fully integrated with the Vibe Coding Rules repository, allowing for seamless synchronization of rule content while providing a rich user experience for browsing, searching, and interacting with rules.

Remember to test thoroughly and monitor the integration after deployment to ensure it remains functional as both the repository and web application evolve.
