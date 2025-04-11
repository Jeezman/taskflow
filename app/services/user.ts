import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export class UserService {
  private static instance: UserService;

  public static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
  }

  async getUserById(id: number) {
    return await db.query.users.findFirst({
      where: eq(users.id, id),
    });
  }

  async getUserFirstName(id: number) {
    const user = await this.getUserById(id);
    return user ? user.name.split(' ')[0] : '';
  }
}
