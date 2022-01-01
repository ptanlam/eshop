import { Inject, Injectable } from '@nestjs/common';
import { from, mergeMap, of, toArray } from 'rxjs';
import { File } from 'src/files/entities/file.entity';
import { v4 as uuidV4 } from 'uuid';
import { filesRepositoryProvideToken } from '../constants';

@Injectable()
export class FilesService {
  constructor(
    @Inject(filesRepositoryProvideToken)
    private _filesRepository: typeof File,
  ) {}

  saveFiles(ownerId: string, urls: Array<string>) {
    return from(urls).pipe(
      mergeMap((url) => this.saveFile(ownerId, url).pipe(toArray())),
    );
  }

  getAllForOwner(ownerId: string) {
    return from(this._filesRepository.findAll({ where: { ownerId } })).pipe(
      mergeMap((files) => from(files)),
      toArray(),
    );
  }

  private saveFile(ownerId: string, url: string) {
    return of(this._filesRepository.build({ id: uuidV4(), ownerId, url })).pipe(
      mergeMap((file) => from(file.save())),
    );
  }
}
