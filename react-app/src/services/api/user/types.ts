import { UUID } from "../../../types";
import { Role } from "../../../types/auth";
import { 
  PasswordResetSubmitEndpointResponse, 
  SignInEndpointEndpointResponse,
  GetUserEndpointResponse, 
  UpdateUserEndpointResponse,
  GetAllUsersEndpointResponse
} from "../../../types/responses";

export interface SignInConfig {
  username: string,
  password: string,
  onInit?: () => void,
  onError: (errorMessage: string) => void;
  onSuccess?: (response: SignInEndpointEndpointResponse) => void;
  onFinish?: () => void;
}

export interface SignUpConfig {
  username: string,
  password: string,
  email: string,
  name: string,
  onInit?: () => void,
  onError: (errorMessage: string) => void;
  onSuccess?: () => void;
  onFinish?: () => void;
}

export interface LogoutConfig {
  onInit?: () => void,
  onError: (errorMessage: string) => void;
  onSuccess?: () => void;
  onFinish?: () => void;
}

export interface InitiatePasswordRecoveryConfig {
  email: string,
  onInit?: () => void,
  onError: (errorMessage: string) => void;
  onFinish?: () => void;
}

export interface SubmitPasswordRecoveryConfig {
  password: string,
  token: UUID,
  onInit?: () => void,
  onError: (errorMessage: string) => void;
  onSuccess?: (response: PasswordResetSubmitEndpointResponse) => void;
  onFinish?: () => void;
}

export interface GetUserConfig {
  uuid: UUID,
  onInit?: () => void,
  onError: (errorMessage: string) => void;
  onSuccess?: (response: GetUserEndpointResponse) => void;
  onFinish?: () => void;
}

export interface UpdateUserConfig {
  uuid: UUID,
  username?: string,
  email?: string,
  name?: string,
  roleId?: Role,
  onInit?: () => void,
  onError: (errorMessage: string) => void;
  onSuccess?: (response: UpdateUserEndpointResponse) => void;
  onFinish?: () => void;
}

export interface GetAllUsersConfig {
  onInit?: () => void,
  onError: (errorMessage: string) => void;
  onSuccess?: (response: GetAllUsersEndpointResponse) => void;
  onFinish?: () => void;
}

export interface DeleteUserConfig {
  uuid: UUID,
  onInit?: () => void,
  onError: (errorMessage: string) => void;
  onSuccess?: () => void;
  onFinish?: () => void;
}