import React from 'react';
import { Customer, Thresholds, CustomerStatus } from '../types';
import { AlertCircle, CheckCircle, Mail, Zap } from 'lucide-react';

interface Props {
  customers: Customer[];
  thresholds: Thresholds;
  onSelectCustomer: (customer: Customer, status: CustomerStatus) => void;
}

const CustomerTable: React.FC<Props> = ({ customers, thresholds, onSelectCustomer }) => {
  
  const getStatus = (customer: Customer): CustomerStatus => {
    // Rule: Churn takes precedence
    if (customer.churnPropensity >= thresholds.churnRisk) {
      return CustomerStatus.AT_RISK_CHURN;
    }
    if (customer.unsubscribePropensity >= thresholds.unsubscribeRisk) {
      return CustomerStatus.AT_RISK_UNSUBSCRIBE;
    }
    return CustomerStatus.SAFE;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-100">
        <h2 className="text-lg font-semibold text-slate-800">High Priority Segments</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Customer</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Segment</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Churn Risk</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Unsub Risk</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {customers.map((customer) => {
              const status = getStatus(customer);
              const isChurnRisk = status === CustomerStatus.AT_RISK_CHURN;
              const isUnsubRisk = status === CustomerStatus.AT_RISK_UNSUBSCRIBE;

              return (
                <tr key={customer.id} className="hover:bg-slate-50 transition">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-medium text-slate-900">{customer.name}</span>
                      <span className="text-sm text-slate-500">{customer.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                      {customer.segment}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex flex-col items-center">
                       <div className="w-full bg-slate-200 rounded-full h-1.5 mb-1 max-w-[80px]">
                          <div 
                            className={`h-1.5 rounded-full ${customer.churnPropensity > thresholds.churnRisk ? 'bg-red-500' : 'bg-green-500'}`} 
                            style={{ width: `${customer.churnPropensity}%` }}
                          />
                       </div>
                       <span className={`text-xs font-bold ${customer.churnPropensity > thresholds.churnRisk ? 'text-red-600' : 'text-slate-500'}`}>
                         {customer.churnPropensity}%
                       </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex flex-col items-center">
                       <div className="w-full bg-slate-200 rounded-full h-1.5 mb-1 max-w-[80px]">
                          <div 
                            className={`h-1.5 rounded-full ${customer.unsubscribePropensity > thresholds.unsubscribeRisk ? 'bg-orange-400' : 'bg-slate-400'}`} 
                            style={{ width: `${customer.unsubscribePropensity}%` }}
                          />
                       </div>
                       <span className={`text-xs font-bold ${customer.unsubscribePropensity > thresholds.unsubscribeRisk ? 'text-orange-500' : 'text-slate-500'}`}>
                         {customer.unsubscribePropensity}%
                       </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {isChurnRisk ? (
                      <button 
                        onClick={() => onSelectCustomer(customer, status)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 rounded-md text-sm font-semibold hover:bg-red-100 transition border border-red-100"
                      >
                        <Zap className="w-4 h-4" />
                        Send Coupon
                      </button>
                    ) : isUnsubRisk ? (
                      <button 
                         onClick={() => onSelectCustomer(customer, status)}
                         className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 text-orange-600 rounded-md text-sm font-semibold hover:bg-orange-100 transition border border-orange-100"
                      >
                        <Mail className="w-4 h-4" />
                        Engage
                      </button>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-slate-400 text-sm">
                        <CheckCircle className="w-4 h-4" />
                        Healthy
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomerTable;