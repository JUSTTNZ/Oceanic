import { UserDocument } from "../../models/user.model";

declare global {
  namespace Express {
    interface Request {
      supabaseUser?: { id: string; email: string | null };
      profile: UserDocument; // required now
    }
  }
}
