#!/bin/bash
cd /home/danish/tst
echo "Starting Snake Duel game..."
echo "Game will be available at: http://localhost:5174"
echo "Press Ctrl+C to stop the server"
npm run dev -- --host 0.0.0.0
