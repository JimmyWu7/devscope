import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

// Uses the default R2 CloudFlare url for viewing resumes
// export async function getSignedDownloadUrl(key: string) {
//   const command = new GetObjectCommand({
//     Bucket: process.env.R2_BUCKET_NAME!,
//     Key: key,
//   });

//   return await getSignedUrl(r2, command, { expiresIn: 60 * 5 });
// }
