/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { TaskStatus } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL query operation: GetTaskAll
// ====================================================

export interface GetTaskAll_tasks {
  __typename: "Task";
  id: string;
  name: string;
  countTime: number;
  finishTime: any;
  status: TaskStatus;
  priority: number;
  total: number;
}

export interface GetTaskAll {
  tasks: GetTaskAll_tasks[];
}
