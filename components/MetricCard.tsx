'use client';

import { TrendingUp, TrendingDown } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  description: string;
  icon?: React.ReactNode;
}

export function MetricCard({
  title,
  value,
  change,
  trend,
  description,
  icon,
}: MetricCardProps) {
  const trendColor = trend === 'up' ? 'text-green-400' : 'text-red-400';
  const TrendIcon = trend === 'up' ? TrendingUp : TrendingDown;

  return (
    <div className="metric-card">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-white text-lg font-semibold mb-1">{title}</h3>
          <p className="text-gray-300 text-sm">{description}</p>
        </div>
        {icon && <div className="text-purple-300">{icon}</div>}
      </div>

      <div className="flex items-end justify-between">
        <div>
          <div className="text-3xl font-bold text-white mb-1">{value}</div>
          <div className={`flex items-center space-x-1 ${trendColor} text-sm`}>
            <TrendIcon className="h-4 w-4" />
            <span>{change}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
