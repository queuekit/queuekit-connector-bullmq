import { Socket } from 'socket.io-client';
import { Queue } from './queues';
import { debug } from './utils';

function utcNow() {
  const date = new Date();
  return date;
}

export const registerEventHandler = ({
  apiKey,
  queue,
  socket,
}: {
  apiKey: string;
  queue: Queue;
  socket: Socket;
}) => {
  [
    {
      event: 'waiting',
      queueMetricType: 'job_queued',
    },
    {
      event: 'active',
      queueMetricType: 'job_processing',
    },
    {
      event: 'completed',
      queueMetricType: 'job_completed',
    },
    {
      event: 'failed',
      queueMetricType: 'job_failed',
    },
  ].forEach(({ event, queueMetricType }) => {
    queue.bullEvents.on(event, ({ jobId }: { jobId: string }) => {
      const eventData = {
        timestamp: utcNow(),
        apiKey,
        queueName: queue.name,
        queuePrefix: queue.prefix,
        type: queueMetricType,
        data: { jobId },
      };
      if (socket.connected) {
        debug(`Emitting queue-metric: ${JSON.stringify(eventData)}`);
        socket.emit('queue-metric', eventData);
      }
    });
  });
};
