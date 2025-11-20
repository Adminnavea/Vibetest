export enum CustomerStatus {
  ACTIVE = 'Active',
  AT_RISK_CHURN = 'At Risk (Churn)',
  AT_RISK_UNSUBSCRIBE = 'At Risk (Unsubscribe)',
  SAFE = 'Safe'
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  ltv: number; // Lifetime Value
  lastPurchaseDate: string;
  churnPropensity: number; // 0-100
  unsubscribePropensity: number; // 0-100
  segment: string;
}

export interface Thresholds {
  churnRisk: number;
  unsubscribeRisk: number;
}

export interface EmailDraft {
  subject: string;
  body: string;
}

export interface CampaignMetric {
  date: string;
  controlGroupRetention: number;
  campaignGroupRetention: number;
  lift: number;
}