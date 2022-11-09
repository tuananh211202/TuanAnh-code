import {
  Form,
  Space,
  Row,
  Typography,
  Col,
  Input,
  Radio,
  DatePicker,
} from "antd";
import { FaUserCircle } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { cancelSection, saveSection } from "lib/actions/buttonStatus";
import { db } from "lib/database/config";
import moment from "moment";
import { loadingMessage, successMessage } from "lib/components/ShowMesssage";
import { useRouter } from "next/router";

export const ProfileSection = (props) => {
  const [form] = Form.useForm();
  const [sex, setSex] = useState("male");

  const status = typeof form.getFieldsValue().email;
  console.log(status);
  if (status === "undefined")
    form.setFieldsValue({
      ...props,
      birthday: moment(props.birthday, "DD/MM/YYYY"),
    });

  const button = useSelector((state) => state.button);
  const dispatch = useDispatch();
  const router = useRouter();
  useEffect(() => {
    if (button.save.section === 1) {
      form.submit();
      dispatch(saveSection());
      console.log("Save section");
      successMessage("Lưu thành công", 5);
    }
    if (button.cancel.section === 1) {
      form.resetFields();
      dispatch(cancelSection());
      console.log("Cancel section");
      router.push("/profile");
    }
  }, [button]);

  const onFinish = () => {
    console.log(form.getFieldsValue());
    db.relatives.update(1, {
      ...form.getFieldsValue(),
      birthday: form.getFieldsValue().birthday.format("DD/MM/YYYY"),
    });
    console.log("update");
  };

  return (
    <Space direction="vertical" size="large" className="w-full">
      <Row style={{ margin: "5px 10px" }}>
        <FaUserCircle
          style={{ fontSize: "30px", margin: "0px 20px", color: "blue" }}
        />
        <Typography.Text style={{ fontSize: "20px" }}>
          Thông tin cá nhân
        </Typography.Text>
      </Row>
      <Row style={{ margin: "0px 30px" }}>
        <Col span={24}>
          <Form form={form} onFinish={onFinish}>
            <Row gutter={[0, 10]} style={{}}>
              <Col span={6}>
                <Typography.Text>Email</Typography.Text>
              </Col>
              <Col span={18}>
                <Form.Item name="email" style={{ width: "100%" }}>
                  <Input placeholder="Email" style={{ height: "50px" }}></Input>
                </Form.Item>
              </Col>

              <Col span={6}>
                <Typography.Text>Giới tính</Typography.Text>
              </Col>
              <Col span={18}>
                <Form.Item name="gender" style={{ width: "100%" }}>
                  <Radio.Group
                    value={sex}
                    onChange={(e) => {
                      setSex(e.target.value);
                    }}
                    style={{ height: "50px" }}
                  >
                    <Radio value="male">Nam</Radio>
                    <Radio value="female">Nữ</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>

              <Col span={6}>
                <Typography.Text>Tên gọi khác</Typography.Text>
              </Col>
              <Col span={18}>
                <Form.Item name="other_name" style={{ width: "100%" }}>
                  <Input
                    placeholder="Tên gọi khác"
                    style={{ height: "50px" }}
                  ></Input>
                </Form.Item>
              </Col>

              <Col span={6}>
                <Typography.Text>Số điện thoại</Typography.Text>
              </Col>
              <Col span={18}>
                <Form.Item name="phone" style={{ width: "100%" }}>
                  <Input
                    placeholder="Số điện thoại"
                    style={{ height: "50px" }}
                  ></Input>
                </Form.Item>
              </Col>

              <Col span={6}>
                <Typography.Text>Sinh nhật</Typography.Text>
              </Col>
              <Col span={18}>
                <Form.Item name="birthday" style={{ width: "100%" }}>
                  <DatePicker
                    placeholder="Sinh nhật"
                    format="DD/MM/YYYY"
                    style={{ height: "50px", width: "100%" }}
                  ></DatePicker>
                </Form.Item>
              </Col>

              <Col span={6}>
                <Typography.Text>Quê quán</Typography.Text>
              </Col>
              <Col span={18}>
                <Form.Item name="origin" style={{ width: "100%" }}>
                  <Input
                    placeholder="Quê quán"
                    style={{ height: "50px" }}
                  ></Input>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>
    </Space>
  );
};
