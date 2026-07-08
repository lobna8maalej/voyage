import { useState } from "react";
import api from "../../pages/admin/axios";

const Header = () => {
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState<any[]>([]);

  const handleSearch = async () => {
    if (!keyword.trim()) return;

    try {
      const res = await api.get(
        `/services/search?keyword=${keyword}`
      );

      setResults(res.data || []);
    } catch (err) {
      console.log("SEARCH ERROR:", err);
      setResults([]);
    }
  };

  return (
    <div className="bg-white shadow p-4">

      {/* SEARCH BAR */}
      <div className="flex gap-2">
        <input
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Rechercher hotel, spa, offre..."
          className="border p-2 rounded w-1/2"
        />

        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Search
        </button>
      </div>

      {/* RESULTS */}
      {results.length > 0 && (
        <div className="mt-4 bg-gray-50 p-3 rounded">

          {results.map((item) => (
            <div
              key={item._id}
              className="p-2 border-b flex justify-between"
            >
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-gray-500">
                  {item.city} - {item.country}
                </p>
              </div>

              <span className="text-xs bg-gray-200 px-2 py-1 rounded">
                {item.type}
              </span>
            </div>
          ))}

        </div>
      )}
    </div>
  );
};

export default Header;