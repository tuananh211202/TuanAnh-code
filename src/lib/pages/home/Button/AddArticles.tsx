import {
  Button,
  Col,
  Row,
  Typography,
  Form,
  Radio,
  Input,
  Divider,
  DatePicker,
  Modal,
} from "antd";
import { useState } from "react";
import { UserAddOutlined } from "@ant-design/icons";
import { CalendarOutlined, MoreOutlined } from "@ant-design/icons";
import moment from "moment";
const AddArticlesButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
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
        Thêm kỷ niệm
      </Button>
      <Modal
        title="Thêm kỷ niệm"
        visible={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Hủy
          </Button>,
          <Button key="submit" type="primary" onClick={handleOk}>
            Thêm kỷ niệm
          </Button>,
        ]}
      >
        <Form layout="vertical" style={{ margin: "15px" }}>
          <Form.Item label="Ngày kỷ niệm">
            <DatePicker
              placeholder="Chọn ngày"
              defaultValue={moment("21/12/2002", "DD/MM/YYYY")}
              format="DD/MM/YYYY"
              style={{ height: "50px", width: "100%" }}
            ></DatePicker>
          </Form.Item>
          <Form.Item label="Kỷ niệm">
            <Input placeholder="Kỷ niệm" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default AddArticlesButton;
