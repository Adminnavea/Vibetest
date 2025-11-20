import React from 'react';
import { CampaignMetric } from '../types';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import { TrendingUp, Activity } from 'lucide-react';

interface Props {
  data: CampaignMetric[];
}

const AnalyticsCharts: React.FC<Props> = ({ data }) => {
  const currentLift = data[data.length - 1].lift;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Retention Impact Chart */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <div className="flex justify-between items-center mb-6">
          <div>
             <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                <Activity className="w-5 h-5 text-indigo-500" />
                Campaign Effectiveness
             </h3>
             <p className="text-sm text-slate-500">Control Group vs. Campaign Group Retention</p>
          </div>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="date" tick={{fontSize: 12}} axisLine={false} tickLine={false} dy={10} />
              <YAxis domain={[80, 100]} tick={{fontSize: 12}} axisLine={false} tickLine={false} />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="campaignGroupRetention" 
                name="Campaign Group" 
                stroke="#4f46e5" 
                strokeWidth={3} 
                dot={{ r: 4, strokeWidth: 2 }}
                activeDot={{ r: 6 }}
              />
              <Line 
                type="monotone" 
                dataKey="controlGroupRetention" 
                name="Control Group" 
                stroke="#94a3b8" 
                strokeWidth={2} 
                strokeDasharray="5 5" 
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Lift Chart */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
         <div className="flex justify-between items-center mb-6">
          <div>
             <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-500" />
                Retention Lift
             </h3>
             <p className="text-sm text-slate-500">Percentage point improvement over control</p>
          </div>
          <div className="text-2xl font-bold text-green-600">+{currentLift}%</div>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="date" tick={{fontSize: 12}} axisLine={false} tickLine={false} dy={10} />
              <YAxis tick={{fontSize: 12}} axisLine={false} tickLine={false} />
              <Tooltip 
                 cursor={{fill: '#f1f5f9'}}
                 contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Bar dataKey="lift" name="Lift %" fill="#10b981" radius={[4, 4, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsCharts;
