import React, { useState } from 'react';
import { Bot, Sparkles, Loader2, Plus, Code, CheckCircle, ArrowRight } from 'lucide-react';
import { aiService } from '../services/api';
import { useNavigate } from 'react-router-dom';

const AIGeneratorPage = () => {
  const navigate = useNavigate();
  const [topic, setTopic] = useState('Arrays');
  const [difficulty, setDifficulty] = useState('Easy');
  const [language, setLanguage] = useState('python');
  const [concept, setConcept] = useState('Two Pointers');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [generatedProblem, setGeneratedProblem] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const TOPICS = [
    'Arrays', 'Strings', 'Hash Maps', 'Linked Lists', 'Stacks',
    'Queues', 'Trees', 'Graphs', 'Recursion', 'Sorting',
    'Searching', 'Dynamic Programming', 'Greedy Algorithms'
  ];

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSaveSuccess(false);
    try {
      const res = await aiService.generateProblem({
        topic,
        difficulty,
        language,
        concept
      });
      setGeneratedProblem(res.generated_problem);
    } catch (err) {
      alert('Failed to generate AI problem. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToBank = async () => {
    if (!generatedProblem) return;
    setSaving(true);
    try {
      const res = await aiService.generateProblem({
        topic,
        difficulty,
        language,
        concept,
        save_to_db: true
      });
      setSaveSuccess(true);
      setTimeout(() => {
        if (res.problem_id) {
          navigate(`/problems/${res.problem_id}`);
        }
      }, 1200);
    } catch (err) {
      alert('Error saving problem to database.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-10">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
              <span className="p-2 bg-indigo-600/20 text-indigo-400 rounded-xl border border-indigo-500/30">
                <Bot className="w-8 h-8" />
              </span>
              AI Question Generator
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Create custom coding challenges powered by AI tailored to specific topics and difficulty levels.
            </p>
          </div>
        </div>

        {/* Generator Form & Live Preview Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Form Controls */}
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
            <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <Sparkles className="w-4 h-4 text-indigo-400" /> Generator Settings
            </h2>

            <form onSubmit={handleGenerate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Topic Category</label>
                <select
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                >
                  {TOPICS.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Difficulty</label>
                <div className="grid grid-cols-3 gap-2">
                  {['Easy', 'Medium', 'Hard'].map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setDifficulty(d)}
                      className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                        difficulty === d
                          ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-600/30'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Target Language</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="python">Python</option>
                  <option value="javascript">JavaScript</option>
                  <option value="java">Java</option>
                  <option value="cpp">C++</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Concept Focus</label>
                <input
                  type="text"
                  placeholder="e.g. Sliding Window, Prefix Sum, BFS"
                  value={concept}
                  onChange={(e) => setConcept(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                {loading ? 'Generating Problem...' : 'Generate AI Problem'}
              </button>
            </form>
          </div>

          {/* Right Live Preview */}
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6 flex flex-col justify-between">
            {generatedProblem ? (
              <div className="space-y-5">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs bg-indigo-500/20 text-indigo-300 font-semibold px-2.5 py-0.5 rounded-full border border-indigo-500/30">
                        {generatedProblem.category}
                      </span>
                      <span className="text-xs bg-emerald-500/20 text-emerald-300 font-semibold px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                        {generatedProblem.difficulty}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-white mt-1">{generatedProblem.title}</h3>
                  </div>
                  <button
                    onClick={handleSaveToBank}
                    disabled={saving || saveSuccess}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center gap-2 transition-all"
                  >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saveSuccess ? <CheckCircle className="w-4 h-4 text-white" /> : <Plus className="w-4 h-4" />}
                    {saveSuccess ? 'Saved to Practice Bank!' : 'Save to Practice Bank'}
                  </button>
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Problem Description</h4>
                  <p className="text-sm text-slate-300 leading-relaxed bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                    {generatedProblem.description}
                  </p>
                </div>

                {generatedProblem.examples && generatedProblem.examples.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Sample Example</h4>
                    <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-xs font-mono text-slate-300 space-y-1">
                      <div><span className="text-indigo-400 font-bold">Input:</span> {generatedProblem.examples[0].input}</div>
                      <div><span className="text-emerald-400 font-bold">Output:</span> {generatedProblem.examples[0].output}</div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-center text-slate-500 space-y-3">
                <Code className="w-12 h-12 text-slate-700" />
                <p className="text-sm font-medium">Select your preferences on the left and click 'Generate AI Problem' to see a live preview here.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIGeneratorPage;
