import { Button, Form, Radio, Input, Modal, DatePicker, Select } from "antd";
import { useState } from "react";
import { UserAddOutlined } from "@ant-design/icons";
import moment from "moment";
import { db } from "lib/database/config";
import { CommandButton } from "lib/components/Button/CommandButton";
import { FaEdit } from "react-icons/fa";
import { useLiveQuery } from "dexie-react-hooks";
import { IRelatives } from "lib/types/relatives";

const { Option } = Select;

const EditRelativeModal = (props) => {
  const id = props.id;
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
  const iconStyles = {
    display: "table",
    margin: "0 auto",
    fontSize: "22px",
    color: "black",
  };
  const relative = useLiveQuery(() => db.relatives.where({id:id}).first());
  const [sex, setSex] = useState("male");
  return (
    <>
      <CommandButton
        icon={<FaEdit style={iconStyles} />}
        text="Chỉnh sửa"
        textSize="10px"
        color="black"
        width="72px"
        onClick={() => setIsModalOpen(true)}
      ></CommandButton>
      <Modal
        title="Chỉnh sửa thông tin họ hàng"
        visible={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Hủy
          </Button>,
          <Button key="submit" type="primary" onClick={handleOk}>
            Lưu
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
            <Input defaultValue={relative?.name} />
          </Form.Item>
          <Form.Item
            name="email"
            label="Địa chỉ Email"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input defaultValue={relative?.email} />
          </Form.Item>
          <Form.Item
            name="phone"
            label="Số điện thoại"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input defaultValue={relative?.phone} />
          </Form.Item>
          <Form.Item
            name="gender"
            label="Giới tính"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Radio.Group
                    value={relative?.gender}
                    onChange={(e) => {
                      setSex(e.target.value);
                    }}
                    style={{ height: "50px" }}
                  >
                    <Radio value="male">Nam</Radio>
                    <Radio value="female">Nữ</Radio>
                  </Radio.Group>
          </Form.Item>
          <Form.Item
            name="origin"
            label="Quê quán"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input defaultValue={relative?.origin} />
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

export default EditRelativeModal;
