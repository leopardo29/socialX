type UserType = {
    id: number;  // Cambiar id a number si la base de datos lo maneja como número
    name: string;
    username: string;
    bio?: string;
    email: string;
    dateOfBirth: Date | null;
    emailVerified: Date | null;
    coverImage?: string;
    profileImage?: string;
    comments: CommentType[];
    
    createdAt: Date;
    updatedAt: Date;
    followingIds: number[];
    hasNotification: boolean | null;
    isVerified?: boolean;
    followersCount?: number;
    subscription: {
      plan: string;
    } | null;
  };
  