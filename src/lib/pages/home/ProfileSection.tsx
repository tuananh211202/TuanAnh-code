import { Col, Row, Space, Typography } from "antd";
import moment from "moment";
import { FaUserCircle } from "react-icons/fa";

const { Text, Title, Link } = Typography;

const ProfileSection = (props) => {
  return (
    <Space direction="vertical" size="small" className="w-full">
      <div className="flex m-4">
        <FaUserCircle size={20} className="mr-2" />
        <Text>Thông tin cá nhân</Text>
      </div>

      <Row className="px-6">
        <Col span={6}>
          <Title level={5}>Email</Title>{" "}
        </Col>
        <Col span={18}>
          <Text>{props.email}</Text>
        </Col>
        <Col span={6}>
          <Title level={5}>Facebook</Title>{" "}
        </Col>  
        <Col span={18}>
          <Link href={props.facebook}>{props.facebook}</Link>
        </Col>
        <Col span={6}>
          {" "}
          <Title level={5}>Giới tính</Title>{" "}
        </Col>
        <Col span={18}>
          <Text>{props.gender === "male" ? "Nam" : "Nữ"}</Text>
        </Col>
        <Col span={6}>
          {" "}
          <Title level={5}>Sinh nhật</Title>{" "}
        </Col>
        <Col span={18}>
          <Text>{props.birthday}</Text>
        </Col>
      </Row>
    </Space>
  );
};

export default ProfileSection;
