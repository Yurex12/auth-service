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
        roleId: string;
        role: {
          id: string;
          name: string;
        };
      };

      userId: string;
      sessionId: string;
    }
  }
}

export {};
