import { Space, Typography } from "antd";
import moment from "moment";
import { FaUserCircle } from "react-icons/fa";

const { Title, Text } = Typography;

export function ProfileAvatar(props: any) {
  const today = new Date();
  const birthday = moment(props.birthday, "DD/MM/YYYY").toDate();
  const birthdayOfThisYear = new Date(
    today.getFullYear(),
    birthday.getMonth(),
    birthday.getDate()
  );
  const thisDayOfNextYear = new Date(
    today.getFullYear() + 1,
    birthday.getMonth(),
    birthday.getDate()
  );
  const numberOfDays = Math.ceil(
    (today.getTime() - birthdayOfThisYear.getTime() > 0
      ? thisDayOfNextYear.getTime() - today.getTime()
      : birthdayOfThisYear.getTime() - today.getTime()) /
      (1000 * 3600 * 24)
  );
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
