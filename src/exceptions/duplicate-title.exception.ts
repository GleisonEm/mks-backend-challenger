import { HttpException, HttpStatus } from '@nestjs/common';

export class DuplicateTitleException extends HttpException {
  constructor(title: string) {
    super(
      `A movie with the same title: | ${title} | already exists`,
      HttpStatus.BAD_REQUEST,
    );
  }
}
