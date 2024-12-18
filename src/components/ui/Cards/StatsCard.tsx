import { cn } from "@/lib/utils";
import { formatCurrency } from "@/utils/formatUtils";

interface CardProps {
  title: string;
  value: string | number;
  isAmount?: boolean; // Make isAmount optional
  extended?: boolean;
  icon?: React.ReactNode;
  color?: string;
}

const Card: React.FC<CardProps> = ({
  title,
  value,
  isAmount = false, // Provide a default value
  extended,
  icon,
  color = "bg-gradient-to-r from-blue-500 to-purple-500",
}) => {
  return (
    <div
      className={cn(
        "flex items-center break-words bg-white border-l-4 shadow dark:bg-slate-850 rounded-[10px] bg-clip-border h-full",
        color
      )}
    >
      <div className="flex-auto p-4">
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <div className="w-full sm:w-2/3 px-1 mb-4 sm:mb-0">
            <div>
              <p className="mb-1 font-sans font-semibold leading-normal uppercase text-slate-700 dark:text-white dark:opacity-60 text-xs sm:text-sm">
                {title}
              </p>
              <h5 className="mb-2 font-bold text-slate-700 dark:text-white text-xl sm:text-2xl">
                {isAmount ? formatCurrency(value) : value}
              </h5>
              {extended && (
                <p className="mb-0 dark:text-white dark:opacity-60">
                  <span className="font-bold leading-normal text-sm text-emerald-500">
                    +55%
                  </span>
                  since yesterday
                </p>
              )}
            </div>
          </div>
          <div className="px-3 flex items-center justify-center sm:justify-end">
            <div className="inline-block w-12 h-12 text-center rounded-full">
              {icon}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;

