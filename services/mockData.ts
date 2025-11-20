import { Customer, CampaignMetric } from '../types';

export const generateMockCustomers = (count: number): Customer[] => {
  const segments = ['Enterprise', 'SMB', 'Consumer'];
  const customers: Customer[] = [];

  for (let i = 0; i < count; i++) {
    const isHighRisk = Math.random() > 0.7;
    
    customers.push({
      id: `cust_${i + 1}`,
      name: `Customer ${i + 1}`,
      email: `user${i + 1}@example.com`,
      ltv: Math.floor(Math.random() * 5000) + 200,
      lastPurchaseDate: new Date(Date.now() - Math.floor(Math.random() * 60 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
      churnPropensity: isHighRisk ? Math.floor(Math.random() * 30) + 70 : Math.floor(Math.random() * 60),
      unsubscribePropensity: Math.floor(Math.random() * 100),
      segment: segments[Math.floor(Math.random() * segments.length)],
    });
  }
  return customers.sort((a, b) => b.churnPropensity - a.churnPropensity);
};

export const generateCampaignMetrics = (): CampaignMetric[] => {
  const data: CampaignMetric[] = [];
  const today = new Date();
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    
    const control = 85 + Math.random() * 2;
    const campaign = 89 + Math.random() * 3 + (i * 0.2); // Slight trend up
    
    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      controlGroupRetention: Number(control.toFixed(1)),
      campaignGroupRetention: Number(campaign.toFixed(1)),
      lift: Number((campaign - control).toFixed(2))
    });
  }
  return data;
};