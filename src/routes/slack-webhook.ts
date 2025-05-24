import { Router, Request, Response } from "express";
import { SlackWebhookController } from "../controllers/slack-webhook-controller";

const router = Router();
const slackController = new SlackWebhookController();

router.post("/", (req: Request, res: Response) => {
  slackController.handleWebhook(req, res);
});

export { router as slackWebhookRouter };
