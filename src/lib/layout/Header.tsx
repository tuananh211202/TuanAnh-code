import { Typography, Col } from "antd";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "lib/database/config";
import Head from "next/head";
import { ReactNode } from "react";
import {
  EditButton,
  InviteButton,
  EmptyButton,
  SharingButton,
  CancelButton,
  SaveButton,
  BackButton,
} from "../components/Button/CommandButton";

const pathList = [
  {
    path: "/profile",
    title: "Cá nhân",
    leftButton: InviteButton,
    rightButton: EditButton,
  },
  {
    path: "/family",
    title: "Dòng họ",
    leftButton: EmptyButton,
    rightButton: SharingButton,
  },
  {
    path: "/familytree",
    title: "Gia phả",
    leftButton: EmptyButton,
    rightButton: EmptyButton,
  },
  {
    path: "/sharing",
    title: "Được chia sẻ",
    leftButton: EmptyButton,
    rightButton: EmptyButton,
  },
  {
    path: "/setting",
    title: "Chỉnh sửa thông tin",
    leftButton: CancelButton,
    rightButton: SaveButton,
  },
];

type HeaderProps = {
  presentPath: ReactNode;
  visiable:ReactNode;
};

const Header = ({ presentPath, visiable }: HeaderProps) => {
  let title = "",
    LeftButton = EmptyButton,
    RightButton = EmptyButton;
  for (let i = 0; i < pathList.length; i++)
    if (presentPath == pathList[i].path) {
      title = pathList[i].title;
      LeftButton = pathList[i].leftButton;
      RightButton = pathList[i].rightButton;
      break;
    } /*
  if (
    presentPath?.toString().slice(0, 10) == "/relatives"
  ) {
    title = "Họ hàng";
    LeftButton = BackButton;
    RightButton = EditButton;
  }*/
 
  return (
    <div 
      style={{
        position: "fixed",
        background: "white",
        top: visiable? "0px": "-80px",
        width:"575.7px",
        maxWidth:"100%",
        transition: "top 0.3s ease",
      }}>
      <Head>
        <title>{title ? title + " | Zisan" : "Zisan"}</title>
      </Head>
      <Col
        style={{
          border: "1px",
          borderColor: "#E2E8F0",
          borderStyle: "solid",
          display: "flex",
          alignItems: "center",
        }}
      >
        <LeftButton />
        <Typography.Text
          strong
          style={{ margin: "0 auto", fontSize: "20px", textAlign: "center" }}
        >
          {title}
        </Typography.Text>
        <RightButton />
      </Col>
    </div>
  );
};

export default Header;
