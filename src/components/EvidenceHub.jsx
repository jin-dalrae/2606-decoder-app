import React, { useState, useMemo } from 'react';
import cultureData from '../data/cultureData.json';

export default function EvidenceHub({ tensionMode, pillar = 'all' }) {
  const feedPillarMapping = {
    selection: ['feed-03', 'feed-09', 'feed-14'],
    progression: ['feed-03', 'feed-05', 'feed-13'],
    power: ['feed-02', 'feed-07', 'feed-09', 'feed-10', 'feed-11', 'feed-15', 'feed-16'],
    social: ['feed-01', 'feed-04', 'feed-06', 'feed-08', 'feed-12', 'feed-13', 'feed-15']
  };

  const feed = useMemo(() => {
    const allFeed = cultureData.evidenceFeed;
    if (pillar !== 'all' && feedPillarMapping[pillar]) {
      return allFeed.filter(item => feedPillarMapping[pillar].includes(item.id));
    }
    return allFeed;
  }, [pillar]);

  // State filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSentiment, setSelectedSentiment] = useState('All');
  const [selectedTag, setSelectedTag] = useState('All');

  // Derive unique categories, sentiments, and tags from feed for filter options
  const categories = useMemo(() => {
    return ['All', ...new Set(feed.map(item => item.category))];
  }, [feed]);

  const sentiments = useMemo(() => {
    return ['All', ...new Set(feed.map(item => item.sentiment))];
  }, [feed]);

  const tags = useMemo(() => {
    return ['All', ...new Set(feed.map(item => item.tag))];
  }, [feed]);

  // Reactive filtering logic
  const filteredFeed = useMemo(() => {
    return feed.filter(item => {
      const matchesSearch = 
        item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.source.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tag.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      const matchesSentiment = selectedSentiment === 'All' || item.sentiment === selectedSentiment;
      const matchesTag = selectedTag === 'All' || item.tag === selectedTag;

      return matchesSearch && matchesCategory && matchesSentiment && matchesTag;
    });
  }, [feed, searchQuery, selectedCategory, selectedSentiment, selectedTag]);

  // Dynamic Dashboard Stats based on active filtered feed
  const stats = useMemo(() => {
    const total = filteredFeed.length;
    const positive = filteredFeed.filter(item => item.sentiment === 'positive').length;
    const neutral = filteredFeed.filter(item => item.sentiment === 'neutral').length;
    const critical = filteredFeed.filter(item => item.sentiment === 'critical').length;
    return { total, positive, neutral, critical };
  }, [filteredFeed]);

  // Helper colors for sentiment pills
  const getSentimentStyles = (sentiment) => {
    switch (sentiment) {
      case 'positive':
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/35';
      case 'critical':
        return 'bg-red-500/15 text-red-400 border-red-500/35';
      case 'neutral':
      default:
        return 'bg-blue-500/15 text-blue-400 border-blue-500/35';
    }
  };

  return (
    <div className={`glass-panel w-full flex flex-col gap-6 transition-all duration-500 ${
      tensionMode ? 'border-red-500/30' : 'glass-panel-glow'
    }`}>
      
      {/* Header section */}
      <div>
        <span className="text-[10px] font-mono text-amber-500 tracking-widest uppercase mb-2 block">
          QUALITATIVE DATA INDEX
        </span>
        <h2 className="text-xl sm:text-2xl font-bold mb-2">Evidence Hub & Sentiment Feed</h2>
        <p className="text-stone-400 text-xs sm:text-sm m-0 leading-relaxed">
          Search and query verbatim quotes, internal reviews, and blog reports to trace artifacts down to cultural values.
        </p>
      </div>

      {/* Filter and Query controls */}
      <div className="flex flex-col gap-4 bg-black/20 p-4 border border-stone-850 rounded-2xl">
        <div className="flex flex-col lg:flex-row gap-4">
          
          {/* Search box */}
          <div className="flex-1">
            <label className="text-[10px] font-mono text-stone-500 uppercase block mb-1.5">Free-text Search</label>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search quotes, sources, or tags..."
                className="glass-input text-xs sm:text-sm pl-9"
              />
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
            </div>
          </div>

          {/* Category Dropdown */}
          <div className="w-full lg:w-48">
            <label className="text-[10px] font-mono text-stone-500 uppercase block mb-1.5">Iceberg Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="glass-input text-xs sm:text-sm cursor-pointer"
            >
              {categories.map(cat => (
                <option key={cat} value={cat} className="bg-slate-950 text-stone-300">{cat === 'All' ? 'All Categories' : cat}</option>
              ))}
            </select>
          </div>

          {/* Tag Dropdown */}
          <div className="w-full lg:w-48">
            <label className="text-[10px] font-mono text-stone-500 uppercase block mb-1.5">Cultural Tag</label>
            <select
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              className="glass-input text-xs sm:text-sm cursor-pointer"
            >
              {tags.map(tag => (
                <option key={tag} value={tag} className="bg-slate-950 text-stone-300">{tag === 'All' ? 'All Tags' : tag}</option>
              ))}
            </select>
          </div>

          {/* Sentiment Dropdown */}
          <div className="w-full lg:w-48">
            <label className="text-[10px] font-mono text-stone-500 uppercase block mb-1.5">Sentiment</label>
            <select
              value={selectedSentiment}
              onChange={(e) => setSelectedSentiment(e.target.value)}
              className="glass-input text-xs sm:text-sm cursor-pointer"
            >
              {sentiments.map(sent => (
                <option key={sent} value={sent} className="bg-slate-950 text-stone-300">{sent === 'All' ? 'All Sentiments' : sent.toUpperCase()}</option>
              ))}
            </select>
          </div>

        </div>

        {/* Dashboard Stats */}
        <div className="flex flex-wrap items-center justify-between border-t border-stone-850 pt-3.5 mt-1 gap-3">
          <div className="text-xs text-stone-400 font-mono">
            Showing <strong className="text-amber-500">{stats.total}</strong> of <strong className="text-stone-300">{feed.length}</strong> items
          </div>
          <div className="flex gap-4 text-[10px] font-mono">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-emerald-400">{stats.positive} Positive</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              <span className="text-blue-400">{stats.neutral} Neutral</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500" />
              <span className="text-red-400">{stats.critical} Critical</span>
            </span>
          </div>
        </div>
      </div>

      {/* Grid of Feed Cards */}
      {filteredFeed.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-h-[500px] overflow-y-auto pr-2 custom-scroll">
          {filteredFeed.map((item) => (
            <div
              key={item.id}
              className={`bg-black/35 border border-stone-850 hover:border-stone-800 rounded-2xl p-4 transition-all duration-300 flex flex-col justify-between ${
                tensionMode && item.category === 'Tension' 
                  ? 'border-red-500/40 shadow-[0_0_15px_rgba(239,68,68,0.15)] bg-red-950/5' 
                  : ''
              }`}
            >
              <div>
                {/* Meta Header */}
                <div className="flex justify-between items-center gap-2 mb-3">
                  <span className="text-[9px] font-mono bg-white/5 border border-stone-800 px-2 py-0.5 rounded text-stone-400">
                    {item.category.toUpperCase()}
                  </span>
                  <span className="text-[10px] text-stone-500 font-mono">{item.date}</span>
                </div>

                {/* Quote Content */}
                <blockquote className="m-0 pl-3 border-l-2 border-amber-500/40 text-stone-300 text-xs sm:text-sm italic leading-relaxed mb-4">
                  "{item.content}"
                </blockquote>
              </div>

              {/* Source & Tags Footer */}
              <div>
                <div className="text-[11px] font-semibold text-stone-400 leading-snug mb-3">
                  — {item.source}
                </div>

                <div className="flex flex-wrap gap-2 pt-2 border-t border-stone-900">
                  <span className="text-[9px] font-mono bg-stone-900 text-amber-500/80 px-2 py-0.5 rounded border border-amber-500/10">
                    #{item.tag}
                  </span>
                  <span className={`text-[9px] font-mono px-2 py-0.5 rounded border ${getSentimentStyles(item.sentiment)}`}>
                    {item.sentiment}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 border border-dashed border-stone-850 rounded-2xl bg-black/10">
          <svg className="w-10 h-10 text-stone-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-stone-500 font-mono text-xs">No entries match the current filters</span>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
              setSelectedSentiment('All');
              setSelectedTag('All');
            }}
            className="mt-3 text-amber-500 hover:text-amber-400 font-mono text-xs border border-amber-500/25 px-3 py-1 rounded bg-amber-500/5 hover:bg-amber-500/10 transition-all"
          >
            Clear Filters
          </button>
        </div>
      )}

    </div>
  );
}
