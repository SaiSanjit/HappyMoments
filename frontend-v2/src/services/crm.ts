import { supabase } from '@/lib/supabase';
import {
  CRMResource,
  CRMTerritory,
  CRMResourceTerritory,
  CRMOpportunity,
  CRMLead,
  CRMChatRoom,
  CRMMessage,
  CRMWorklist,
  DashboardFilters,
  DashboardKPI,
  StatusBreakdown,
} from '@/lib/crm-types';

// ── Resources ─────────────────────────────────────────────────────────────────

export async function getResources(vendorId: string): Promise<CRMResource[]> {
  const { data, error } = await supabase
    .from('crm_resources')
    .select('*')
    .eq('vendor_id', vendorId)
    .order('created_at', { ascending: false });
  if (error || !data) return [];
  return data as CRMResource[];
}

export async function createResource(
  payload: Omit<CRMResource, 'id' | 'created_at' | 'updated_at' | 'last_login'>
): Promise<{ data: CRMResource | null; error: string | null }> {
  const { data, error } = await supabase
    .from('crm_resources')
    .insert(payload)
    .select()
    .single();
  if (error) return { data: null, error: error.message };
  return { data: data as CRMResource, error: null };
}

export async function updateResource(
  id: string,
  payload: Partial<CRMResource>
): Promise<{ error: string | null }> {
  const { error } = await supabase
    .from('crm_resources')
    .update({ ...payload, updated_at: new Date().toISOString() })
    .eq('id', id);
  return { error: error?.message ?? null };
}

export async function deleteResource(id: string): Promise<{ error: string | null }> {
  const { error } = await supabase.from('crm_resources').delete().eq('id', id);
  return { error: error?.message ?? null };
}

export async function getResourceTerritories(resourceId: string): Promise<CRMTerritory[]> {
  const { data, error } = await supabase
    .from('crm_resource_territories')
    .select('territory_id, crm_territories(*)')
    .eq('resource_id', resourceId);
  if (error || !data) return [];
  return data.map((d: Record<string, unknown>) => d.crm_territories as CRMTerritory).filter(Boolean);
}

export async function assignTerritoriesToResource(
  resourceId: string,
  territoryIds: string[]
): Promise<{ error: string | null }> {
  await supabase.from('crm_resource_territories').delete().eq('resource_id', resourceId);
  if (territoryIds.length === 0) return { error: null };
  const rows = territoryIds.map((t) => ({ resource_id: resourceId, territory_id: t }));
  const { error } = await supabase.from('crm_resource_territories').insert(rows);
  return { error: error?.message ?? null };
}

// ── Territories ───────────────────────────────────────────────────────────────

export async function getTerritories(vendorId: string): Promise<CRMTerritory[]> {
  const { data, error } = await supabase
    .from('crm_territories')
    .select('*')
    .eq('vendor_id', vendorId)
    .order('country', { ascending: true });
  if (error || !data) return [];
  return data as CRMTerritory[];
}

export async function createTerritory(
  payload: Omit<CRMTerritory, 'id' | 'created_at' | 'updated_at'>
): Promise<{ data: CRMTerritory | null; error: string | null }> {
  const { data, error } = await supabase
    .from('crm_territories')
    .insert(payload)
    .select()
    .single();
  if (error) return { data: null, error: error.message };
  return { data: data as CRMTerritory, error: null };
}

export async function updateTerritory(
  id: string,
  payload: Partial<CRMTerritory>
): Promise<{ error: string | null }> {
  const { error } = await supabase
    .from('crm_territories')
    .update({ ...payload, updated_at: new Date().toISOString() })
    .eq('id', id);
  return { error: error?.message ?? null };
}

export async function deleteTerritory(id: string): Promise<{ error: string | null }> {
  const { error } = await supabase.from('crm_territories').delete().eq('id', id);
  return { error: error?.message ?? null };
}

export async function getTerritoryResources(
  territoryId: string
): Promise<CRMResourceTerritory[]> {
  const { data, error } = await supabase
    .from('crm_resource_territories')
    .select('*')
    .eq('territory_id', territoryId);
  if (error || !data) return [];
  return data as CRMResourceTerritory[];
}

// ── Leads ─────────────────────────────────────────────────────────────────────

export async function getLeads(
  vendorId: string,
  resourceId?: string
): Promise<CRMLead[]> {
  let query = supabase
    .from('vendor_leads')
    .select('*')
    .eq('vendor_id', vendorId)
    .order('created_at', { ascending: false });

  if (resourceId) query = query.eq('resource_id', resourceId);

  const { data, error } = await query;
  if (error || !data) return [];
  return data as unknown as CRMLead[];
}

export async function getLead(id: string): Promise<CRMLead | null> {
  const { data, error } = await supabase
    .from('vendor_leads')
    .select('*')
    .eq('id', id)
    .single();
  if (error || !data) return null;
  return data as unknown as CRMLead;
}

export async function createLead(
  payload: Partial<CRMLead>
): Promise<{ data: CRMLead | null; error: string | null }> {
  const { data, error } = await supabase
    .from('vendor_leads')
    .insert(payload)
    .select()
    .single();
  if (error) return { data: null, error: error.message };
  return { data: data as unknown as CRMLead, error: null };
}

export async function updateLead(
  id: string,
  payload: Partial<CRMLead>
): Promise<{ error: string | null }> {
  const { error } = await supabase
    .from('vendor_leads')
    .update({ ...payload, updated_at: new Date().toISOString() })
    .eq('id', id);
  return { error: error?.message ?? null };
}

// ── Opportunities ─────────────────────────────────────────────────────────────

export async function getOpportunities(
  vendorId: string,
  resourceId?: string
): Promise<CRMOpportunity[]> {
  let query = supabase
    .from('crm_opportunities')
    .select('*')
    .eq('vendor_id', vendorId)
    .order('created_at', { ascending: false });

  if (resourceId) query = query.eq('assigned_resource_id', resourceId);

  const { data, error } = await query;
  if (error || !data) return [];
  return data as CRMOpportunity[];
}

export async function getOpportunity(id: string): Promise<CRMOpportunity | null> {
  const { data, error } = await supabase
    .from('crm_opportunities')
    .select('*')
    .eq('id', id)
    .single();
  if (error || !data) return null;
  return data as CRMOpportunity;
}

export async function createOpportunity(
  payload: Partial<CRMOpportunity>
): Promise<{ data: CRMOpportunity | null; error: string | null }> {
  const { data, error } = await supabase
    .from('crm_opportunities')
    .insert(payload)
    .select()
    .single();
  if (error) return { data: null, error: error.message };
  return { data: data as CRMOpportunity, error: null };
}

export async function updateOpportunity(
  id: string,
  payload: Partial<CRMOpportunity>
): Promise<{ error: string | null }> {
  const { error } = await supabase
    .from('crm_opportunities')
    .update({ ...payload, updated_at: new Date().toISOString() })
    .eq('id', id);
  return { error: error?.message ?? null };
}

// ── Chats ─────────────────────────────────────────────────────────────────────

export async function getChatRooms(vendorId: string): Promise<CRMChatRoom[]> {
  const { data, error } = await supabase
    .from('crm_chat_rooms')
    .select('*')
    .eq('vendor_id', vendorId)
    .order('last_message_at', { ascending: false });
  if (error || !data) return [];
  return data as CRMChatRoom[];
}

export async function getOrCreateChatRoom(
  vendorId: string,
  referenceId: string,
  roomType: 'lead' | 'opportunity' | 'customer_negotiation',
  referenceType: 'Lead' | 'Opportunity',
  customerName?: string,
  customerId?: number
): Promise<CRMChatRoom | null> {
  const { data: existing } = await supabase
    .from('crm_chat_rooms')
    .select('*')
    .eq('reference_id', referenceId)
    .eq('room_type', roomType)
    .single();

  if (existing) return existing as CRMChatRoom;

  const { data, error } = await supabase
    .from('crm_chat_rooms')
    .insert({
      vendor_id: vendorId,
      room_type: roomType,
      reference_id: referenceId,
      reference_type: referenceType,
      customer_name: customerName,
      customer_id: customerId,
    })
    .select()
    .single();

  if (error || !data) return null;
  return data as CRMChatRoom;
}

export async function getMessages(roomId: string): Promise<CRMMessage[]> {
  const { data, error } = await supabase
    .from('crm_messages')
    .select('*')
    .eq('room_id', roomId)
    .order('created_at', { ascending: true });
  if (error || !data) return [];
  return data as CRMMessage[];
}

export async function sendMessage(
  roomId: string,
  senderType: 'resource' | 'customer',
  senderId: string,
  senderName: string,
  message: string
): Promise<{ data: CRMMessage | null; error: string | null }> {
  const { data, error } = await supabase
    .from('crm_messages')
    .insert({ room_id: roomId, sender_type: senderType, sender_id: senderId, sender_name: senderName, message })
    .select()
    .single();

  if (error) return { data: null, error: error.message };

  await supabase
    .from('crm_chat_rooms')
    .update({ last_message: message, last_message_at: new Date().toISOString() })
    .eq('id', roomId);

  return { data: data as CRMMessage, error: null };
}

// ── Worklist ──────────────────────────────────────────────────────────────────

export async function getWorklist(resourceId: string): Promise<CRMWorklist[]> {
  const { data, error } = await supabase
    .from('crm_worklist')
    .select('*')
    .eq('resource_id', resourceId)
    .order('due_date', { ascending: true });
  if (error || !data) return [];
  return data as CRMWorklist[];
}

export async function createWorklistItem(
  payload: Omit<CRMWorklist, 'id' | 'created_at'>
): Promise<{ error: string | null }> {
  const { error } = await supabase.from('crm_worklist').insert(payload);
  return { error: error?.message ?? null };
}

export async function updateWorklistItem(
  id: string,
  payload: Partial<CRMWorklist>
): Promise<{ error: string | null }> {
  const { error } = await supabase.from('crm_worklist').update(payload).eq('id', id);
  return { error: error?.message ?? null };
}

// ── Dashboard ─────────────────────────────────────────────────────────────────

export async function getDashboardKPI(
  vendorId: string,
  filters: DashboardFilters
): Promise<DashboardKPI> {
  const periodStart = getPeriodStart(filters.period);

  let leadsQ = supabase
    .from('vendor_leads')
    .select('id, status', { count: 'exact' })
    .eq('vendor_id', vendorId);
  if (periodStart) leadsQ = leadsQ.gte('created_at', periodStart);
  if (filters.resource_id) leadsQ = leadsQ.eq('resource_id', filters.resource_id);
  if (filters.territory_id) leadsQ = leadsQ.eq('territory_id', filters.territory_id);

  let optysQ = supabase
    .from('crm_opportunities')
    .select('id, opty_status, deal_value, win_probability')
    .eq('vendor_id', vendorId);
  if (periodStart) optysQ = optysQ.gte('created_at', periodStart);
  if (filters.resource_id) optysQ = optysQ.eq('assigned_resource_id', filters.resource_id);
  if (filters.territory_id) optysQ = optysQ.eq('territory_id', filters.territory_id);

  const [{ data: leads }, { data: optys }] = await Promise.all([leadsQ, optysQ]);

  const totalLeads = leads?.length ?? 0;
  const optsArr = (optys ?? []) as CRMOpportunity[];
  const wonDeals = optsArr.filter((o) => o.opty_status === 'closed_won');
  const pipelineValue = optsArr
    .filter((o) => !['closed_won', 'closed_lost'].includes(o.opty_status))
    .reduce((sum, o) => sum + (o.deal_value || 0), 0);
  const conversionRate = totalLeads > 0 ? Math.round((wonDeals.length / totalLeads) * 100) : 0;
  const avgWinProb =
    optsArr.length > 0
      ? Math.round(optsArr.reduce((sum, o) => sum + (o.win_probability || 0), 0) / optsArr.length)
      : 0;

  return {
    leads_this_period: totalLeads,
    opportunities_created: optsArr.length,
    deals_won: wonDeals.length,
    pipeline_value: pipelineValue,
    conversion_rate: conversionRate,
    avg_win_probability: avgWinProb,
  };
}

export async function getLeadStatusBreakdown(
  vendorId: string,
  filters: DashboardFilters
): Promise<StatusBreakdown[]> {
  const periodStart = getPeriodStart(filters.period);
  let q = supabase.from('vendor_leads').select('status').eq('vendor_id', vendorId);
  if (periodStart) q = q.gte('created_at', periodStart);
  if (filters.resource_id) q = q.eq('resource_id', filters.resource_id);

  const { data } = await q;
  if (!data) return [];

  const colors: Record<string, string> = {
    new: '#6366f1', contacted: '#f59e0b', qualified: '#3b82f6',
    negotiation: '#8b5cf6', booked: '#10b981', lost: '#ef4444', on_hold: '#6b7280',
  };

  const counts: Record<string, number> = {};
  for (const d of data) { counts[d.status] = (counts[d.status] || 0) + 1; }

  return Object.entries(counts).map(([status, count]) => ({
    status,
    count,
    color: colors[status] || '#6b7280',
  }));
}

export async function getOpportunityStatusBreakdown(
  vendorId: string,
  filters: DashboardFilters
): Promise<StatusBreakdown[]> {
  const periodStart = getPeriodStart(filters.period);
  let q = supabase.from('crm_opportunities').select('opty_status').eq('vendor_id', vendorId);
  if (periodStart) q = q.gte('created_at', periodStart);
  if (filters.resource_id) q = q.eq('assigned_resource_id', filters.resource_id);

  const { data } = await q;
  if (!data) return [];

  const colors: Record<string, string> = {
    prospect: '#6366f1', proposal: '#f59e0b', negotiation: '#8b5cf6',
    verbal_commit: '#3b82f6', closed_won: '#10b981', closed_lost: '#ef4444',
  };

  const counts: Record<string, number> = {};
  for (const d of data) { counts[d.opty_status] = (counts[d.opty_status] || 0) + 1; }

  return Object.entries(counts).map(([status, count]) => ({
    status,
    count,
    color: colors[status] || '#6b7280',
  }));
}

function getPeriodStart(period: DashboardFilters['period']): string | null {
  if (period === 'all') return null;
  const now = new Date();
  if (period === 'week') now.setDate(now.getDate() - 7);
  else if (period === 'month') now.setMonth(now.getMonth() - 1);
  else if (period === 'quarter') now.setMonth(now.getMonth() - 3);
  else if (period === 'year') now.setFullYear(now.getFullYear() - 1);
  return now.toISOString();
}
