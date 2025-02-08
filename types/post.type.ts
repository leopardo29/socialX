type PostType = {
  id: number;
  body: string;
  userId: number;
  comments: [];
  likeIds: number[];
  postImage: string;
  postVideo: string;
  postGif: string;
  createdAt: string;
  updatedAt: string;
  
  user: UserType;
  
};
