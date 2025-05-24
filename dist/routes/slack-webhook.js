"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.slackWebhookRouter = void 0;
const express_1 = require("express");
const slack_webhook_controller_1 = require("../controllers/slack-webhook-controller");
const router = (0, express_1.Router)();
exports.slackWebhookRouter = router;
const slackController = new slack_webhook_controller_1.SlackWebhookController();
router.post("/", (req, res) => {
    slackController.handleWebhook(req, res);
});
