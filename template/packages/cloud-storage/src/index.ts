import { CloudStorageService } from './service';

export { CloudStorageService, type BackendFile } from './service';

export const cloudStorageService = new CloudStorageService();

export default cloudStorageService;
