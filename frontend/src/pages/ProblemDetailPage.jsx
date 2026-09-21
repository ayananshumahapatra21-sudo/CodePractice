import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Play, Send, ChevronLeft, CheckCircle2, RotateCcw, AlertCircle, Sparkles } from 'lucide-react';
import MonacoCodeEditor from '../components/MonacoCodeEditor';
import TestResultsPanel from '../components/TestResultsPanel';
import { problemService } from '../services/api';

export default function ProblemDetailPage() {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState('python');
  const [editorTheme, setEditorTheme] = useState('vs-dark');
  const [code, setCode] = useState('');
  
  // Execution & Test states
  const [resultsData, setResultsData] = useState(null);
  const [executing, setExecuting] = useState(false);
  const [isSubmission, setIsSubmission] = useState(false);

  useEffect(() => {
    const fetchProblem = async () => {
      setLoading(true);
      try {
        const data = await problemService.getProblemDetail(id);
        setProblem(data);
        // Set starter code for default language
        const defaultCode = data.starter_code?.[language] || '# Write your solution here\n';
        setCode(defaultCode);
      } catch (err) {
        console.error('Failed to load problem:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProblem();
  }, [id]);

  const handleLanguageChange = (newLang) => {
    setLanguage(newLang);
    if (problem && problem.starter_code && problem.starter_code[newLang]) {
      setCode(problem.starter_code[newLang]);
    }
  };

  const handleResetCode = () => {
    if (problem && problem.starter_code && problem.starter_code[language]) {
      setCode(problem.starter_code[language]);
    }
  };

  const handleRunCode = async () => {
    setExecuting(true);
    setIsSubmission(false);
    try {
      const res = await problemService.runCode({
        problem_id: Number(id),
        language,
        code
      });
      setResultsData(res);
    } catch (err) {
      console.error('Error running code:', err);
      setResultsData({
        status: 'Runtime Error',
        passed_count: 0,
        total_count: 1,
        results: [{ status: 'Runtime Error', error: err.response?.data?.error || err.message }]
      });
    } finally {
      setExecuting(false);
    }
  };

  const handleSubmitCode = async () => {
    setExecuting(true);
    setIsSubmission(true);
    try {
      const res = await problemService.submitCode({
        problem_id: Number(id),
        language,
        code
      });
      setResultsData(res);
      // Update problem solved status if accepted
      if (res.status === 'Accepted' && problem) {
        setProblem({ ...problem, solved_status: 'Solved' });
      }
    } catch (err) {
      console.error('Error submitting code:', err);
      setResultsData({
        status: 'Runtime Error',
        passed_count: 0,
        total_count: 1,
        results: [{ status: 'Runtime Error', error: err.response?.data?.error || err.message }]
      });
    } finally {
      setExecuting(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen bg-[#0a0c10] flex items-center justify-center text-gray-400">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
          <span className="text-sm font-semibold">Loading Problem Workspace...</span>
        </div>
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-2xl font-bold text-white">Problem Not Found</h2>
        <p className="text-gray-400 text-sm">The requested coding problem could not be found or may have been removed.</p>
        <Link to="/problems" className="inline-block px-5 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-sm">
          Return to Problems List
        </Link>
      </div>
    );
  }

  const getDifficultyBadge = (diff) => {
    switch (diff) {
      case 'Easy': return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
      case 'Medium': return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
      case 'Hard': return 'bg-rose-500/15 text-rose-400 border-rose-500/30';
      default: return 'bg-gray-500/15 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="h-[calc(100vh-65px)] bg-[#0a0c10] flex flex-col overflow-hidden">
      {/* Workspace Top Action Bar */}
      <div className="bg-[#12151e] border-b border-[#1e2433] px-4 py-2.5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to="/problems"
            className="p-1.5 rounded-lg bg-[#191e2b] text-gray-400 hover:text-white hover:bg-[#22293b] transition-all"
            title="Back to Problems"
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <span className="font-mono text-sm font-bold text-gray-400">#{problem.problem_number}</span>
          <h1 className="text-base font-bold text-white truncate max-w-xs sm:max-w-md">{problem.title}</h1>
          
          <span className={`px-2.5 py-0.5 rounded-lg text-xs font-extrabold border ${getDifficultyBadge(problem.difficulty)}`}>
            {problem.difficulty}
          </span>

          {problem.solved_status === 'Solved' && (
            <span className="flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-lg border border-emerald-500/20">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Solved</span>
            </span>
          )}
        </div>

        {/* Action Buttons: Run Code & Submit */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleRunCode}
            disabled={executing}
            className="px-4 py-1.5 rounded-xl bg-[#1c2233] hover:bg-[#252e45] text-gray-200 border border-[#2d3854] font-bold text-xs flex items-center gap-2 transition-all disabled:opacity-50"
          >
            <Play className="w-3.5 h-3.5 text-blue-400 fill-blue-400" />
            <span>Run Code</span>
          </button>

          <button
            onClick={handleSubmitCode}
            disabled={executing}
            className="px-5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 flex items-center gap-2 transition-all disabled:opacity-50 hover:scale-[1.02]"
          >
            <Send className="w-3.5 h-3.5 fill-white" />
            <span>Submit</span>
          </button>
        </div>
      </div>

      {/* Split Workspace Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        
        {/* Left Pane: Problem Specs & Description */}
        <div className="lg:col-span-5 bg-[#0f121a] border-r border-[#1e2433] flex flex-col h-full overflow-y-auto p-6 space-y-6">
          
          {/* Header Specs */}
          <div className="space-y-2 pb-4 border-b border-[#1b202e]">
            <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">{problem.category}</span>
            <h2 className="text-2xl font-extrabold text-white">{problem.title}</h2>
          </div>

          {/* Problem Statement */}
          <div className="text-gray-300 text-sm leading-relaxed whitespace-pre-line font-sans space-y-3">
            {problem.description}
          </div>

          {/* Examples */}
          {problem.examples && problem.examples.length > 0 && (
            <div className="space-y-4 pt-2">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Examples</h3>
              {problem.examples.map((ex, idx) => (
                <div key={idx} className="bg-[#141824] border border-[#202738] rounded-xl p-4 space-y-2 font-mono text-xs">
                  <div className="text-gray-400">
                    <strong className="text-blue-400 font-sans">Example {idx + 1}:</strong>
                  </div>
                  <div>
                    <span className="text-gray-500">Input: </span>
                    <span className="text-gray-200">{ex.input}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Output: </span>
                    <span className="text-emerald-400">{ex.output}</span>
                  </div>
                  {ex.explanation && (
                    <div className="text-gray-400 font-sans text-xs pt-1 border-t border-[#1e2536]">
                      <strong className="text-gray-300">Explanation: </strong>{ex.explanation}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Constraints */}
          {problem.constraints && problem.constraints.length > 0 && (
            <div className="space-y-2 pt-2 pb-6">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Constraints</h3>
              <ul className="list-disc list-inside text-xs font-mono text-gray-400 space-y-1">
                {problem.constraints.map((c, idx) => (
                  <li key={idx} className="text-gray-300">{c}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Right Pane: Code Editor + Test Panel */}
        <div className="lg:col-span-7 flex flex-col h-full bg-[#0a0c10] overflow-hidden">
          {/* Top Half: Monaco Code Editor */}
          <div className="flex-1 min-h-[300px] p-2">
            <MonacoCodeEditor
              code={code}
              onChange={setCode}
              language={language}
              onLanguageChange={handleLanguageChange}
              onReset={handleResetCode}
              theme={editorTheme}
              setTheme={setEditorTheme}
            />
          </div>

          {/* Bottom Half: Test Results Output Panel */}
          <div className="h-[260px] min-h-[220px]">
            <TestResultsPanel
              resultsData={resultsData}
              loading={executing}
              isSubmission={isSubmission}
            />
          </div>
        </div>

      </div>
    </div>
  );
}
