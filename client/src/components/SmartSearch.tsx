
import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';

interface SearchResult {
  id: string;
  title: string;
  category: string;
  price: number;
}

export default function SmartSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  
  useEffect(() => {
    if (query.length >= 2) {
      // Get real-time suggestions
      fetch(`/api/search/suggest?q=${encodeURIComponent(query)}`)
        .then(res => res.json())
        .then(data => setSuggestions(data.suggestions))
        .catch(console.error);
    } else {
      setSuggestions([]);
    }
  }, [query]);

  const handleSearch = async () => {
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const data = await response.json();
      setResults(data.results);
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="relative">
        <Input
          type="search"
          placeholder="Rechercher des produits..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pr-10"
        />
        <Button
          size="icon"
          variant="ghost"
          className="absolute right-0 top-0"
          onClick={handleSearch}
        >
          <Search className="h-4 w-4" />
        </Button>
        
        {suggestions.length > 0 && (
          <div className="absolute w-full bg-white shadow-lg rounded-b-lg mt-1 z-50">
            {suggestions.map((suggestion, i) => (
              <button
                key={i}
                className="w-full text-left px-4 py-2 hover:bg-gray-100"
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

      <div className="mt-4 space-y-4">
        {results.map((result) => (
          <div
            key={result.id}
            className="p-4 border rounded-lg hover:shadow-md transition-shadow"
          >
            <h3 className="font-semibold">{result.title}</h3>
            <p className="text-sm text-gray-600">{result.category}</p>
            <p className="font-medium">{result.price}€</p>
          </div>
        ))}
      </div>
    </div>
  );
}
