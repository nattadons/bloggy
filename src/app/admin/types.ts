// Define Comment type
export type Comment = {
    id: string;
    content: string;
    createdAt: string;
    authorId: string;
    author: {
      id: string;
      name?: string | null;
      image?: string | null;
    };
  };