export interface Comment {
  _id: string;
  content: string;
  owner: {
    username: string;
    _id: string
  };
}