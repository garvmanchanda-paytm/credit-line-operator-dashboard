import { RAG_COLORS } from '../utils/rag';

export default function RAGBadge({ status, label }) {
  const colors = RAG_COLORS[status] || RAG_COLORS.gray;

  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
      style={{ backgroundColor: colors.bg, color: colors.text }}
    >
      <span
        className="w-2 h-2 rounded-full"
        style={{ backgroundColor: colors.dot }}
      />
      {label || status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}
