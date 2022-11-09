import { Button, Form, Radio, Input, Modal, DatePicker, Select } from "antd";
import { useState } from "react";
import { UserAddOutlined } from "@ant-design/icons";
import moment from "moment";
import { db } from "lib/database/config";

const { Option } = Select;

const AddRelativesButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const [type, setType] = useState("parent");
  const onChange = (value) => {
    setType(value);
  };
  const onFinish = async () => {
    const yourRel = {
      name: form.getFieldValue("name"),
      other_name: "",
      email: form.getFieldValue("email"),
      phone: form.getFieldValue("phone"),
      gender: form.getFieldValue("gender"),
      origin: form.getFieldValue("origin"),
      birthday:
        typeof form.getFieldValue("birthday") === "undefined"
          ? "01/01/2010"
          : form.getFieldValue("birthday").format("DD/MM/YYYY"),
      type: type,
    };
    console.log(yourRel);
    await db.relatives.add(yourRel);
  };

  const handleOk = () => {
    form.submit();
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    form.resetFields();
    setIsModalOpen(false);
  };
  return (
    <>
      <Button
        type="primary"
        shape="round"
        size="large"
        icon={<UserAddOutlined />}
        onClick={() => setIsModalOpen(true)}
      >
        Thêm họ hàng ruột thịt
      </Button>
      <Modal
        title="Thêm họ hàng ruột thịt"
        visible={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Hủy
          </Button>,
          <Button key="submit" type="primary" onClick={handleOk}>
            Thêm họ hàng
          </Button>,
        ]}
      >
        <Form
          form={form}
          onFinish={onFinish}
          layout="vertical"
          style={{ margin: "15px" }}
        >
          <Form.Item
            name="name"
            label="Họ và tên"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input placeholder="Họ và tên" />
          </Form.Item>
          <Form.Item
            name="email"
            label="Địa chỉ Email"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input placeholder="Địa chỉ Email" />
          </Form.Item>
          <Form.Item
            name="phone"
            label="Số điện thoại"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input placeholder="Số điện thoại" />
          </Form.Item>
          <Form.Item
            name="gender"
            label="Giới tính"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Radio.Group>
              <Radio value="male">Nam</Radio>
              <Radio value="female">Nữ</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item name="type" label="Tên quan hệ">
            <Select
              defaultValue="parent"
              onChange={onChange}
              style={{ width: "100%" }}
            >
              <Option value="parent">Bố mẹ</Option>
              <Option value="child">Con cái</Option>
              <Option value="spouse">Vợ chồng</Option>
              <Option value="next_sibling">Anh em ruột</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="origin"
            label="Quê quán"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input placeholder="Quê quán" />
          </Form.Item>
          <Form.Item
            name="birthday"
            label="Ngày sinh"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <DatePicker format="DD/MM/YYYY" style={{ width: "100%" }} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default AddRelativesButton;
