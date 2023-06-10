/** @typedef {import('./types.js').FileUploaderCommands} Commands */
import crypto from 'node:crypto';
import config from '../../config.js';
import { imageUploaderInputSchema, imageUploaderOutputSchema } from './schema.js';
import { Storage } from '@google-cloud/storage';

const uploadFileToGoogleCloud = async (buffer) => {
  return new Promise((resolve, reject) => {
    const storage = new Storage({
      projectId: config.googleCloud.projectId,
      keyFilename: config.googleCloud.keyFilename,
    });

    const bucket = storage.bucket(config.googleCloud.bucketName);

    const fileName = `${crypto.randomUUID()}.jpeg`;
    const blob = bucket.file(fileName);
    const blobStream = blob.createWriteStream({
      resumable: false,
    });

    blobStream
      .on('finish', async () => {
        await bucket.file(fileName).makePublic();
        resolve({ link: blob.publicUrl() });
      })
      .on('error', (err) => {
        reject(err);
      });

    blobStream.end(buffer);
  });
};

/** @type Commands['uploadImage']  */
const uploadImage = {
  input: imageUploaderInputSchema,
  output: imageUploaderOutputSchema,
  handler: async (infra, { data: { image } }) => {
    const result = await uploadFileToGoogleCloud(await image.toBuffer());
    return result;
  },
};

export const commands = {
  uploadImage,
};
