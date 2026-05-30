import { useState } from 'react';
import { useUserTier } from '../../contexts/UserTierContext';
import { useVideo } from '../../contexts/VideoContext';
import { Video, Zap, Clock, Star, TrendingUp, Crown, X } from 'lucide-react';
import VideoPlayer from '../ui/VideoPlayer';

export default function UserDashboard() {
  const { user, setUserTier } = useUserTier();
  const { state } = useVideo();
  const [selectedVideo, setSelectedVideo] = useState<any>(null);

  const stats = [
    {
      label: 'Videos Generated',
      value: state.generatedVideos.length,
      icon: Video,
      color: 'text-accent',
      bg: 'bg-accent/10',
    },
    {
      label: 'This Month',
      value: user.stats.videosThisMonth,
      icon: TrendingUp,
      color: 'text-success',
      bg: 'bg-success/10',
    },
    {
      label: 'Total Clips',
      value: user.stats.clipsGenerated,
      icon: Zap,
      color: 'text-purple-400',
      bg: 'bg-purple-400/10',
    },
    {
      label: 'Videos Remaining',
      value: user.tier === 'pro' ? '∞' : user.videosRemaining,
      icon: Clock,
      color: user.videosRemaining > 0 ? 'text-blue-400' : 'text-error',
      bg: user.videosRemaining > 0 ? 'bg-blue-400/10' : 'bg-error/10',
    },
  ];

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-text-secondary">
            Welcome back, {user.name}! Here's your video creation overview.
          </p>
        </div>

        {/* User Tier Card */}
        <div className="mb-8 p-6 rounded-2xl bg-gradient-to-br from-accent/20 to-secondary border border-accent/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                user.tier === 'pro' ? 'bg-gradient-to-br from-accent to-accent-dark' : 'bg-secondary'
              }`}>
                {user.tier === 'pro' ? (
                  <Crown className="w-8 h-8 text-primary" />
                ) : (
                  <Star className="w-8 h-8 text-accent" />
                )}
              </div>
              <div>
                <h2 className="text-2xl font-bold">
                  {user.tier === 'pro' ? 'Pro User' : 'New User'}
                </h2>
                <p className="text-text-secondary">
                  {user.tier === 'pro'
                    ? 'Unlimited video generation'
                    : `${user.videosRemaining} videos remaining this month`}
                </p>
              </div>
            </div>
            {user.tier === 'new' && (
              <button
                onClick={() => setUserTier('pro')}
                className="px-6 py-3 bg-gradient-to-r from-accent to-accent-dark text-primary font-semibold rounded-xl hover:scale-105 transition-transform"
              >
                Upgrade to Pro
              </button>
            )}
          </div>

          {/* Usage bar for new users */}
          {user.tier === 'new' && (
            <div className="mt-6">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-text-secondary">Monthly usage</span>
                <span className="text-text-primary">{5 - user.videosRemaining} / 5 videos</span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-accent transition-all"
                  style={{ width: `${((5 - user.videosRemaining) / 5) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className="p-6 rounded-2xl bg-secondary">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
                <div className="text-3xl font-bold mb-1">{stat.value}</div>
                <div className="text-sm text-text-secondary">{stat.label}</div>
              </div>
            );
          })}
        </div>

        {/* Recent Videos */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Recent Videos</h2>
          {state.generatedVideos.length === 0 ? (
            <div className="p-8 rounded-2xl bg-secondary text-center">
              <Video className="w-12 h-12 text-text-muted mx-auto mb-4" />
              <p className="text-text-secondary">
                No videos generated yet. Start creating your first fashion video!
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-4">
              {state.generatedVideos.slice(0, 6).map((video) => (
                <div
                  key={video.id}
                  className="rounded-xl overflow-hidden bg-secondary cursor-pointer hover:ring-2 hover:ring-accent transition-all"
                  onClick={() => setSelectedVideo(video)}
                >
                  <div className="aspect-video relative">
                    <img
                      src={video.thumbnail || 'https://via.placeholder.com/400x225'}
                      alt="Video thumbnail"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-accent/90 flex items-center justify-center">
                        <Video className="w-6 h-6 text-primary ml-1" />
                      </div>
                    </div>
                    <div className="absolute bottom-2 right-2 px-2 py-1 rounded bg-black/70 text-xs font-medium">
                      {video.duration}s
                    </div>
                  </div>
                  <div className="p-3">
                    <p className="text-sm text-text-secondary">
                      {new Date(video.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pro Features */}
        <div className="p-6 rounded-2xl bg-secondary">
          <h2 className="text-xl font-bold mb-4">Pro Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { title: 'Custom Prompts', desc: 'Write detailed prompts for precise control', enabled: user.tier === 'pro' },
              { title: 'Advanced Settings', desc: 'Motion modes, quality control, aspect ratios', enabled: user.tier === 'pro' },
              { title: 'Batch Generation', desc: 'Generate multiple videos at once', enabled: user.tier === 'pro' },
              { title: 'Priority Processing', desc: 'Skip the queue with priority generation', enabled: user.tier === 'pro' },
              { title: 'Extended Duration', desc: 'Up to 60 seconds per clip', enabled: user.tier === 'pro' },
              { title: 'Analytics Dashboard', desc: 'Track your video performance', enabled: user.tier === 'pro' },
            ].map((feature, i) => (
              <div
                key={i}
                className={`p-4 rounded-xl border ${
                  feature.enabled
                    ? 'border-accent/20 bg-accent/5'
                    : 'border-border bg-primary'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-2 h-2 rounded-full ${
                    feature.enabled ? 'bg-accent' : 'bg-text-muted'
                  }`} />
                  <h3 className="font-medium">{feature.title}</h3>
                </div>
                <p className="text-sm text-text-secondary">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Video Modal */}
      {selectedVideo && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedVideo(null)}
        >
          <div
            className="relative w-full max-w-4xl bg-secondary rounded-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setSelectedVideo(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Video Player */}
            <VideoPlayer
              url={selectedVideo.url || selectedVideo.videoUrl || ''}
              poster={selectedVideo.thumbnail}
            />

            {/* Video Info */}
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2">Fashion Video</h3>
              <p className="text-sm text-text-secondary mb-4">
                {selectedVideo.prompt || 'Generated video'}
              </p>
              <div className="flex items-center gap-4 text-sm text-text-muted">
                <span>{selectedVideo.quality}</span>
                <span>{selectedVideo.duration}s</span>
                <span>{selectedVideo.model}</span>
                <span>{new Date(selectedVideo.createdAt).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
