import cors from "@fastify/cors";
import Fastify from "fastify";
import { Server as SocketIOServer } from "socket.io";

import { config } from "./lib/config.js";
import { registerDashboardRoutes } from "./routes/dashboard.js";
import { startRealtimeEngine } from "./services/realtime-engine.js";

const app = Fastify({
  logger: true
});

await app.register(cors, {
  origin: true
});

await registerDashboardRoutes(app);

const io = new SocketIOServer(app.server, {
  cors: {
    origin: "*"
  }
});

io.on("connection", (socket) => {
  app.log.info({ socketId: socket.id }, "client connected");
});

startRealtimeEngine(io);

await app.listen({
  port: config.port,
  host: "0.0.0.0"
});
