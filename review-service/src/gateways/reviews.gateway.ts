import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { ReviewCreationDto } from '../apis/dtos';
import { ReviewsService } from '../domain/services';

@WebSocketGateway()
export class ReviewsGateway {
  @WebSocketServer()
  private readonly _server!: Server;

  constructor(private readonly _reviewsService: ReviewsService) {}

  @SubscribeMessage('add-review')
  handleNewReview(@MessageBody() dto: ReviewCreationDto) {
    this._server.sockets.emit(`receive-new-review-for-${dto.targetId}`, dto);
    return this._reviewsService.addReview(dto);
  }
}
