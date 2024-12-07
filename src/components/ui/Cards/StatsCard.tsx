import { ReactNode } from "react";
import { formatCurrency } from "@/utils/formatUtils";
import { cn } from "@/utils/twMergeUtils";

interface StatsCardProps {
  title: string;
  icon: ReactNode;
  value: number | string;
  extended?: boolean;
  color: string;
  isAmount?: boolean;
}

const StatsCard = ({
  title,
  icon,
  value,
  extended = false,
  color,
  isAmount = false,
}: StatsCardProps) => {
  return (
    <div
      className={cn(
        "flex items-center break-words bg-white border-l-4 shadow dark:bg-slate-850 rounded-[10px] bg-clip-border",
        color
      )}
    >
      <div className="flex-auto p-4">
        <div className="flex flex-row justify-between">
          <div className="flex-none w-2/3 max-w-full px-1">
            <div>
              <p className="mb-0 font-sans font-semibold leading-normal uppercase text-slate-700 dark:text-white dark:opacity-60 text-sm">
                {title}
              </p>
              <h5 className="mb-2 font-bold text-slate-700 dark:text-white text-2xl">
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
          <div className="px-3 flex items-center justify-end">
            <div className="items-center inline-block w-12 h-12 text-center rounded-circle">
              {icon}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
