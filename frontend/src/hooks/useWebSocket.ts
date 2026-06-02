import { useEffect, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

export function useWebSocket() {
  const clientRef = useRef<Client | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    const client = new Client({
      brokerURL: undefined,
      webSocketFactory: () => {
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const host = window.location.host;
        return new WebSocket(`${protocol}//${host}/ws`);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
    });

    client.onConnect = () => {
      client.subscribe('/topic/low-stock', (message) => {
        const body = message.body;
        toast(body, {
          icon: '\u26A0\uFE0F',
          duration: 6000,
          style: {
            background: '#fef3c7',
            color: '#92400e',
            border: '1px solid #f59e0b',
          },
        });
      });
    };

    client.onStompError = (frame) => {
      console.error('WebSocket STOMP error:', frame.headers['message']);
    };

    client.activate();
    clientRef.current = client;

    return () => {
      if (clientRef.current?.connected) {
        clientRef.current.deactivate();
      }
    };
  }, [t]);

  return clientRef;
}
