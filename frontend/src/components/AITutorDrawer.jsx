import React, { useState } from 'react';
import { Bot, Lightbulb, Code2, Bug, BookOpen, ChevronRight, Loader2, Sparkles } from 'lucide-react';
import { aiService } from '../services/api';

const AITutorDrawer = ({ problem, userCode, language, onClose }) => {
  const [activeTab, setActiveTab] = useState('hints');
  const [hintLevel, setHintLevel] = useState(1);
  const [hintContent, setHintContent] = useState('');
  const [explainContent, setExplainContent] = useState('');
  const [debugContent, setDebugContent] = useState('');
  const [learnContent, setLearnContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [learnQuestion, setLearnQuestion] = useState('');

  const fetchHint = async (level) => {
    setLoading(true);
    try {
      const res = await aiService.getHint(problem.id, level);
      setHintContent(res.hint);
      setHintLevel(level);
    } catch (err) {
      setHintContent('Could not retrieve hint. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchExplanation = async () => {
    setLoading(true);
    try {
      const res = await aiService.explainCode(problem.id, userCode, language);
      setExplainContent(res.explanation);
    } catch (err) {
      setExplainContent('Failed to fetch code explanation.');
    } finally {
      setLoading(false);
    }
  };

  const fetchDebugging = async () => {
    setLoading(true);
    try {
      const res = await aiService.debugCode(problem.id, userCode, '', language);
      setDebugContent(res.debug_analysis);
    } catch (err) {
      setDebugContent('Failed to execute AI debugging analysis.');
    } finally {
      setLoading(false);
    }
  };

  const fetchConcept = async () => {
    setLoading(true);
    try {
      const res = await aiService.teachConcept(problem.category, learnQuestion, problem.title);
      setLearnContent(res.concept_lesson);
    } catch (err) {
      setLearnContent('Failed to load concept lesson.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 border-l border-slate-800 h-full flex flex-col w-full text-slate-100 shadow-2xl">
      {/* Header */}
      <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-indigo-600/20 text-indigo-400 rounded-lg border border-indigo-500/30">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-white text-base flex items-center gap-2">
              AI Learning Assistant
              <span className="text-xs bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-500/30 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Active
              </span>
            </h3>
            <p className="text-xs text-slate-400">Personalized guidance & real-time feedback</p>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-slate-400 hover:text-white text-xl font-bold px-2">
            ×
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 bg-slate-900/80 px-2 gap-1 overflow-x-auto text-xs font-medium">
        <button
          onClick={() => { setActiveTab('hints'); if (!hintContent) fetchHint(1); }}
          className={`flex items-center gap-1.5 px-3 py-2.5 border-b-2 font-medium transition-all ${
            activeTab === 'hints'
              ? 'border-indigo-500 text-indigo-400 bg-indigo-500/10'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Lightbulb className="w-3.5 h-3.5" /> Hints
        </button>
        <button
          onClick={() => { setActiveTab('explain'); if (!explainContent) fetchExplanation(); }}
          className={`flex items-center gap-1.5 px-3 py-2.5 border-b-2 font-medium transition-all ${
            activeTab === 'explain'
              ? 'border-indigo-500 text-indigo-400 bg-indigo-500/10'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Code2 className="w-3.5 h-3.5" /> Explain Code
        </button>
        <button
          onClick={() => { setActiveTab('debug'); if (!debugContent) fetchDebugging(); }}
          className={`flex items-center gap-1.5 px-3 py-2.5 border-b-2 font-medium transition-all ${
            activeTab === 'debug'
              ? 'border-indigo-500 text-indigo-400 bg-indigo-500/10'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Bug className="w-3.5 h-3.5" /> Debug
        </button>
        <button
          onClick={() => { setActiveTab('learn'); if (!learnContent) fetchConcept(); }}
          className={`flex items-center gap-1.5 px-3 py-2.5 border-b-2 font-medium transition-all ${
            activeTab === 'learn'
              ? 'border-indigo-500 text-indigo-400 bg-indigo-500/10'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" /> Concept Mode
        </button>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-48 gap-3 text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
            <p className="text-sm font-medium">AI Tutor is thinking...</p>
          </div>
        ) : (
          <>
            {/* HINTS TAB */}
            {activeTab === 'hints' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Progressive Hints:</span>
                  <div className="flex gap-2">
                    {[1, 2, 3].map((lvl) => (
                      <button
                        key={lvl}
                        onClick={() => fetchHint(lvl)}
                        className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                          hintLevel === lvl
                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                            : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                        }`}
                      >
                        Hint {lvl}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-300 text-sm leading-relaxed whitespace-pre-line">
                  {hintContent || "Click a hint level above to receive progressive guidance without spoiling the solution!"}
                </div>
              </div>
            )}

            {/* EXPLAIN CODE TAB */}
            {activeTab === 'explain' && (
              <div className="space-y-4">
                <button
                  onClick={fetchExplanation}
                  className="w-full py-2 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 rounded-lg text-xs font-semibold flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" /> Re-analyze Code
                </button>
                <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-300 text-sm leading-relaxed whitespace-pre-line font-mono">
                  {explainContent || "Click 'Explain Code' to generate a full breakdown of your current solution, algorithm logic, and time/space complexity."}
                </div>
              </div>
            )}

            {/* DEBUG TAB */}
            {activeTab === 'debug' && (
              <div className="space-y-4">
                <button
                  onClick={fetchDebugging}
                  className="w-full py-2 bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 rounded-lg text-xs font-semibold flex items-center justify-center gap-2"
                >
                  <Bug className="w-4 h-4" /> Run AI Debugger
                </button>
                <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-300 text-sm leading-relaxed whitespace-pre-line">
                  {debugContent || "If your code fails test cases or returns unexpected results, click 'Run AI Debugger' to inspect potential syntax, edge case, or logic errors."}
                </div>
              </div>
            )}

            {/* CONCEPT MODE TAB */}
            {activeTab === 'learn' && (
              <div className="space-y-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder={`Ask a question about ${problem.category}...`}
                    value={learnQuestion}
                    onChange={(e) => setLearnQuestion(e.target.value)}
                    className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    onClick={fetchConcept}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-500"
                  >
                    Teach Me
                  </button>
                </div>
                <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-300 text-sm leading-relaxed whitespace-pre-line">
                  {learnContent || `Learn the core principles of ${problem.category} with interactive examples and explanations.`}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AITutorDrawer;
