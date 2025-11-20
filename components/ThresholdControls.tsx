import React from 'react';
import { Thresholds } from '../types';
import { Sliders, AlertTriangle, MailX } from 'lucide-react';

interface Props {
  thresholds: Thresholds;
  setThresholds: (t: Thresholds) => void;
}

const ThresholdControls: React.FC<Props> = ({ thresholds, setThresholds }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <div className="flex items-center gap-2 mb-4">
        <Sliders className="w-5 h-5 text-indigo-600" />
        <h2 className="text-lg font-semibold text-slate-800">Risk Management Thresholds</h2>
      </div>
      
      <div className="space-y-8">
        {/* Churn Threshold */}
        <div>
          <div className="flex justify-between mb-2">
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              Churn Probability Trigger
            </label>
            <span className="text-sm font-bold text-indigo-600">{thresholds.churnRisk}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={thresholds.churnRisk}
            onChange={(e) => setThresholds({ ...thresholds, churnRisk: Number(e.target.value) })}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
          />
          <p className="text-xs text-slate-500 mt-1">
            Customers above this score will receive the high-priority retention offer (Coupon).
          </p>
        </div>

        {/* Unsubscribe Threshold */}
        <div>
          <div className="flex justify-between mb-2">
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
              <MailX className="w-4 h-4 text-orange-500" />
              Unsubscribe Probability Trigger
            </label>
            <span className="text-sm font-bold text-indigo-600">{thresholds.unsubscribeRisk}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={thresholds.unsubscribeRisk}
            onChange={(e) => setThresholds({ ...thresholds, unsubscribeRisk: Number(e.target.value) })}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
          />
          <p className="text-xs text-slate-500 mt-1">
            Customers above this score (but below Churn Risk) will receive engagement content.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ThresholdControls;