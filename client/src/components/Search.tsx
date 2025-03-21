
import { useState, useEffect } from 'react';
import { Search as SearchIcon } from 'lucide-react';
import { Button } from './ui/button';

export default function Search() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);

  useEffect(() => {
    if (query.length > 2) {
      // Simulate search suggestions - replace with actual API call
      const mockSuggestions = [
        'Custom Development',
        'Web Applications',
        'Mobile Apps',
        'AI Solutions'
      ].filter(item => item.toLowerCase().includes(query.toLowerCase()));
      setSuggestions(mockSuggestions);
    } else {
      setSuggestions([]);
    }
  }, [query]);

  return (
    <div className="relative w-full max-w-xl mx-auto">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search services..."
          className="w-full px-4 py-2 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <SearchIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
      </div>
      {suggestions.length > 0 && (
        <div className="absolute w-full mt-1 bg-white border rounded-lg shadow-lg z-10">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              className="w-full px-4 py-2 text-left hover:bg-gray-100"
              onClick={() => {
                setQuery(suggestion);
                setSuggestions([]);
              }}
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
