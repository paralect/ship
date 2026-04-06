/**
 * PopulateUtil - MongoDB Aggregation Pipeline Builder for Populate Operations
 * 
 * This utility class provides methods to build MongoDB aggregation pipelines
 * for populating related documents from other collections. It supports various
 * populate scenarios including simple fields, arrays, and nested objects.
 */

import { Document } from 'mongodb';
import { PopulateOptions } from '../types';

export default class PopulateUtil {
  /**
   * Builds a complete aggregation pipeline for populate operations
   */
  static buildPipeline(
    filter: Document,
    populateOptions: PopulateOptions | PopulateOptions[],
  ): Document[] {
    const options = Array.isArray(populateOptions) ? populateOptions : [populateOptions];
    
    // Validate all options first
    this.validateOptions(options);
    
    const pipeline: Document[] = [{ $match: filter }];
    
    options.forEach((option) => {
      const stages = this.buildPopulateStages(option);
      pipeline.push(...stages);
    });
    
    return pipeline;
  }

  /**
   * Validates populate options for required fields
   * 
   * @example
   * // Throws error if missing collection, fieldName, or localField
   * this.validateOptions([{ localField: 'authorId' }]); // Error
   */
  private static validateOptions(options: PopulateOptions[]): void {
    options.forEach((option, index) => {
      if (!option?.collection || !option?.fieldName || !option?.localField) {
        throw new Error(
          `Invalid populate option at index ${index}: missing required fields (collection, fieldName, or localField)`,
        );
      }
    });
  }

  /**
   * Builds pipeline stages for a single populate option
   * Routes to appropriate stage builder based on localField type
   * 
   * @example
   * // Routes string -> buildSimpleFieldStages
   * // Routes { name, isArray, path } -> buildArrayOfObjectsStages
   * // Routes { name, isArray } -> buildArrayOfIdsStages
   * // Routes { name, path } -> buildNestedObjectStages
   * // Routes { name } -> buildSimpleFieldStages
   */
  private static buildPopulateStages(option: PopulateOptions): Document[] {
    const { collection: fromCollection, fieldName, localField, foreignField = '_id' } = option;

    if (typeof localField === 'string') {
      return this.buildSimpleFieldStages(fromCollection, localField, foreignField, fieldName);
    }

    const { name, isArray, path } = localField;

    if (isArray && path) {
      return this.buildArrayOfObjectsStages(fromCollection, name, path, foreignField, fieldName);
    } else if (isArray) {
      return this.buildArrayOfIdsStages(fromCollection, name, foreignField, fieldName);
    } else if (path) {
      return this.buildNestedObjectStages(fromCollection, name, path, foreignField, fieldName);
    } else {
      return this.buildSimpleFieldStages(fromCollection, name, foreignField, fieldName);
    }
  }

  /**
   * Builds stages for simple field lookup (single document result)
   * 
   * @example
   * // Input: { authorId: 'user123' }
   * // Output: { author: { _id: 'user123', name: 'John' } }
   * buildSimpleFieldStages('users', 'authorId', '_id', 'author')
   */
  private static buildSimpleFieldStages(
    fromCollection: string,
    localField: string,
    foreignField: string,
    fieldName: string,
  ): Document[] {
    return [
      {
        $lookup: {
          from: fromCollection,
          localField,
          foreignField,
          as: fieldName,
        },
      },
      {
        $addFields: {
          [fieldName]: {
            $arrayElemAt: [`$${fieldName}`, 0],
          },
        },
      },
    ];
  }

  /**
   * Builds stages for array of IDs lookup (array result)
   * 
   * @example
   * // Input: { authorIds: ['user1', 'user2'] }
   * // Output: { authors: [{ _id: 'user1' }, { _id: 'user2' }] }
   * buildArrayOfIdsStages('users', 'authorIds', '_id', 'authors')
   */
  private static buildArrayOfIdsStages(
    fromCollection: string,
    localField: string,
    foreignField: string,
    fieldName: string,
  ): Document[] {
    return [
      {
        $lookup: {
          from: fromCollection,
          localField,
          foreignField,
          as: fieldName,
        },
      },
    ];
  }

  /**
   * Builds stages for array of objects lookup (merge with populated data)
   * 
   * @example
   * // Input: { authorRefs: [{ _id: 'user1', role: 'primary' }] }
   * // Output: { authors: [{ _id: 'user1', name: 'John', role: 'primary' }] }
   * buildArrayOfObjectsStages('users', 'authorRefs', '_id', '_id', 'authors')
   */
  private static buildArrayOfObjectsStages(
    fromCollection: string,
    localField: string,
    path: string,
    foreignField: string,
    fieldName: string,
  ): Document[] {
    const tempField = `${localField}_extracted`;
    const lookupField = `${fieldName}_lookup`;
    
    return [
      {
        $addFields: {
          [tempField]: {
            $map: {
              input: `$${localField}`,
              as: 'item',
              in: `$$item.${path}`,
            },
          },
        },
      },
      {
        $lookup: {
          from: fromCollection,
          localField: tempField,
          foreignField,
          as: lookupField,
        },
      },
      {
        $addFields: {
          [fieldName]: {
            $map: {
              input: `$${localField}`,
              as: 'originalItem',
              in: {
                $mergeObjects: [
                  '$$originalItem',
                  {
                    $arrayElemAt: [
                      {
                        $filter: {
                          input: `$${lookupField}`,
                          as: 'lookupItem',
                          cond: { $eq: ['$$lookupItem._id', `$$originalItem.${path}`] },
                        },
                      },
                      0,
                    ],
                  },
                ],
              },
            },
          },
        },
      },
      {
        $unset: [tempField, lookupField],
      },
    ];
  }

  /**
   * Builds stages for nested object lookup (merge with populated data)
   * 
   * @example
   * // Input: { authorObj: { _id: 'user1', role: 'primary', joinedOn: '2025-01-01' } }
   * // Output: { author: { _id: 'user1', name: 'John', role: 'primary', joinedOn: '2025-01-01' } }
   * buildNestedObjectStages('users', 'authorObj', '_id', '_id', 'author')
   */
  private static buildNestedObjectStages(
    fromCollection: string,
    localField: string,
    path: string,
    foreignField: string,
    fieldName: string,
  ): Document[] {
    const tempField = `${localField}_extracted`;
    const lookupField = `${fieldName}_lookup`;
    
    return [
      {
        $addFields: {
          [tempField]: `$${localField}.${path}`,
        },
      },
      {
        $lookup: {
          from: fromCollection,
          localField: tempField,
          foreignField,
          as: lookupField,
        },
      },
      {
        $addFields: {
          [fieldName]: {
            $mergeObjects: [
              `$${localField}`,
              {
                $arrayElemAt: [`$${lookupField}`, 0],
              },
            ],
          },
        },
      },
      {
        $unset: [tempField, lookupField],
      },
    ];
  }
} 
