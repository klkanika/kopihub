/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { UserRole } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: UpdateLogUser
// ====================================================

export interface UpdateLogUser_updateOneLogUser {
  __typename: "LogUser";
  id: string;
  role: UserRole;
  userId: string;
}

export interface UpdateLogUser {
  updateOneLogUser: UpdateLogUser_updateOneLogUser | null;
}

export interface UpdateLogUserVariables {
  id: string;
  role: UserRole;
}
