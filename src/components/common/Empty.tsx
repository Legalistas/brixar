import { ReactNode } from "react";

interface EmptyStateCardProps {
  emptyStateMessage: string;
  emptyStateDescription: string;
  icon: ReactNode;
}

export default function EmptyStateCard({
  emptyStateMessage,
  emptyStateDescription,
  icon,
}: EmptyStateCardProps) {
  return (
    <div className="flex flex-col items-center justify-center py-10 px-4">
      <div className="mb-4 text-slate-400">{icon}</div>
      <p className="text-slate-600 text-lg text-center mb-2">
        {emptyStateMessage}
      </p>
      <p className="text-slate-500 text-sm text-center">
        {emptyStateDescription}
      </p>
    </div>
  );
}
