import { ObjectSchema } from 'joi';
import {
  CollectionOptions,
  CreateCollectionOptions,
} from 'mongodb';

export default interface ServiceOptions {
  addCreatedOnField?: boolean;
  addUpdatedOnField?: boolean;
  outbox?: boolean;
  schema?: ObjectSchema<any>;
  collectionOptions?: CollectionOptions;
  collectionCreateOptions?: CreateCollectionOptions;
  requireDeletedOn?: boolean;
}
