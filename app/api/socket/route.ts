import { NextResponse } from 'next/server';
import { Server } from 'socket.io';
import { Server as NetServer } from 'http';
import type { NextApiRequest } from 'next';

const ioGlobal = (global as any).io || null;

export async function GET() {
  if (!ioGlobal) {
    console.log('[SOCKET.IO] Initializing server...');

    const server: NetServer = (global as any).server;
    const io = new Server(server, {
      path: '/api/socket',
    });

    io.on('connection', (socket) => {
      console.log(`[SOCKET.IO] Connected: ${socket.id}`);

      socket.on('join-room', (roomId: string) => {
        socket.join(roomId);
        console.log(`[SOCKET.IO] ${socket.id} joined ${roomId}`);
      });

      socket.on('send-update', ({ roomId, payload }) => {
        socket.to(roomId).emit('receive-update', payload);
      });

      socket.on('disconnect', () => {
        console.log(`[SOCKET.IO] Disconnected: ${socket.id}`);
      });
    });

    (global as any).io = io;
  }

  return NextResponse.json({ status: 'ok' });
}
 