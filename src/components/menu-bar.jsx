import React, { useState, createContext } from "react";
import vocabularyIndex from "../assets/vocabulary-index.json";

export const ConfigContext = createContext({ enToFr: true, writingMode: false, flashcardMode: false });

function MenuBar({ onCategorySelect, config, setConfig }) {
  const [open, setOpen] = useState(false);
  const [configOpen, setConfigOpen] = useState(false);

  // Close config dropdown when unfocused, but not when clicking inside dropdown or its content
  const configButtonRef = React.useRef();
  const configDropdownRef = React.useRef();
  React.useEffect(() => {
    function handleClickOutside(event) {
      if (
        configOpen &&
        configButtonRef.current &&
        configDropdownRef.current &&
        !configButtonRef.current.contains(event.target) &&
        !configDropdownRef.current.contains(event.target)
      ) {
        setConfigOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [configOpen]);

  // Helper to render sub-categories
  const renderSubCategories = (subCategories, parentNames = []) => {
    if (!subCategories || subCategories.length === 0) return null;
    return (
      <div className="ml-4">
        {subCategories.map((sub, idx) => {
          const fullPath = [...(parentNames.map((i) => `${i}/`)), sub.name_en];
          return (
            <div key={sub.name_en + idx} className="py-1">
              <button
                className="text-left w-full px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-800 dark:text-gray-200"
                onClick={() => {
                  onCategorySelect(fullPath);
                  setOpen(false);
                }}
              >
                {sub.name_en}
              </button>
              {renderSubCategories(sub["sub-category"], fullPath)}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <nav className="w-full bg-gray-100 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 mb-4">
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
        <div className="text-xl font-bold text-gray-900 dark:text-white">French Vocab</div>
        <div className="flex gap-4 items-center">
          {/* Main Menu Dropdown - now dynamic from vocabulary-index.json */}
          <div className="relative">
            <button
              onClick={() => setOpen(!open)}
              className="cursor-pointer px-4 py-2 bg-white dark:bg-gray-800 rounded shadow hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none"
            >
              Menu
              <svg className="inline ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
            </button>
            {open && (
              <div className="absolute -left-25 mt-2 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded shadow-lg z-10 p-2 max-h-96 overflow-y-auto">
                {vocabularyIndex.category.map((cat, idx) => {
                  const fullPath = [cat.name_en];
                  return (
                    <div key={cat.name_en + idx} className="mb-1">
                      <button
                        className="cursor-pointer text-left w-full px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-800 dark:text-gray-200 font-medium"
                        onClick={() => {
                          onCategorySelect(fullPath);
                          setOpen(false);
                        }}
                      >
                        {cat.name_en}
                      </button>
                      {renderSubCategories(cat["sub-category"], fullPath)}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          {/* Config Dropdown */}
          <div className="relative">
            <button
              ref={configButtonRef}
              onClick={() => setConfigOpen(!configOpen)}
              className="px-4 py-2 bg-white dark:bg-gray-800 rounded shadow hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none"
            >
              Config
              <svg className="inline ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
            </button>
            {configOpen && (
              <div ref={configDropdownRef} className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded shadow-lg z-10 p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-800 dark:text-gray-200">En -&gt; Fr</span>
                  <label className="inline-flex relative items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={config.enToFr} onChange={() => setConfig(c => ({ ...c, enToFr: !c.enToFr }))} />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:bg-blue-600 transition-all"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-800 dark:text-gray-200">Writing mode</span>
                  <label className="inline-flex relative items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={config.writingMode} onChange={() => setConfig(c => ({ ...c, writingMode: !c.writingMode }))} />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:bg-blue-600 transition-all"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-800 dark:text-gray-200">Flashcard mode</span>
                  <label className="inline-flex relative items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={config.flashcardMode} onChange={() => setConfig(c => ({ ...c, flashcardMode: !c.flashcardMode }))} />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:bg-blue-600 transition-all"></div>
                  </label>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default MenuBar;
