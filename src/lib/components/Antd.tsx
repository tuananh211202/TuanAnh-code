import { ConfigProvider } from "antd";

interface AntdProps {
  children: React.ReactNode;
}

export const Antd = ({ children }: AntdProps) => {
  return (
    <ConfigProvider>
      {children}
    </ConfigProvider>
  );
};
