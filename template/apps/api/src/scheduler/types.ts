import { JobAttributesData } from 'agenda';

export interface ExampleActionData extends JobAttributesData {
  isExample: boolean;
}

export interface ScheduleActionData extends JobAttributesData {
  isExample: boolean;
  createOn: Date | string;
}
