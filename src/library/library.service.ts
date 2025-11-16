import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class LibraryService {
  private readonly GOOGLE_BOOKS_API_URL = 'https://www.googleapis.com/books/v1/volumes';

  async search(query: string): Promise<any> {
    const response = await axios.get(this.GOOGLE_BOOKS_API_URL, {
      params: {
        q: query,
        key: process.env.GOOGLE_BOOKS_API_KEY,
      },
    });
    return response.data;
  }
}
