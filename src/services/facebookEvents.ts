import { supabase } from "@/integrations/supabase/client";

export const trackFacebookEvent = async (
  eventName: string,
  userData: {
    email?: string;
    firstName?: string;
    userId?: string;
  },
  customData?: {
    currency?: string;
    value?: number;
    contentName?: string;
    contentType?: string;
    contentIds?: string[];
  }
) => {
  try {
    const { data, error } = await supabase.functions.invoke('facebook-events', {
      body: {
        event_name: eventName,
        user_data: {
          em: userData.email,
          fn: userData.firstName,
          external_id: userData.userId,
        },
        custom_data: customData
      }
    });

    if (error) throw error;
    console.log('Facebook event tracked:', eventName, data);
    return data;
  } catch (error) {
    console.error('Error tracking Facebook event:', error);
    throw error;
  }
};

// Eventos predefinidos
export const trackPurchase = async (
  userData: { email?: string; firstName?: string; userId?: string },
  purchaseData: { 
    value: number;
    currency?: string;
    courseName?: string;
    courseId?: string;
  }
) => {
  return trackFacebookEvent('Purchase', userData, {
    currency: purchaseData.currency || 'COP',
    value: purchaseData.value,
    contentName: purchaseData.courseName,
    contentType: 'product',
    contentIds: purchaseData.courseId ? [purchaseData.courseId] : undefined
  });
};

export const trackSubscription = async (
  userData: { email?: string; firstName?: string; userId?: string },
  subscriptionData: { 
    value: number;
    currency?: string;
  }
) => {
  return trackFacebookEvent('Subscribe', userData, {
    currency: subscriptionData.currency || 'COP',
    value: subscriptionData.value,
    contentType: 'subscription'
  });
};

export const trackRegistration = async (
  userData: { email: string; firstName?: string; userId: string }
) => {
  return trackFacebookEvent('CompleteRegistration', userData);
};