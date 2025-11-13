import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bullmq';
import { PrismaService } from '../prisma/prisma.service';
import Replicate from 'replicate';

interface CoverJobData {
  coverAssetId: string;
  prompt: string;
}

@Processor('cover-queue')
export class CoverProcessor {
  private replicate: Replicate;

  constructor(private prisma: PrismaService) {
    this.replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });
  }

  @Process('generate-cover')
  async handleCoverGeneration(job: Job<CoverJobData>) {
    const { coverAssetId, prompt } = job.data;
    await job.updateProgress(10);

    try {
      // 1. Update status to 'processing' (we can add status to CoverAsset model if needed)
      // For now, we'll just update when it's done.

      // 2. Call Replicate
      const model =
        'stability-ai/stable-diffusion:ac732df83cea7fff18b8472768c88ad041fa750ff7682a21affe81863cbe77e4';
      const input = { prompt: prompt, num_outputs: 1 };

      const output = (await this.replicate.run(model as any, { input })) as any;
      const imageUrl = Array.isArray(output) ? output[0] : output;
      await job.updateProgress(80);

      // 3. Upload to S3 and get URL (This is a placeholder. Implement S3 upload logic)
      const s3Url = await this.uploadToS3(imageUrl);
      await job.updateProgress(90);

      // 4. Update CoverAsset in DB
      await this.prisma.coverAsset.update({
        where: { id: coverAssetId },
        data: { s3Url },
      });
      await job.updateProgress(100);
    } catch (error) {
      console.error('Cover generation failed:', error);
      // Handle failure
    }
  }

  private async uploadToS3(imageUrl: string): Promise<string> {
    // Placeholder for S3 upload logic.
    // You would fetch the image from imageUrl, then upload it to your S3 bucket.
    // For now, return the original URL.
    console.log(`Uploading ${imageUrl} to S3...`);
    return imageUrl;
  }
}