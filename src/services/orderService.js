import httpClient from './httpClient.js';
import { logInteraction } from './interactionService.js';

export const createOrder = async (payload) => {
  const response = await httpClient.post('/orders', payload);

  logInteraction({
    eventType: 'order.client_created',
    metadata: {
      shopId: payload.shopId,
      deliveryType: payload.deliveryType,
      itemsCount: payload.items?.length ?? 0,
      source: 'web',
    },
  });

  return response.data.order;
};

export const updateOrderStatus = async ({ orderId, status, partnerId }) => {
  const response = await httpClient.patch(`/orders/${orderId}/status`, {
    status,
    partnerId,
  });

  logInteraction({
    eventType: 'order.client_status_change',
    metadata: {
      orderId,
      status,
      partnerId,
      source: 'web',
    },
  });

  return response.data.order;
};
