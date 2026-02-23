import { useState, useEffect } from 'react';

const ANNOTATIONS_KEY = 'funnel_annotations';

export function getAnnotations() {
  try {
    return JSON.parse(localStorage.getItem(ANNOTATIONS_KEY) || '[]');
  } catch {
    return [];
  }
}

export function saveAnnotation(date, stage, text) {
  const annotations = getAnnotations();
  const existing = annotations.findIndex(a => a.date === date && a.stage === stage);
  if (text.trim()) {
    if (existing >= 0) {
      annotations[existing].text = text;
    } else {
      annotations.push({ date, stage, text, createdAt: new Date().toISOString() });
    }
  } else if (existing >= 0) {
    annotations.splice(existing, 1);
  }
  localStorage.setItem(ANNOTATIONS_KEY, JSON.stringify(annotations));
}

export function getAnnotationForPoint(date, stage) {
  return getAnnotations().find(a => a.date === date && a.stage === stage);
}

export default function AnnotationInput({ date, stage, onClose }) {
  const existing = getAnnotationForPoint(date, stage);
  const [text, setText] = useState(existing?.text || '');

  const handleSave = () => {
    saveAnnotation(date, stage, text);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-md mx-4 p-5">
        <h3 className="text-sm font-semibold text-slate-900 mb-1">Add Annotation</h3>
        <p className="text-xs text-slate-500 mb-3">
          {date} &mdash; {stage}
        </p>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="e.g., 'CIBIL API had 40-min downtime 14:00–14:40 IST'"
          className="w-full text-sm border border-slate-200 rounded-lg p-3 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-slate-400"
          autoFocus
        />
        <div className="flex items-center justify-end gap-2 mt-3">
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
