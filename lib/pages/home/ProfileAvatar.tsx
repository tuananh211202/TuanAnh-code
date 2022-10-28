import { Space, Typography } from "antd";
import { countDays } from "lib/components/lunar";
import moment from "moment";
import { FaUserCircle } from "react-icons/fa";

const { Title, Text } = Typography;

export function ProfileAvatar(props) {
  const birthday = moment(props.birthday, "DD/MM/YYYY").toDate();
  const numberOfDays = countDays(birthday.getDate(),birthday.getMonth());  
  return (
    <Space
      direction="vertical"
      size="small"
      className="w-full flex justify-center items-center content-center"
    >
      <FaUserCircle size={120} />
      <Title level={3}>{props.name}</Title>
      <Text>Còn {numberOfDays} ngày nữa đến ngày sinh nhật</Text>
    </Space>
  );
}
