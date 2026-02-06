import { NOTIFICATION_TYPE_ENUM } from "@af-charizard/sdk-types";
import { request } from "../helpers";

export type IRequestResource = {
  message: string;
  title: string;
  userId: number; //收件人
  type: NOTIFICATION_TYPE_ENUM;
};

export type IResponseResource = void;

export const notification$create = (data: IRequestResource) =>
  request.request<IResponseResource>({
    url: "/notification/create",
    method: "post",
    data,
  });
