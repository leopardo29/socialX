type CommentType = {
    id: number;
    body: string;
    userId: number;
    postId: number;
    commentImage: string;
  
    commentVideo: string;
    commentGif: string;
    createdAt: string;
    updatedAt: string;
    user: UserType;
    post: PostType;
  };