'use client';

type Address = {
  streetName?: string;
  city?: string;
  state?: { name: string };
};

type Project = {
  id: number;
  slug: string;
  title: string;
  phase: 'CONSTRUCTION' | 'FUNDING';
  address: Address[];
  proyectDetails: {
    investmentPeriod: number;
    riskScore: number;
    profitabilityScore: number;
  };
};

interface Props {
  project: Project;
}

export default function ProjectCard({ project }: Props) {
  const { title, slug, phase, address, proyectDetails } = project;

  const location = `${address[0]?.streetName ?? ''}, ${address[0]?.city ?? ''}, ${address[0]?.state?.name ?? ''}`;
  const investmentPeriod = proyectDetails?.investmentPeriod ?? 0;
  const risk = proyectDetails?.riskScore ?? '-';
  const profitability = proyectDetails?.profitabilityScore ?? '-';

  const phaseLabel = phase === 'CONSTRUCTION' ? 'Construcción' : 'Financiación';
  const phaseColor = phase === 'CONSTRUCTION' ? 'bg-orange-500' : 'bg-gray-700';

  return (
    <div className="border rounded-lg shadow-sm overflow-hidden flex flex-col h-full">
      <div className={`${phaseColor} text-white text-xs font-semibold px-4 py-2`}>
        {phaseLabel}
      </div>

      <div className="p-5 flex-1">
        <h2 className="text-xl font-bold mb-2">{title}</h2>
        <p className="text-gray-700 text-sm mb-1">📍 {location}</p>
        <p className="text-sm text-gray-600">⏱ {investmentPeriod} meses de inversión</p>

        <div className="flex justify-between mt-4 text-sm">
          <span>Riesgo: <strong>{risk}</strong></span>
          <span>Rentabilidad: <strong>{profitability}</strong></span>
        </div>
      </div>

      <div className="p-4">
        <a
          href={`/proyectos/${slug}`}
          className="block w-full text-center bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded"
        >
          Ver detalles
        </a>
      </div>
    </div>
  );
}
