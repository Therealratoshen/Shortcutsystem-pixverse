import { useState } from 'react';
import { Play, Heart, Trash2, Filter, X } from 'lucide-react';
import { useVideo } from '../../contexts/VideoContext';
import { useFavorites } from '../../contexts/FavoritesContext';
import type { TemplateCategory } from '../../types';
import VideoPlayer from '../ui/VideoPlayer';

const categories: { id: TemplateCategory | 'all'; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'runway', label: 'Runway' },
  { id: 'street', label: 'Street' },
  { id: 'editorial', label: 'Editorial' },
  { id: 'campaign', label: 'Campaign' },
  { id: 'lifestyle', label: 'Lifestyle' },
];

export default function VideoGallery() {
  const { state } = useVideo();
  const { favorites, removeFavorite, isFavorite } = useFavorites();
  const [activeCategory, setActiveCategory] = useState<TemplateCategory | 'all'>('all');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<any>(null);

  const filteredVideos = state.generatedVideos.filter(video => {
    const matchesCategory = activeCategory === 'all' || video.templateId.includes(activeCategory);
    const matchesFavorites = !showFavoritesOnly || isFavorite(video.videoId);
    return matchesCategory && matchesFavorites;
  });

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Video Gallery</h1>
          <p className="text-text-secondary">
            Browse and manage your generated fashion videos
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 mb-8">
          {/* Category filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-text-muted" />
            <div className="flex gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                    activeCategory === cat.id
                      ? 'bg-accent text-primary'
                      : 'bg-white/5 text-text-secondary hover:bg-white/10'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Favorites toggle */}
          <button
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              showFavoritesOnly
                ? 'bg-error/20 text-error'
                : 'bg-white/5 text-text-secondary hover:bg-white/10'
            }`}
          >
            <Heart className={`w-4 h-4 ${showFavoritesOnly ? 'fill-error' : ''}`} />
            Favorites
          </button>
        </div>

        {/* Videos Grid */}
        {filteredVideos.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-secondary flex items-center justify-center">
              <Play className="w-10 h-10 text-text-muted" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No videos found</h3>
            <p className="text-text-secondary">
              {showFavoritesOnly
                ? 'You haven\'t saved any favorites yet'
                : 'Create your first video to see it here'}
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVideos.map((video) => (
              <div
                key={video.id}
                className="group rounded-2xl overflow-hidden bg-secondary hover-lift cursor-pointer"
                onClick={() => setSelectedVideo(video)}
              >
                {/* Thumbnail */}
                <div className="relative aspect-video">
                  <img
                    src={video.thumbnail || 'https://via.placeholder.com/400x225'}
                    alt="Video thumbnail"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-accent/90 flex items-center justify-center">
                      <Play className="w-8 h-8 text-primary ml-1" />
                    </div>
                  </div>
                  <div className="absolute bottom-2 right-2 px-2 py-1 rounded bg-black/70 text-xs font-medium">
                    {video.duration}s
                  </div>
                </div>

                {/* Info */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold mb-1">Fashion Video</h3>
                      <p className="text-sm text-text-muted">
                        {new Date(video.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFavorite(video.videoId);
                      }}
                      className={`p-2 rounded-lg transition-colors ${
                        isFavorite(video.videoId)
                          ? 'bg-error/20 text-error'
                          : 'bg-white/5 text-text-muted hover:text-error'
                      }`}
                    >
                      <Heart className={`w-5 h-5 ${isFavorite(video.videoId) ? 'fill-error' : ''}`} />
                    </button>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-text-muted">
                    <span className="px-2 py-1 rounded bg-white/5">{video.quality}</span>
                    <span className="px-2 py-1 rounded bg-white/5">{video.model}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Favorites Section */}
        {favorites.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-bold mb-4">Your Favorites</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {favorites.map((fav) => (
                <div
                  key={fav.id}
                  className="group rounded-xl overflow-hidden bg-secondary"
                >
                  <div className="relative aspect-video">
                    <img
                      src={fav.thumbnail}
                      alt={fav.title}
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => removeFavorite(fav.id)}
                      className="absolute top-2 right-2 p-2 rounded-lg bg-black/50 text-error opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="p-3">
                    <h4 className="font-medium text-sm">{fav.title}</h4>
                    <span className="text-xs text-text-muted capitalize">{fav.category}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
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
