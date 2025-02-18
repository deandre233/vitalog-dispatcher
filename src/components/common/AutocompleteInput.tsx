
import { useState, useCallback, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { SearchableItem } from "@/types/common";

interface AutocompleteInputProps<T extends SearchableItem> {
  items: T[];
  onSelect: (item: T) => void;
  getDisplayValue: (item: T) => string;
  placeholder?: string;
  className?: string;
  label?: string;
}

export function AutocompleteInput<T extends SearchableItem>({
  items,
  onSelect,
  getDisplayValue,
  placeholder,
  className,
  label
}: AutocompleteInputProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const filteredItems = items.filter(item =>
    getDisplayValue(item).toLowerCase().includes(inputValue.toLowerCase())
  );

  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        setHighlightedIndex(i => Math.min(i + 1, filteredItems.length - 1));
        break;
      case "ArrowUp":
        event.preventDefault();
        setHighlightedIndex(i => Math.max(i - 1, 0));
        break;
      case "Enter":
        event.preventDefault();
        if (filteredItems[highlightedIndex]) {
          onSelect(filteredItems[highlightedIndex]);
          setIsOpen(false);
          setInputValue("");
        }
        break;
      case "Escape":
        setIsOpen(false);
        break;
    }
  }, [filteredItems, highlightedIndex, isOpen, onSelect]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (listRef.current && !listRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={listRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <Input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={(e) => {
          setInputValue(e.target.value);
          setIsOpen(true);
          setHighlightedIndex(0);
        }}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsOpen(true)}
        placeholder={placeholder}
        className={cn("w-full", className)}
        autoComplete="off"
      />
      {isOpen && filteredItems.length > 0 && (
        <Card className="absolute z-50 w-full mt-1 max-h-60 overflow-auto shadow-lg">
          <div className="p-1">
            {filteredItems.map((item, index) => (
              <div
                key={item.id}
                onClick={() => {
                  onSelect(item);
                  setIsOpen(false);
                  setInputValue("");
                }}
                className={cn(
                  "px-4 py-2 cursor-pointer rounded-sm text-sm",
                  index === highlightedIndex
                    ? "bg-medical-accent text-white"
                    : "hover:bg-gray-100"
                )}
              >
                {getDisplayValue(item)}
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
