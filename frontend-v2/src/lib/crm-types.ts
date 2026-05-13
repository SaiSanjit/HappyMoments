// CRM TypeScript interfaces

export type CRMUserGroup =
  | 'CRM_LEADS'
  | 'CRM_OPPORTUNITIES'
  | 'CRM_DASHBOARDS'
  | 'CRM_CHATS'
  | 'CRM_WORKLIST'
  | 'CRM_RESOURCES'
  | 'CRM_TERRITORIES';

export interface CRMResource {
  id: string;
  vendor_id: string;
  resource_name: string;
  designation?: string;
  email: string;
  phone?: string;
  password_hash: string;
  crm_admin: 'Y' | 'N';
  admin_access_type: 'Modify' | 'View';
  sales_team: 'Y' | 'N';
  manager_id?: string;
  user_groups: CRMUserGroup[];
  date_of_joining?: string;
  is_active: boolean;
  last_login?: string;
  created_at: string;
  updated_at: string;
}

export interface CRMTerritory {
  id: string;
  vendor_id: string;
  country: string;
  city: string;
  alias?: string;
  active_flag: 'Y' | 'N';
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface CRMResourceTerritory {
  id: string;
  resource_id: string;
  territory_id: string;
  access_level: string;
  start_date?: string;
  end_date?: string;
  created_at: string;
}

export type OpportunityStatus =
  | 'prospect'
  | 'proposal'
  | 'negotiation'
  | 'verbal_commit'
  | 'closed_won'
  | 'closed_lost';

export type Priority = 'high' | 'medium' | 'low';

export type EventType =
  | 'Wedding'
  | 'Engagement'
  | 'Corporate'
  | 'Birthday'
  | 'Anniversary'
  | 'Other';

export interface EventContact {
  name: string;
  phone?: string;
  email?: string;
  designation?: string;
}

export interface EventService {
  name: string;
  selected: boolean;
  price?: number;
}

export interface LeadQualification {
  budget_min?: number;
  budget_max?: number;
  guest_count?: number;
  venue_preference?: string;
  special_requirements?: string;
}

export interface CRMOpportunity {
  id: string;
  opty_number?: string;
  vendor_id: string;
  lead_id?: string;
  assigned_resource_id?: string;
  creator_resource_id?: string;
  territory_id?: string;
  customer_name: string;
  customer_phone?: string;
  customer_email?: string;
  event_type?: EventType;
  event_date?: string;
  deal_value: number;
  win_probability: number;
  opty_status: OpportunityStatus;
  opty_priority: Priority;
  close_date?: string;
  site_visit_date?: string;
  proposal_due_date?: string;
  decision_date?: string;
  notes?: string;
  status_remarks?: string;
  new_client: boolean;
  services: EventService[];
  contacts: EventContact[];
  team_resources: string[];
  created_at: string;
  updated_at: string;
}

export type LeadStatus =
  | 'new'
  | 'contacted'
  | 'qualified'
  | 'negotiation'
  | 'booked'
  | 'lost'
  | 'on_hold';

export type LeadSource = 'Platform' | 'WhatsApp' | 'Referral' | 'Direct' | 'Other';

export interface CRMLead {
  id: string;
  vendor_id: string;
  lead_number?: string;
  customer_name: string;
  customer_phone?: string;
  customer_email?: string;
  event_type?: EventType;
  event_date?: string;
  status: LeadStatus;
  lead_source?: LeadSource;
  resource_id?: string;
  territory_id?: string;
  opportunity_id?: string;
  customer_id?: number;
  team_resources: string[];
  services: EventService[];
  contacts: EventContact[];
  qualification: LeadQualification;
  description?: string;
  priority?: Priority;
  notes?: string;
  created_at: string;
  updated_at?: string;
}

export type ChatRoomType = 'lead' | 'opportunity' | 'customer_negotiation';

export interface CRMChatRoom {
  id: string;
  vendor_id: string;
  room_type: ChatRoomType;
  reference_id: string;
  reference_type: 'Lead' | 'Opportunity';
  customer_name?: string;
  customer_id?: number;
  last_message?: string;
  last_message_at?: string;
  unread_count: number;
  created_at: string;
}

export type SenderType = 'resource' | 'customer';

export interface CRMMessage {
  id: string;
  room_id: string;
  sender_type: SenderType;
  sender_id: string;
  sender_name: string;
  message: string;
  read_by: Record<string, string>;
  created_at: string;
}

export type WorklistStatus = 'pending' | 'done' | 'deferred';

export interface CRMWorklist {
  id: string;
  vendor_id: string;
  resource_id: string;
  reference_type?: 'Lead' | 'Opportunity' | 'Task';
  reference_id?: string;
  title: string;
  due_date?: string;
  priority: Priority;
  status: WorklistStatus;
  notes?: string;
  created_at: string;
}

export interface GlobalChatItem {
  room: CRMChatRoom;
  last_message?: string;
  last_message_at?: string;
  unread_count: number;
  awaiting_response: boolean;
}

export interface DashboardKPI {
  leads_this_period: number;
  opportunities_created: number;
  deals_won: number;
  pipeline_value: number;
  conversion_rate: number;
  avg_win_probability: number;
}

export interface DashboardFilters {
  resource_id?: string;
  territory_id?: string;
  period: 'week' | 'month' | 'quarter' | 'year' | 'all';
}

export interface StatusBreakdown {
  status: string;
  count: number;
  color: string;
}

export interface PipelineByType {
  event_type: EventType;
  count: number;
  value: number;
}

export interface VendorSession {
  vendor_id: string;
  brand_name: string;
  email: string;
  spoc_name: string;
}

export interface ResourceSession {
  resource_id: string;
  vendor_id: string;
  resource_name: string;
  email: string;
  crm_admin: 'Y' | 'N';
  user_groups: CRMUserGroup[];
}
