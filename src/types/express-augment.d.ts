declare global {
  namespace Express {
    interface Request {
      user: {
        id: string;
        name: string;
        email: string;
        verifiedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
      };

      userId: string;
      sessionId: string;
    }
  }
}

export {};
