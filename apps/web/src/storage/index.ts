import StorageConfig from "@/config/StorageConfig";
import { env } from "@/env";
import { Client, ID, Storage } from "appwrite";

const client = new Client()
  .setEndpoint(env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
  .setProject(env.NEXT_PUBLIC_APPWRITE_PROJECT_ID);

const storage = new Storage(client);

export const storeImage = (file: File) => {
  const fileId = ID.unique();
  return storage.createFile(StorageConfig.bucketId, fileId, file);
};

export const deleteImage = (fileId: string) => {
  return storage.deleteFile(StorageConfig.bucketId, fileId);
};

export const getImage = (imageId: string) => {
  return storage.getFileView(StorageConfig.bucketId, imageId).toString();
};
