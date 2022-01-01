import { Controller, Inject, Logger, OnModuleInit } from '@nestjs/common';
import { ClientGrpc, RpcException } from '@nestjs/microservices';
import { reactionsPackageProvideToken } from '../../constants';
import {
  GetReactionsForTargetRequest,
  GetReactionsForTargetResponse,
} from '../interfaces';
import { catchError, map, Observable, of, tap } from 'rxjs';

interface IReactionsService {
  getAllForTarget(
    request: GetReactionsForTargetRequest,
  ): Observable<GetReactionsForTargetResponse>;
}

@Controller()
export class ReactionsService implements OnModuleInit, IReactionsService {
  private _service!: IReactionsService;
  private readonly _logger = new Logger(ReactionsService.name);

  constructor(
    @Inject(reactionsPackageProvideToken)
    private readonly _client: ClientGrpc,
  ) {}

  onModuleInit() {
    this._service = this._client.getService<IReactionsService>(
      ReactionsService.name,
    );
  }

  getAllForTarget(
    request: GetReactionsForTargetRequest,
  ): Observable<GetReactionsForTargetResponse> {
    return this._service.getAllForTarget({ id: request.id }).pipe(
      catchError((error: RpcException) =>
        of(error).pipe(
          tap((error) => this._logger.error(error.message)),
          map(() => ({ reactions: [] })),
        ),
      ),
    );
  }
}
