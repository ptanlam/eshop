import { Observable } from 'rxjs';

const FilesService = jest.fn().mockReturnValue({
  getAllForOwner: jest.fn().mockReturnValue(
    new Observable((subscriber) => {
      subscriber.next({});
      subscriber.complete();
    }),
  ),
  uploadForOwner: jest.fn().mockReturnValue({}),
});
export default FilesService();
