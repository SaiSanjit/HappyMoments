// Admin API service for sending customers to vendors
import { API_BASE_URL } from '../config/api';
const ADMIN_API_URL = `${API_BASE_URL}/api/contacted-vendors`;

export interface AdminSendCustomerRequest {
  vendor_id: number;
  customer_name: string;
  customer_phone: string;
}

export interface AdminSendCustomerResponse {
  success: boolean;
  message?: string;
  error?: string;
  data?: {
    contact_id: number;
    customer_id: number;
    vendor_id: number;
    customer_name: string;
    customer_phone: string;
    vendor_name: string;
    notification_message: string;
  };
  already_contacted?: boolean;
}

// Admin send customer to vendor
export const adminSendCustomerToVendor = async (request: AdminSendCustomerRequest): Promise<AdminSendCustomerResponse> => {
  try {
    console.log(`🌐 Admin API: Sending customer ${request.customer_name} to vendor ${request.vendor_id}`);
    console.log(`🔗 API URL: ${ADMIN_API_URL}/admin-send-customer`);

    const response = await fetch(`${ADMIN_API_URL}/admin-send-customer`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request)
    });

    console.log(`📡 Response status: ${response.status} ${response.statusText}`);
    const data = await response.json();
    console.log(`📦 Response data:`, data);

    if (!response.ok) {
      console.error('❌ Admin API Error:', data);
      return {
        success: false,
        error: data.error || `HTTP ${response.status}: Failed to send customer`
      };
    }

    console.log('✅ Admin API: Customer sent successfully:', data);
    return data;
  } catch (error) {
    console.error('💥 Admin API Error:', error);
    return {
      success: false,
      error: `Network error: ${error.message}`
    };
  }
};
