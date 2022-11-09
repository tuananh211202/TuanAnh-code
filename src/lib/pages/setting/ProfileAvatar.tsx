import { Space, Button, Input, Form } from "antd";
import { cancelAvatar, saveAvatar } from "lib/actions/buttonStatus";
import { setName } from "lib/actions/updateName";
import { successMessage } from "lib/components/ShowMesssage";
import { db } from "lib/database/config";
import { useEffect, useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";

export const ProfileAvatar = (props) => {
  const [form] = Form.useForm();
  
  const status = typeof(form.getFieldsValue().name);
  if (status === "undefined") form.setFieldsValue(props);

  const button = useSelector((state) => state.button);
  const dispatch = useDispatch();
  useEffect(() => {
    if (button.save.avatar === 1) {
      form.submit();
      dispatch(saveAvatar());
      console.log("Save avatar");
      successMessage("Lưu thành công", 5);
    }
    if (button.cancel.avatar === 1) {
      form.resetFields();
      dispatch(cancelAvatar());
      console.log("Cancel avatar");
    }
  }, [button]);

  const onFinish = () => {
    console.log(form.getFieldsValue());
    dispatch(setName(form.getFieldValue("name")));
    db.relatives.update(1, form.getFieldsValue());
    console.log("update");
  }

  return (
    <Space
      direction="vertical"
      size="large"
      className="w-full flex justify-center items-center content-center"
    >
      <FaUserCircle size={120} />
      <Button type="primary" style={{ borderRadius: "15px", fontSize: "15px" }}>
        Thay đổi ảnh đại diện
      </Button>
      <Form form={form} onFinish={onFinish}>
        <Form.Item name="name" rules={[{required: true, message: "Hãy nhập tên của bạn!!!"}]}>
          <Input
            placeholder="Họ và tên"
            style={{
              textAlign: "center",
              fontSize: "20px",
              width: "400px",
              borderColor: "black",
            }}
          ></Input>
        </Form.Item>
      </Form>
    </Space>
  );
};
