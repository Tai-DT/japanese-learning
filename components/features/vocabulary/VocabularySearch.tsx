// components/features/vocabulary/VocabularySearch.tsx
"use client";

import { useState } from "react";

interface VocabularySearchProps {
  onSearch: (term: string, level: string) => void;
}

export default function VocabularySearch({ onSearch }: VocabularySearchProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [level, setLevel] = useState("all");
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm, level);
  };
  
  return (
    <div className="bg-gray-50 p-6 rounded-lg">
      <form onSubmit={handleSearch} className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Tìm kiếm từ vựng..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
          <div className="md:w-1/4">
            <label htmlFor="level-select" className="sr-only">Cấp độ</label>
            <select
              id="level-select"
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            >
              <option value="all">Tất cả cấp độ</option>
              <option value="N5">N5 (Cơ bản)</option>
              <option value="N4">N4</option>
              <option value="N3">N3</option>
              <option value="N2">N2</option>
              <option value="N1">N1 (Nâng cao)</option>
            </select>
          </div>
          <button
            type="submit"
            className="md:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Tìm Kiếm
          </button>
        </div>
      </form>
    </div>
  );
}
