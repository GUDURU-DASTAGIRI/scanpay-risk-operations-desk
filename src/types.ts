export type DecisionType = 'Approve' | 'Manual review' | 'Reject';

export type FraudClusterType = 'FRAUD_CARD_RING' | 'FRAUD_CARD_TESTING' | 'FRAUD_ACCOUNT_TAKEOVER' | '';

export interface Transaction {
  txn_id: string;
  team_id: string;
  created_at_ist: string;
  amount_usd: number;
  tip_usd: number;
  payment_method: 'card' | 'tap_to_pay' | 'ach';
  card_fingerprint?: string | null;
  card_country?: string | null;
  status: 'captured' | 'declined' | 'refunded';
  customer_name?: string;
  customer_zip?: string | number;
}

export interface PayoutPending {
  payout_id: string;
  team_id: string;
  created_at_ist: string;
  covers_from: string;
  covers_to: string;
  txn_count: number;
  payout_amount_usd: number;
  status: string;
  initial_decision: DecisionType;
  decision: DecisionType;
  fraud_cluster: FraudClusterType;
  reasons: string;
  evidence: string;
  is_overridden?: boolean;
  override_reason?: string;
  override_timestamp?: string | null;
  overridden_by?: string;
  
  // Enriched team metadata
  team_name: string;
  profession: string;
  owner_name: string;
  owner_phone: string;
  city: string;
  state: string;
  signup_device_id: string;
  payout_bank_routing: string | number;
  payout_bank_last4: string | number;
  team_status: string;
}

export interface HistoricalPayout {
  payout_id: string;
  team_id: string;
  created_at_ist: string;
  covers_from: string;
  covers_to: string;
  txn_count: number;
  payout_amount_usd: number;
  decision: string;
  decided_by: string;
  decided_at_ist: string;
  reason_code?: string | null;
  reason?: string | null;
}

export interface Team {
  team_id: string;
  team_name: string;
  profession: string;
  owner_name: string;
  owner_phone: string;
  business_address: string;
  city: string;
  state: string;
  onboarded_on: string;
  status: string;
  suspended_on?: string | null;
  payout_bank_routing: string | number;
  payout_bank_last4: string | number;
  signup_device_id: string;
}

export interface TeamStats {
  avg_daily_amount: number;
  std_daily_amount: number;
  max_daily_amount: number;
  avg_daily_txns: number;
  std_daily_txns: number;
  payout_count: number;
}

export interface TeamTxStats {
  avg_ticket: number;
  std_ticket: number;
  max_ticket: number;
  total_txns: number;
  captured_count: number;
}

export interface ProfTxStats {
  avg_ticket: number;
  std_ticket: number;
  max_ticket: number;
}

export interface FraudCluster {
  cluster_id: string;
  name: string;
  historical_payouts: string[];
  historical_teams: string[];
  device_id?: string;
  shared_cards_count?: number;
  test_targets_historical?: string[];
  fraud_bank_routing?: string;
  fraud_bank_last4?: string;
  fraud_account_holder?: string;
  action_day_exposure?: string[];
  action_day_perpetrator?: string[];
  action_day_victims?: string[];
  description: string;
}

export interface OverrideLog {
  id: string;
  payout_id: string;
  team_id: string;
  team_name: string;
  previous_decision: DecisionType;
  new_decision: DecisionType;
  reason: string;
  timestamp: string;
  operator: string;
}
