import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class ImageUploaderService {
  private readonly IMGUR_API_URL: string = process.env.IMGUR_API_URL ?? '';
  private readonly CLIENT_ID: string = process.env.IMGUR_CLIENT_ID ?? '';

  async uploadImage(base64: string): Promise<string> {
    if (!this.IMGUR_API_URL || !this.CLIENT_ID) {
      throw new Error(
        'IMGUR_API_URL or IMGUR_CLIENT_ID environment variable is not set.',
      );
    }
    const response = await axios.post(
      this.IMGUR_API_URL,
      {
        image: base64,
        type: 'base64',
      },
      {
        headers: {
          Authorization: `Client-ID ${this.CLIENT_ID}`,
        },
      },
    );

    return response.data.data.link;
  }
}
