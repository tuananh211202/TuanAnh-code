import {
  Button,
  Form,
  Input,
  Modal,
  List,
  Avatar,
  Checkbox,
  Select,
  Space,
  Popover,
} from "antd";
const { Option } = Select;
import type { CheckboxChangeEvent } from "antd/es/checkbox";
import { MoreOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { CalendarOutlined } from "@ant-design/icons";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "lib/database/config";
import { FaUserCircle } from "react-icons/fa";
import Meta from "antd/lib/card/Meta";
import { ROLE } from "lib/utils/common";
const { Search } = Input;
const ConnectRelativesButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const exampleList = [
    {
      id: 1,
      img: "https://source.unsplash.com/random",
      name: "Nguyen Thi Me",
      relative: 1,
    },
    {
      id: 2,
      img: "https://source.unsplash.com/random",
      name: "Nguyen Van Bo",
      relative: 0,
    },
    {
      id: 3,
      img: "https://source.unsplash.com/random",
      name: "Nguyen Van Bo",
      relative: 0,
    },
  ];
  const onSelectionChange = (e: CheckboxChangeEvent) => {
    console.log(`checked = ${e.target.checked}`);
  };
  const handleRelationshipChange = (value: string) => {
    console.log(`selected ${value}`);
  };
  const [form] = Form.useForm();
  const onFinish = async (values: any) => {};

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };
  const handleOk = () => {
    if (currentStep == 2) {
      form.submit();
      setIsModalOpen(false);
    }
    setCurrentStep(3 - currentStep);
  };

  const handleCancel = () => {
    if (currentStep == 1) {
      setIsModalOpen(false);
    }
    if (currentStep == 2) {
      setCurrentStep(3 - currentStep);
    }
  };
  const exampleData = useLiveQuery(() => db.relatives.toArray(), []);
  const [relatives, setRelatives] = useState(exampleData?.slice(1));
  useEffect(() => setRelatives(exampleData?.slice(1)), [exampleData]);

  const onSearch = (value) => {
    setRelatives(
      exampleData?.slice(1).filter((item) => item.name.includes(value))
    );
  };
  return (
    <>
      <Button
        type="primary"
        shape="round"
        size="large"
        icon={<CalendarOutlined />}
        onClick={() => setIsModalOpen(true)}
      >
        Kết nối trực hệ
      </Button>
      <Modal
        title={`Bước ${currentStep == 1 ? "1" : "2"}/2: ${
          currentStep == 1
            ? "Lựa chọn người thân muốn kết nối"
            : "Xác định mối quan hệ"
        }`}
        visible={isModalOpen}
        closable={false}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            {currentStep == 2 ? "Quay lại" : "Hủy"}
          </Button>,
          <Button key="ok" type="primary" onClick={handleOk}>
            {currentStep == 2 ? "Kết nối" : "Tiếp theo"}
          </Button>,
        ]}
      >
        {currentStep == 1 ? (
          <Form layout="vertical" style={{ margin: "15px" }}>
            <Form.Item label="Tìm kiếm">
              <Search placeholder="input search text" onSearch={onSearch} />
            </Form.Item>
            <Form.Item label="Danh sách tìm thấy">
              <Space direction="vertical" size="small" className="w-full">
                {relatives?.map((item) => (
                  <div
                    className="flex justify-between mx-4 my-2"
                    key={relatives.indexOf(item)}
                  >
                    <Meta
                      avatar={<FaUserCircle size={36} />}
                      title={item.name}
                      description={ROLE[item.gender][item.type]}
                    />
                    <Checkbox onChange={onSelectionChange} />
                  </div>
                ))}
              </Space>
            </Form.Item>
          </Form>
        ) : (
          <Form
            layout="vertical"
            style={{ margin: "15px" }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            form={form}
          >
            <Form.Item label="Chọn mối quan hệ">
              <Select
                defaultValue="Bố"
                style={{
                  width: 120,
                }}
                onChange={handleRelationshipChange}
              >
                <Option value="Bố">Bố</Option>
                <Option value="Mẹ">Mẹ</Option>
                <Option value="Con">Con</Option>
              </Select>
            </Form.Item>
          </Form>
        )}
      </Modal>
    </>
  );
};
export default ConnectRelativesButton;
