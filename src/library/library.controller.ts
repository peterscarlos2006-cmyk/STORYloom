import { Controller, Get, Query } from '@nestjs/common';
import { LibraryService } from './library.service';

@Controller('library')
export class LibraryController {
  constructor(private readonly libraryService: LibraryService) {}

  @Get('search')
  async search(@Query('q') query: string) {
    return this.libraryService.search(query);
  }
}
