import httpClient from './httpClient.js';
import { logInteraction } from './interactionService.js';

export const submitRating = async ({ targetType, targetId, score, comment, photos = [] }) => {
  const response = await httpClient.post('/ratings', {
    targetType,
    targetId,
    score,
    comment,
    photos,
  });

  logInteraction({
    eventType: 'rating.client_submit',
    metadata: {
      targetType,
      targetId,
      score,
      source: 'web',
    },
  });

  return response.data.rating;
};
