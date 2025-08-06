import { Message } from "@/model/User";

export interface ApiResponse {
  success: boolean;
  message: string;
  isAcceptingMessages?: boolean;
  messages?: Array<Message>;
};

// // base
// interface BaseResponse {
//   success: boolean;
//   message: string;
// }

// // specific responses
// interface MessageResponse extends BaseResponse {
//   isAcceptingMessages?: boolean;
//   messages?: Message[];
// }

// interface AuthResponse extends BaseResponse {
//   token: string;
//   user: User;
// }