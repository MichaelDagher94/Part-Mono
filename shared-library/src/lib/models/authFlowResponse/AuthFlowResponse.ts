import { UserInfo } from "../userInfo/UserInfo";
import { UserTokens } from "../userTokens/UserTokens";

export interface AuthFlowResponse {
  userInfo:   UserInfo;
  userTokens: UserTokens;
}