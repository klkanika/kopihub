/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { TaskStatus } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: CreateTask
// ====================================================

export interface CreateTask_createOneTask {
  __typename: "Task";
  id: string;
  name: string;
  countTime: number;
  finishTime: any;
  status: TaskStatus;
  priority: number;
}

export interface CreateTask {
  createOneTask: CreateTask_createOneTask;
}

export interface CreateTaskVariables {
  name: string;
  total: number;
  finishTime: any;
  countTime: number;
  priority: number;
  updatedBy: string;
  user: string;
}
