import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { Sun, Moon, RotateCcw, Code, Check } from 'lucide-react';

export default function MonacoCodeEditor({
  code,
  onChange,
  language,
  onLanguageChange,
  onReset,
  theme,
  setTheme
}) {
  const [editorLoaded, setEditorLoaded] = useState(false);

  const getMonacoLanguage = (lang) => {
    switch (lang) {
      case 'python': return 'python';
      case 'javascript': return 'javascript';
      case 'java': return 'java';
      case 'cpp': return 'cpp';
      default: return 'python';
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0d1117] rounded-xl border border-[#1e2433] overflow-hidden shadow-xl">
      {/* Editor Header Toolbar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#151926] border-b border-[#1e2433]">
        {/* Language Selector */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            <Code className="w-3.5 h-3.5 text-blue-400" />
            <span>Language</span>
          </div>
          <select
            value={language}
            onChange={(e) => onLanguageChange(e.target.value)}
            className="bg-[#1e2538] text-gray-200 text-xs font-semibold px-3 py-1.5 rounded-lg border border-[#2b354d] focus:outline-none focus:border-blue-500 transition-colors"
          >
            <option value="python">Python 3</option>
            <option value="javascript">JavaScript (ES6)</option>
            <option value="java">Java 17</option>
            <option value="cpp">C++ (GCC)</option>
          </select>
        </div>

        {/* Toolbar Controls */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(theme === 'vs-dark' ? 'light' : 'vs-dark')}
            className="flex items-center gap-1.5 text-xs font-medium text-gray-400 hover:text-white bg-[#1e2538] px-2.5 py-1.5 rounded-lg border border-[#2b354d] transition-all"
            title="Toggle Editor Theme"
          >
            {theme === 'vs-dark' ? (
              <>
                <Moon className="w-3.5 h-3.5 text-indigo-400" />
                <span>Dark</span>
              </>
            ) : (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span>Light</span>
              </>
            )}
          </button>

          {/* Reset Code */}
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 text-xs font-medium text-gray-400 hover:text-red-400 bg-[#1e2538] hover:bg-red-500/10 px-2.5 py-1.5 rounded-lg border border-[#2b354d] hover:border-red-500/30 transition-all"
            title="Reset Starter Code"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Editor Main Canvas */}
      <div className="flex-1 relative min-h-[350px]">
        <Editor
          height="100%"
          language={getMonacoLanguage(language)}
          theme={theme}
          value={code}
          onChange={(val) => onChange(val || '')}
          onMount={() => setEditorLoaded(true)}
          options={{
            fontSize: 14,
            fontFamily: "'Fira Code', 'Courier New', monospace",
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            lineNumbers: 'on',
            roundedSelection: true,
            automaticLayout: true,
            padding: { top: 12, bottom: 12 },
            tabSize: 4,
            insertSpaces: true,
            formatOnType: true,
            smoothScrolling: true,
            cursorBlinking: 'smooth',
            cursorSmoothCaretAnimation: 'on'
          }}
          loading={
            <div className="absolute inset-0 flex items-center justify-center bg-[#0d1117] text-gray-400 text-sm font-medium">
              Loading Monaco Code Editor...
            </div>
          }
        />
      </div>
    </div>
  );
}
