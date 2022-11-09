import { Col, Row } from "antd";
import { CommandButton } from "lib/components/Button/CommandButton";
import Link from "next/link";
import { ReactNode } from "react";
import { FaUserCircle, FaAddressBook, FaRegIdCard } from "react-icons/fa";
import { GiFamilyTree } from "react-icons/gi";

type FooterProps = {
  presentPath: ReactNode;
  visiable: ReactNode;
};
const Footer = ({ presentPath, visiable }: FooterProps) => {
  const buttonList = [
    {
      path: "/family",
      Icon: FaAddressBook,
      text: "Dòng họ",
    },
    {
      path: "/familytree",
      Icon: GiFamilyTree,
      text: "Gia phả",
    },
    {
      path: "/sharing",
      Icon: FaRegIdCard,
      text: "Được chia sẻ",
    },
    {
      path: "/profile",
      Icon: FaUserCircle,
      text: "Cá nhân",
    },
  ];

  return (
    <Row
      style={{
        margin: "2px 0px",
        position: "fixed",
        background: "white",
        bottom: visiable ? "0px" : "-80px",
        width: "575.7px",
        transition: "bottom 0.3s ease",
        maxWidth: "100%",
      }}
    >
      {buttonList.map(({ path, Icon, text }) => (
        <Col
          span={6}
          className="justify-center border "
          style={{
            display: "flex",
            border: "1px",
            borderColor: "#E2E8F0",
            borderStyle: "solid",
            alignItems: "center",
          }}
          key={path}
        >
          <CommandButton
            className="w-full flex justify-center"
            icon={
              <Icon
                style={{
                  display: "table",
                  margin: "0 auto",
                  fontSize: "30px",
                }}
              />
            }
            href={path}
            text={text}
            textSize="17px"
            color={presentPath === path ? "blue" : "black"}
          />
        </Col>
      ))}
      {buttonList.map(({ path }) => (
        <Col
          span={6}
          style={{
            height: "3px",
            backgroundColor: presentPath === path ? "blue" : "transparent",
          }}
        ></Col>
      ))}
    </Row>
  );
};

export default Footer;
