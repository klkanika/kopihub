/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { UserRole } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: Login
// ====================================================

export interface Login_login {
  __typename: "LogUser";
  id: string;
  role: UserRole;
  userId: string;
  createdAt: any;
}

export interface Login {
  login: Login_login | null;
}

export interface LoginVariables {
  userName: string;
  password: string;
}
