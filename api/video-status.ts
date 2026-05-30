import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { jobId } = req.query;

    if (!jobId) {
      return res.status(400).json({ error: 'Job ID is required' });
    }

    const githubToken = process.env.GITHUB_TOKEN;
    const repoOwner = process.env.GITHUB_REPO_OWNER || 'Therealratoshen';
    const repoName = process.env.GITHUB_REPO_NAME || 'Shortcutsystem-pixverse';

    if (!githubToken) {
      return res.status(500).json({
        error: 'GitHub token not configured',
        message: 'Please set GITHUB_TOKEN in Vercel environment variables'
      });
    }

    const runsResponse = await fetch(
      `https://api.github.com/repos/${repoOwner}/${repoName}/actions/runs?event=workflow_dispatch&per_page=1`,
      {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'Authorization': `token ${githubToken}`,
        },
      }
    );

    if (!runsResponse.ok) {
      return res.status(runsResponse.status).json({
        error: 'Failed to fetch workflow status'
      });
    }

    const runsData = await runsResponse.json();
    const latestRun = runsData.workflow_runs?.[0];

    if (!latestRun) {
      return res.status(200).json({
        status: 'no_runs',
        message: 'No workflow runs found',
      });
    }

    const statusMap: Record<string, string> = {
      'queued': 'queued',
      'in_progress': 'generating',
      'completed': 'completed',
      'action_required': 'action_required',
      'cancelled': 'failed',
      'failure': 'failed',
      'neutral': 'completed',
      'skipped': 'failed',
      'stale': 'failed',
      'success': 'completed',
      'timed_out': 'failed',
      'waiting': 'queued',
    };

    const mappedStatus = statusMap[latestRun.conclusion] || latestRun.status;

    return res.status(200).json({
      jobId: latestRun.id,
      status: mappedStatus,
      conclusion: latestRun.conclusion,
      htmlUrl: latestRun.html_url,
      createdAt: latestRun.created_at,
      updatedAt: latestRun.updated_at,
    });

  } catch (error) {
    console.error('Error checking status:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
