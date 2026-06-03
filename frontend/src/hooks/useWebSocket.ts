import { useEffect, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import toast from 'react-hot-toast';

export function useWebSocket() {
  const clientRef = useRef<Client | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    let ativo = true;

    const conectar = async () => {
      try {
        const sockJsModule = await import('sockjs-client');
        if (!ativo) return;

        const SockJS = sockJsModule.default;
        const endpoint = `${window.location.protocol}//${window.location.host}/ws`;

        const client = new Client({
          brokerURL: undefined,
          connectHeaders: {
            Authorization: `Bearer ${token}`,
          },
          webSocketFactory: () => new SockJS(endpoint),
          reconnectDelay: 5000,
          heartbeatIncoming: 10000,
          heartbeatOutgoing: 10000,
        });

        client.onConnect = () => {
          client.subscribe('/topic/low-stock', (message) => {
            toast(message.body, {
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
          console.error('WebSocket STOMP error:', frame.headers.message);
        };

        client.onWebSocketError = (event) => {
          console.error('WebSocket connection error:', event);
        };

        client.activate();
        clientRef.current = client;
      } catch (error) {
        console.error('Erro ao inicializar WebSocket:', error);
      }
    };

    void conectar();

    return () => {
      ativo = false;
      void clientRef.current?.deactivate();
    };
  }, []);

  return clientRef;
}
