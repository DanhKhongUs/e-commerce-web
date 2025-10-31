import { useState, useRef, useEffect } from "react";
import { Product } from "../../types";
import { Products } from "../../data/product";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleXmark,
  faSearch,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";

export default function Search() {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (search.trim()) {
      setLoading(true);
      debounceRef.current = setTimeout(() => {
        const filtered = Products.filter((item) =>
          item.name.toLowerCase().includes(search.toLowerCase())
        );
        setResults(filtered);
        setShowSuggestions(true);
        setLoading(false);
      }, 400);
    } else {
      setResults([]);
      setShowSuggestions(false);
      setLoading(false);
    }

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [search]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleClear = () => {
    setSearch("");
    setResults([]);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  return (
    <div ref={wrapperRef} className="relative w-full xl:w-[500px]">
      {/* Input */}
      <div className="relative flex w-full max-w-full rounded-full border bg-white shadow-md overflow-hidden">
        <input
          ref={inputRef}
          value={search}
          onChange={(e) => {
            const value = e.target.value;
            if (!value.startsWith(" ")) setSearch(value);
          }}
          className="flex-1 px-6 py-2 text-sm sm:text-base bg-transparent text-[#333] placeholder-gray-500 focus:outline-none"
          placeholder="Search..."
        />

        {!!search && !loading && (
          <button
            className="absolute right-16 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            onClick={handleClear}
          >
            <FontAwesomeIcon icon={faCircleXmark} />
          </button>
        )}

        {loading && (
          <FontAwesomeIcon
            icon={faSpinner}
            className="absolute right-16 top-1/2 -translate-y-1/2 text-gray-400 animate-spin"
          />
        )}

        <button className="w-12 sm:w-14 text-lg sm:text-xl border-l-1 bg-gray-100 hover:bg-gray-50 text-gray-900 hover:text-gray-700 flex items-center justify-center transition cursor-pointer">
          <FontAwesomeIcon icon={faSearch} />
        </button>
      </div>

      {/* Dropdown */}
      {showSuggestions && (
        <div className="absolute left-0 mt-2 w-full bg-white rounded-lg shadow-xl border border-gray-200 max-h-96 overflow-auto z-50">
          {results.length > 0 ? (
            results.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 px-4 py-2 border-b hover:bg-gray-100 cursor-pointer"
              >
                <img
                  src={item.img}
                  alt={item.name}
                  className="w-16 h-16 rounded object-cover"
                />
                <div className="flex flex-col">
                  <span className="font-semibold text-sm">{item.name}</span>
                  <span className="text-sm text-gray-600">
                    Price:{" "}
                    <span className="text-yellow-600 font-semibold">
                      {item.price.toLocaleString("vi-VN")}₫
                    </span>
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="w-full px-6 py-4 text-gray-600 text-center font-medium">
              Không tìm thấy sản phẩm
            </div>
          )}
        </div>
      )}
    </div>
  );
}
