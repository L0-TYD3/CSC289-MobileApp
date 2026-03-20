import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class MessageResponse<T = null> {
  @ApiProperty({ type: Number, required: true })
  statusCode: number;

  @ApiProperty({ type: String, required: true })
  message: string;

  @ApiProperty({ type: Object, required: false, additionalProperties: true })
  data?: T;

  constructor(message: string, statusCode: number, data: T) {
    this.data = data;
    this.message = message;
    this.statusCode = statusCode;
  }
}

export class UpdatedMessageResponse extends MessageResponse<{ id: number }> {
  constructor(message: string, id: number) {
    super(message, HttpStatus.OK, { id });
  }
}

export class CreatedMessageResponse extends MessageResponse<{ id: number }> {
  constructor(message: string, id: number) {
    super(message, HttpStatus.CREATED, { id });
  }
}

export class DeletedMessageResponse extends MessageResponse<{ id?: number }> {
  constructor(message: string, id?: number) {
    super(message, HttpStatus.NO_CONTENT, { id });
  }
}
