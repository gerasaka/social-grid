export interface IPost {
  userId: number;
  id: number;
  title: string;
  body: string;
}

export interface IUser {
  id: number;
  name: string;
  username: string;
  email: string;
  address: { city: string };
  phone: string;
  website: string;
}

export interface IAlbum {
  userId: number;
  id: number;
  title: string;
}

export interface IPhoto {
  albumId: number;
  id: number;
  title: string;
  url: string;
  thumbnailUrl: string;
}
