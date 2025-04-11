import { getSession as getNextSession } from '@/lib/auth/session';

export class SessionService {
  private static instance: SessionService;

  public static getInstance(): SessionService {
    if (!SessionService.instance) {
      SessionService.instance = new SessionService();
    }
    return SessionService.instance;
  }

  async getCurrentSession() {
    return await getNextSession();
  }

  async getCurrentUserId() {
    const session = await this.getCurrentSession();
    return session ? parseInt(session.user.id) : null;
  }
}
