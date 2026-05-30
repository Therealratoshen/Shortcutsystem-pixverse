import { useState } from 'react';
import { Check } from 'lucide-react';
import type { Template, TemplateCategory } from '../../types';
import { templates } from '../../data/templates';

interface TemplateSelectorProps {
  selectedTemplate: Template | null;
  onSelect: (template: Template) => void;
}

const categories: { id: TemplateCategory | 'all'; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'runway', label: 'Runway' },
  { id: 'street', label: 'Street' },
  { id: 'editorial', label: 'Editorial' },
  { id: 'campaign', label: 'Campaign' },
  { id: 'lifestyle', label: 'Lifestyle' },
];

export default function TemplateSelector({ selectedTemplate, onSelect }: TemplateSelectorProps) {
  const [activeCategory, setActiveCategory] = useState<TemplateCategory | 'all'>('all');

  const filteredTemplates = activeCategory === 'all' 
    ? templates 
    : templates.filter(t => t.category === activeCategory);

  return (
    <div className="space-y-6">
      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              activeCategory === cat.id
                ? 'bg-accent text-primary'
                : 'bg-white/5 text-text-secondary hover:bg-white/10 hover:text-text-primary'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Template Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTemplates.map((template) => (
          <button
            key={template.id}
            onClick={() => onSelect(template)}
            className={`group relative rounded-2xl overflow-hidden border-2 transition-all hover-lift ${
              selectedTemplate?.id === template.id
                ? 'border-accent ring-2 ring-accent/20'
                : 'border-transparent hover:border-accent/50'
            }`}
          >
            {/* Thumbnail */}
            <div className="aspect-[3/4] relative">
              <img
                src={template.thumbnail}
                alt={template.name}
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              
              {/* Selected indicator */}
              {selectedTemplate?.id === template.id && (
                <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-accent flex items-center justify-center">
                  <Check className="w-5 h-5 text-primary" />
                </div>
              )}

              {/* Category tag */}
              <div className="absolute top-3 left-3">
                <span className="px-2 py-1 rounded-full bg-black/50 backdrop-blur-sm text-xs font-medium text-white capitalize">
                  {template.category}
                </span>
              </div>

              {/* Content overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-lg font-semibold text-white mb-1">{template.name}</h3>
                <p className="text-sm text-white/70 line-clamp-2">{template.description}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
