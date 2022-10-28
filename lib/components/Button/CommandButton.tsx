import { FaEdit, FaShareSquare, FaSave, FaArrowLeft } from "react-icons/fa";
import { FiShare2 } from "react-icons/fi";
import { ImCancelCircle } from "react-icons/im";
import { Typography, Row, Col } from "antd";
import { useDispatch } from "react-redux";
import {
  saveSection,
  saveAvatar,
  cancelSection,
  cancelAvatar,
} from "lib/actions/buttonStatus";

const iconStyles = {
  display: "table",
  margin: "0 auto",
  fontSize: "22px",
  color: "black",
};

export const CommandButton = (props) => {
  return (
    <Typography.Link href={props.href} onClick={props.onClick}>
      <Row
        gutter={[0, 0]}
        style={{ margin: "10px 5px", width: props.width, color: props.color }}
      >
        <Col span={24}>{props.icon}</Col>
        <Col span={24} className="text-center">
          <Typography.Text
            strong
            style={{ color: props.color, fontSize: props.textSize }}
          >
            {props.text}
          </Typography.Text>
        </Col>
      </Row>
    </Typography.Link>
  );
};

export const EmptyButton = () => {
  return (
    <div
      style={{ width: "82px", height: "auto", background: "transparent" }}
    ></div>
  );
};

export const EditButton = () => {
  return (
    <CommandButton
      icon={<FaEdit style={iconStyles} />}
      href="/setting"
      text="Chỉnh sửa"
      textSize="10px"
      color="black"
      width="72px"
    ></CommandButton>
  );
};

export const InviteButton = () => {
  return (
    <CommandButton
      icon={<FaShareSquare style={iconStyles} />}
      href="https://google.com"
      text="Mời tham gia"
      textSize="10px"
      color="black"
      width="72px"
    ></CommandButton>
  );
};

export const SharingButton = () => {
  return (
    <CommandButton
      icon={<FiShare2 style={iconStyles} />}
      href="https://google.com"
      text="Chia sẻ"
      textSize="10px"
      color="black"
      width="72px"
    ></CommandButton>
  );
};

export const SaveButton = () => {
  const dispatch = useDispatch();
  return (
    <CommandButton
      icon={<FaSave style={iconStyles} />}
      text="Lưu"
      textSize="10px"
      color="black"
      width="72px"
      onClick={() => {
        dispatch(saveAvatar());
        dispatch(saveSection());
      }}
    ></CommandButton>
  );
};

export const CancelButton = () => {
  const dispatch = useDispatch();
  return (
    <CommandButton
      icon={<ImCancelCircle style={iconStyles} />}
      text="Hủy bỏ"
      textSize="10px"
      color="black"
      width="72px"
      onClick={() => {
        dispatch(cancelAvatar());
        dispatch(cancelSection());
      }}
    ></CommandButton>
  );
};

export const BackButton = () => {
  return (
    <CommandButton
      icon={<FaArrowLeft style={iconStyles} />}
      href="/profile"
      text="Quay lại"
      textSize="10px"
      color="black"
      width="72px"
    ></CommandButton>
  );
};
