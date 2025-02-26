import { z } from "zod";
import { MESSAGES } from "@/config/messages";

export const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, MESSAGES.INVALID_DATE_FORMAT);
