import { message } from "antd";

const key = "zisan";

export const successMessage = (info, duration = 4) => {
  message.success({ content: info, key, duration });
};

export const loadingMessage = (info) => {
  message.loading({ content: info, key });
};

export const errorMessage = (info, duration = 4) => {
  message.error({ content: info, key, duration });
};
