import { InfoCard } from "./InfoCard";


export default function DestinationsSection({ data }: { data: any[] }) {
    return (
        <section className="py-16 bg-gray-50">
            <div className="flex justify-center items-center mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {data.map((item, i) => (
                        <InfoCard key={i} data={item} />
                    ))}
                </div>
            </div>
        </section>
    );
}