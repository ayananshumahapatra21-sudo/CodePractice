import React, { useState } from 'react';
import { CheckCircle2, XCircle, AlertTriangle, Clock, Code2 } from 'lucide-react';

export default function TestResultsPanel({ resultsData, loading, isSubmission }) {
  const [activeTab, setActiveTab] = useState(0);

  if (loading) {
    return (
      <div className="h-full bg-[#0d1117] p-6 flex flex-col items-center justify-center text-gray-400 gap-3">
        <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
        <span className="text-sm font-semibold text-gray-300">Evaluating your solution against test cases...</span>
      </div>
    );
  }

  if (!resultsData) {
    return (
      <div className="h-full bg-[#0d1117] p-6 flex flex-col items-center justify-center text-gray-500 gap-2 border-t border-[#1e2433]">
        <Code2 className="w-8 h-8 text-gray-600 mb-1" />
        <span className="text-sm font-medium">Click "Run Code" to test sample cases or "Submit" for full evaluation.</span>
      </div>
    );
  }

  const { status, passed_count, total_count, execution_time, results } = resultsData;

  const getStatusBadge = (st) => {
    switch (st) {
      case 'Accepted':
      case 'Passed':
        return {
          bg: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400',
          icon: CheckCircle2,
          text: st === 'Accepted' ? 'Accepted' : 'All Test Cases Passed'
        };
      case 'Wrong Answer':
      case 'Failed':
        return {
          bg: 'bg-rose-500/15 border-rose-500/30 text-rose-400',
          icon: XCircle,
          text: st === 'Wrong Answer' ? 'Wrong Answer' : 'Test Case Failed'
        };
      case 'Time Limit Exceeded':
        return {
          bg: 'bg-amber-500/15 border-amber-500/30 text-amber-400',
          icon: Clock,
          text: 'Time Limit Exceeded'
        };
      default:
        return {
          bg: 'bg-rose-500/15 border-rose-500/30 text-rose-400',
          icon: AlertTriangle,
          text: st || 'Runtime Error'
        };
    }
  };

  const badge = getStatusBadge(status);
  const BadgeIcon = badge.icon;
  const currentCase = results?.[activeTab] || results?.[0];

  return (
    <div className="flex flex-col h-full bg-[#0d1117] border-t border-[#1e2433] overflow-hidden">
      {/* Result Status Banner */}
      <div className="px-5 py-3 bg-[#151926] border-b border-[#1e2433] flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className={`px-3 py-1 rounded-xl border flex items-center gap-2 text-xs font-extrabold uppercase tracking-wide ${badge.bg}`}>
            <BadgeIcon className="w-4 h-4" />
            <span>{badge.text}</span>
          </div>
          <span className="text-xs font-semibold text-gray-400">
            Passed: <strong className="text-white">{passed_count}</strong> / {total_count}
          </span>
        </div>

        {execution_time !== undefined && (
          <div className="flex items-center gap-1.5 text-xs font-mono text-gray-400">
            <Clock className="w-3.5 h-3.5 text-blue-400" />
            <span>Runtime: <strong className="text-gray-200">{execution_time} ms</strong></span>
          </div>
        )}
      </div>

      {/* Test Case Selector Tabs */}
      {results && results.length > 0 && (
        <div className="flex items-center gap-1.5 px-4 pt-2.5 bg-[#10141f] border-b border-[#1c2230] overflow-x-auto">
          {results.map((res, idx) => {
            const isPassed = res.status === 'Passed';
            const isActive = activeTab === idx;
            return (
              <button
                key={idx}
                onClick={() => setActiveTab(idx)}
                className={`px-3 py-1.5 rounded-t-lg text-xs font-semibold flex items-center gap-1.5 border-t border-x transition-all ${
                  isActive
                    ? 'bg-[#0d1117] border-[#252d42] text-white border-b-0'
                    : 'bg-[#151a28] border-transparent text-gray-400 hover:text-gray-200'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${isPassed ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                <span>Case {idx + 1}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Case Details */}
      {currentCase ? (
        <div className="flex-1 p-4 overflow-y-auto font-mono text-xs space-y-3 bg-[#0d1117]">
          {/* Error Message if any */}
          {currentCase.error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 font-sans text-xs">
              <strong className="font-bold text-rose-400 block mb-1">Error Trace:</strong>
              <pre className="whitespace-pre-wrap font-mono">{currentCase.error}</pre>
            </div>
          )}

          {/* Test Case Input */}
          <div>
            <span className="text-gray-400 font-sans text-[11px] font-bold uppercase tracking-wider block mb-1">Input</span>
            <div className="bg-[#161b26] p-3 rounded-xl border border-[#222938] text-gray-200 overflow-x-auto">
              {typeof currentCase.input === 'object' ? JSON.stringify(currentCase.input) : String(currentCase.input)}
            </div>
          </div>

          {/* Expected vs Actual Output */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <span className="text-gray-400 font-sans text-[11px] font-bold uppercase tracking-wider block mb-1">Expected Output</span>
              <div className="bg-[#161b26] p-3 rounded-xl border border-[#222938] text-emerald-400 overflow-x-auto">
                {currentCase.expected_output}
              </div>
            </div>

            <div>
              <span className="text-gray-400 font-sans text-[11px] font-bold uppercase tracking-wider block mb-1">Actual Output</span>
              <div className={`p-3 rounded-xl border overflow-x-auto ${
                currentCase.status === 'Passed' 
                  ? 'bg-[#161b26] border-[#222938] text-emerald-400' 
                  : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
              }`}>
                {currentCase.actual_output || '<no output>'}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
