import { z } from "zod";

const textPartSchema = z.object({
  text: z.string().min(1).max(2000),
  type: z.enum(["text"]),
});

const mcpServerSchema = z.object({
  name: z.string().min(1).max(2000),
  url: z.string().url(),
  transportType: z.enum(["sse", "http"]).optional().default("sse"),
  headers: z.array(
    z.object({
      key: z.string().min(1).max(2000),
      value: z.string().min(1).max(2000),
    })
  ),
});

export const postRequestBodySchema = z.object({
  id: z.string().uuid(),
  mcpServers: z.array(mcpServerSchema).optional(),
  message: z.object({
    id: z.string().uuid(),
    createdAt: z.coerce.date(),
    role: z.enum(["user"]),
    content: z.string().min(1).max(2000),
    parts: z.array(textPartSchema),

    experimental_attachments: z
      .array(
        z.object({
          url: z.string().url(),
          name: z.string().min(1).max(2000),
          contentType: z.enum(["image/png", "image/jpg", "image/jpeg"]),
        })
      )
      .optional(),
  }),
  selectedChatModel: z.enum(["chat-model", "chat-model-reasoning"]),
  selectedVisibilityType: z.enum(["public", "private"]),
});

export type PostRequestBody = z.infer<typeof postRequestBodySchema>;
