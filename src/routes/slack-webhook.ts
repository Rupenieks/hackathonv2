import { Router, Request, Response } from "express";
import { SlackWebhookController } from "../controllers/slack-webhook-controller";
import { Server as SocketServer } from "socket.io";

export function createSlackWebhookRouter(io: SocketServer) {
  const router = Router();
  const slackController = new SlackWebhookController(io);

  router.post("/", (req: Request, res: Response) => {
    slackController.handleWebhook(req, res);
  });

  return router;
}
