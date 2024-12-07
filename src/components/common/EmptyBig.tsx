import { ReactNode } from "react";

interface EmptyStateCardProps {
  emptyStateMessage: string;
  emptyStateDescription: string;
  icon: ReactNode;
  button: ReactNode;
}

const EmptyBig = ({
  emptyStateMessage,
  emptyStateDescription,
  icon,
  button,
}: EmptyStateCardProps) => (
  <div className="mt-20 text-center">
    <div className="mx-auto mb-4 h-32 w-32">
      <div className="rounded-full bg-gray-100 p-8">{icon}</div>
    </div>
    <h2 className="mb-2 text-lg font-semibold">{emptyStateMessage}</h2>
    <p className="text-sm text-gray-600">{emptyStateDescription}</p>
    <div className="mt-4 flex justify-center">{button}</div>
  </div>
);

export default EmptyBig;
