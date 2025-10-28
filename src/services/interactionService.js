import httpClient from './httpClient.js';

const eventBuffer = [];
const FLUSH_INTERVAL_MS = 3000;
const MAX_BUFFER_SIZE = 20;

let flushTimeout;

const flushEvents = async () => {
  if (eventBuffer.length === 0) {
    return;
  }

  const eventsToSend = eventBuffer.splice(0, eventBuffer.length);

  try {
    if (eventsToSend.length === 1) {
      await httpClient.post('/interactions', eventsToSend[0]);
    } else {
      await httpClient.post('/interactions/batch', {
        events: eventsToSend.map((event) => ({
          eventType: event.eventType,
          metadata: event.metadata,
          occurredAt: event.occurredAt,
          sessionId: event.sessionId,
        })),
      });
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn('Failed to log interaction batch', error);
  }
};

const scheduleFlush = () => {
  if (flushTimeout) {
    clearTimeout(flushTimeout);
  }

  flushTimeout = setTimeout(flushEvents, FLUSH_INTERVAL_MS);
};

export const logInteraction = ({ eventType, metadata = {}, occurredAt = new Date().toISOString(), sessionId }) => {
  eventBuffer.push({ eventType, metadata, occurredAt, sessionId });

  if (eventBuffer.length >= MAX_BUFFER_SIZE) {
    flushEvents();
    return;
  }

  scheduleFlush();
};

export const flushInteractionBuffer = flushEvents;
