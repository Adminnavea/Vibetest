import React, { useState, useEffect } from 'react';
import { Customer, EmailDraft, CustomerStatus } from '../types';
import { generateRetentionEmail, generateUnsubscribePreventionEmail } from '../services/geminiService';
import { X, Wand2, Send, Copy } from 'lucide-react';

interface Props {
  customer: Customer | null;
  status: CustomerStatus;
  onClose: () => void;
}

const EmailGenerator: React.FC<Props> = ({ customer, status, onClose }) => {
  const [draft, setDraft] = useState<EmailDraft | null>(null);
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);

  useEffect(() => {
    if (customer && !generated) {
      handleGenerate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customer]);

  const handleGenerate = async () => {
    if (!customer) return;
    setLoading(true);
    
    let result: EmailDraft;
    if (status === CustomerStatus.AT_RISK_CHURN) {
        result = await generateRetentionEmail(customer);
    } else {
        result = await generateUnsubscribePreventionEmail(customer);
    }
    
    setDraft(result);
    setLoading(false);
    setGenerated(true);
  };

  if (!customer) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-2xl">
          <div>
            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
               {status === CustomerStatus.AT_RISK_CHURN 
                 ? 'Generate Retention Offer' 
                 : 'Generate Engagement Email'}
            </h3>
            <p className="text-sm text-slate-500">Targeting: <span className="font-medium text-indigo-600">{customer.name}</span></p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-2 rounded-full hover:bg-slate-200 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
           {loading ? (
             <div className="flex flex-col items-center justify-center h-64 space-y-4">
               <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
               <p className="text-slate-500 animate-pulse">Consulting Gemini AI...</p>
             </div>
           ) : draft ? (
             <div className="space-y-4">
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Subject Line</label>
                  <div className="text-slate-800 font-medium">{draft.subject}</div>
                </div>
                
                <div className="bg-white p-4 rounded-lg border border-slate-200 min-h-[200px] shadow-inner">
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Email Body</label>
                  <div className="whitespace-pre-wrap text-slate-700 leading-relaxed">
                    {draft.body}
                  </div>
                </div>
             </div>
           ) : (
             <div className="text-center py-12 text-slate-500">
                Click generate to create a draft.
             </div>
           )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 flex justify-between items-center bg-slate-50 rounded-b-2xl">
           <button 
             onClick={handleGenerate} 
             disabled={loading}
             className="flex items-center gap-2 text-slate-600 hover:text-indigo-600 font-medium transition disabled:opacity-50"
           >
             <Wand2 className="w-4 h-4" />
             Regenerate
           </button>
           
           <div className="flex gap-3">
             <button className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-medium hover:bg-white hover:shadow-sm transition flex items-center gap-2">
               <Copy className="w-4 h-4" />
               Copy
             </button>
             <button className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 shadow-lg shadow-indigo-200 hover:shadow-indigo-300 transition flex items-center gap-2">
               <Send className="w-4 h-4" />
               Send Campaign
             </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default EmailGenerator;