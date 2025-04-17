// src/routes/conversations.ts
import { Router } from "express";
import {
  getConversationsController,
  getConversationMessagesController,
  createConversationController,
} from "../controllers/conversation.controller";
import { authenticateToken } from "../middleware/auth.middleware";

const router = Router();

router.get(
  "/conversations",
  authenticateToken,
  getConversationsController
);
router.get(
  "/conversations/:id/messages",
  authenticateToken,
  getConversationMessagesController
);
router.post(
  "/conversations",
  authenticateToken,
  createConversationController
);

export default router;
