"use client";

import * as React from "react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    setMounted(true);
    
    // Close dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!mounted) {
    return <div className="w-9 h-9" />; // Placeholder
  }

  const getIcon = (t: string) => {
    if (t === 'system') return 'brightness_auto';
    if (t === 'dark') return 'dark_mode';
    return 'light_mode';
  };

  const getLabel = (t: string) => {
    if (t === 'system') return 'System';
    if (t === 'dark') return 'Dark';
    return 'Light';
  };

  const options = ['light', 'dark', 'system'];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full hover:bg-surface-container transition-colors flex items-center justify-center text-on-surface-variant"
        title="Change theme"
      >
        <span className="material-symbols-outlined text-xl">{getIcon(theme || 'system')}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-36 bg-surface border border-outline rounded-lg shadow-panel z-[100] overflow-hidden animate-slide-up origin-top-right">
          <div className="py-1">
            {options.map((opt) => (
              <button
                key={opt}
                onClick={() => {
                  setTheme(opt);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-2 text-sm flex items-center gap-3 transition-colors ${
                  theme === opt 
                    ? "bg-primary/10 text-primary" 
                    : "text-on-surface hover:bg-surface-container"
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">
                  {getIcon(opt)}
                </span>
                {getLabel(opt)}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
