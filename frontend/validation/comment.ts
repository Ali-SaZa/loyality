import { z } from "zod";

export const CommentFormValidation = z.object({
  comment: z.string().min(1, "نوشتن متن نظر الزامی است."),
});
