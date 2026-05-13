import { supabase } from '@/lib/supabase';
import type {
  Discussion,
  DiscussionMessage,
  DiscussionAgreement,
  MessageType,
  SenderType,
  AmenitiesCardData,
  PricingCardData,
  CounterOfferData,
  AgreementData,
} from '@/components/discuss/types';

// ── Discussions ─────────────────────────────────────────────────

export async function getOrCreateDiscussion(
  vendorId: string,
  customerId: number,
  customerName: string,
  customerEmail?: string,
  customerPhone?: string,
): Promise<Discussion | null> {
  // Try to find existing thread first
  const { data: existing } = await supabase
    .from('discussions')
    .select('*')
    .eq('vendor_id', vendorId)
    .eq('customer_id', customerId)
    .single();

  if (existing) return existing as Discussion;

  const { data, error } = await supabase
    .from('discussions')
    .insert({
      vendor_id: vendorId,
      customer_id: customerId,
      customer_name: customerName,
      customer_email: customerEmail || null,
      customer_phone: customerPhone || null,
      subject: 'Venue & Pricing Discussion',
    })
    .select()
    .single();

  if (error) { console.error('createDiscussion:', error); return null; }
  return data as Discussion;
}

export async function getDiscussion(id: string): Promise<Discussion | null> {
  const { data, error } = await supabase
    .from('discussions')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return null;
  return data as Discussion;
}

export async function getVendorDiscussions(vendorId: string): Promise<Discussion[]> {
  const { data, error } = await supabase
    .from('discussions')
    .select('*')
    .eq('vendor_id', vendorId)
    .order('last_message_at', { ascending: false });

  if (error) { console.error('getVendorDiscussions:', error); return []; }
  return (data || []) as Discussion[];
}

export async function updateDiscussionStatus(
  id: string,
  status: 'active' | 'agreed' | 'closed',
): Promise<void> {
  await supabase.from('discussions').update({ status }).eq('id', id);
}

// ── Messages ────────────────────────────────────────────────────

export async function getMessages(discussionId: string): Promise<DiscussionMessage[]> {
  const { data, error } = await supabase
    .from('discussion_messages')
    .select('*')
    .eq('discussion_id', discussionId)
    .order('created_at', { ascending: true });

  if (error) { console.error('getMessages:', error); return []; }
  return (data || []) as DiscussionMessage[];
}

export async function sendTextMessage(
  discussionId: string,
  senderType: SenderType,
  senderName: string,
  content: string,
): Promise<DiscussionMessage | null> {
  const { data, error } = await supabase
    .from('discussion_messages')
    .insert({
      discussion_id: discussionId,
      sender_type: senderType,
      sender_name: senderName,
      message_type: 'text',
      content,
    })
    .select()
    .single();

  if (error) { console.error('sendTextMessage:', error); return null; }

  await supabase
    .from('discussions')
    .update({ last_message: content.slice(0, 120), last_message_at: new Date().toISOString() })
    .eq('id', discussionId);

  return data as DiscussionMessage;
}

export async function sendCardMessage(
  discussionId: string,
  senderType: SenderType,
  senderName: string,
  messageType: MessageType,
  cardData: AmenitiesCardData | PricingCardData | CounterOfferData | AgreementData,
): Promise<DiscussionMessage | null> {
  const preview =
    messageType === 'amenities_card' ? '📋 Sent an Amenities Overview card'
    : messageType === 'pricing_card' ? '💰 Sent a Pricing Proposal'
    : messageType === 'counter_offer' ? '🔄 Sent a Counter Offer'
    : '✅ Sent a Final Agreement';

  const { data, error } = await supabase
    .from('discussion_messages')
    .insert({
      discussion_id: discussionId,
      sender_type: senderType,
      sender_name: senderName,
      message_type: messageType,
      content: preview,
      card_data: cardData,
    })
    .select()
    .single();

  if (error) { console.error('sendCardMessage:', error); return null; }

  await supabase
    .from('discussions')
    .update({ last_message: preview, last_message_at: new Date().toISOString() })
    .eq('id', discussionId);

  return data as DiscussionMessage;
}

export async function markMessagesRead(
  discussionId: string,
  readerType: SenderType,
): Promise<void> {
  await supabase
    .from('discussion_messages')
    .update({ is_read: true })
    .eq('discussion_id', discussionId)
    .neq('sender_type', readerType)
    .eq('is_read', false);
}

// ── Agreements ──────────────────────────────────────────────────

export async function createAgreement(
  discussionId: string,
  vendorId: string,
  customerId: number | null,
  cardData: AgreementData,
): Promise<DiscussionAgreement | null> {
  const { data, error } = await supabase
    .from('discussion_agreements')
    .insert({
      discussion_id: discussionId,
      vendor_id: vendorId,
      customer_id: customerId,
      agreed_items: cardData.items,
      total_amount: cardData.total,
      event_date: cardData.event_date || null,
      terms: cardData.terms || null,
      notes: cardData.notes || null,
    })
    .select()
    .single();

  if (error) { console.error('createAgreement:', error); return null; }
  return data as DiscussionAgreement;
}

export async function confirmAgreement(
  agreementId: string,
  role: 'vendor' | 'customer',
): Promise<DiscussionAgreement | null> {
  const field = role === 'vendor' ? 'vendor_confirmed' : 'customer_confirmed';
  const { data, error } = await supabase
    .from('discussion_agreements')
    .update({ [field]: true })
    .eq('id', agreementId)
    .select()
    .single();

  if (error) { console.error('confirmAgreement:', error); return null; }

  const updated = data as DiscussionAgreement;
  if (updated.vendor_confirmed && updated.customer_confirmed) {
    await supabase
      .from('discussion_agreements')
      .update({ finalized_at: new Date().toISOString() })
      .eq('id', agreementId);
    await updateDiscussionStatus(updated.discussion_id, 'agreed');
  }

  return updated;
}

export async function getAgreement(discussionId: string): Promise<DiscussionAgreement | null> {
  const { data } = await supabase
    .from('discussion_agreements')
    .select('*')
    .eq('discussion_id', discussionId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  return (data as DiscussionAgreement) || null;
}

// ── Real-time subscription ──────────────────────────────────────

export function subscribeToMessages(
  discussionId: string,
  onMessage: (msg: DiscussionMessage) => void,
) {
  return supabase
    .channel(`disc-${discussionId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'discussion_messages',
        filter: `discussion_id=eq.${discussionId}`,
      },
      (payload) => onMessage(payload.new as DiscussionMessage),
    )
    .subscribe();
}
