import {
  MoreOutlined,
  UserAddOutlined,
  UsergroupAddOutlined,
} from "@ant-design/icons";

import {
  Button,
  Col,
  Divider,
  Form,
  Input,
  Popover,
  Radio,
  Row,
  Space,
  Typography,
} from "antd";
import Meta from "antd/lib/card/Meta";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "lib/database/config";
import { ROLE } from "lib/utils/common";
import Link from "next/link";
import { Router, useRouter } from "next/router";
import { useState } from "react";
import { FaUserCircle, FaUsers, FaUserMinus } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import Relatives from "../relatives/[relativeId]";
import AddRelativesButton, { EditRelativesModal } from "./Button/AddRelatives";
import ConnectRelativesButton from "./Button/ConnectRelatives";

const { Text } = Typography;
const content = (handleEdit, handleDelete) => (
  <div className="flex flex-col">
    <Button
      type="text"
      className="items-center"
      style={{ display: "flex" }}
      icon={<MdEdit className="mr-2" />}
      onClick={handleEdit}
    >
      Sửa quan hệ
    </Button>
    <Button
      type="text"
      className="items-center"
      style={{ display: "flex" }}
      icon={<FaUserMinus className="mr-2" />}
      onClick={handleDelete}
    >
      Xoá quan hệ
    </Button>
  </div>
);
const Family = (props) => {
  const exampleData = useLiveQuery(() => db.relatives.toArray(), []);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [id, setId] = useState(0);
  const handleEdit = (id) => {
    setIsModalOpen(true);
    setId(id);
  };
  const deleteContact = async (id) => {
    await db.relatives.delete(id);
    const relationship = await db.relationship.toArray();
    for (let i in relationship)
      if (relationship[i].from == id || relationship[i].to == id) {
        const relId = relationship[i].id || 0;
        await db.relationship.delete(relId);
      }
    console.log(relationship);
  };
  return (
    <Space direction="vertical" size="small" className="w-full">
      <div className="flex m-4">
        <FaUsers size={20} className="mr-2" />
        <Text>Gia đình</Text>
      </div>

      {exampleData?.slice(1).map((item) => (
        <>
          <Typography.Link href={`/relatives/${item.id}`}>
            <div
              className="flex justify-between mx-4 my-2"
              key={exampleData.indexOf(item)}
            >
              <Meta
                avatar={<FaUserCircle size={36} />}
                title={item.name}
                description={ROLE[item.gender][item.type]}
              />

              <Popover
                placement="right"
                content={content(
                  () => handleEdit(item.id),
                  () => deleteContact(item.id)
                )}
                trigger="click"
              >
                <Button type="text" icon={<MoreOutlined />} />
              </Popover>
            </div>
          </Typography.Link>
          <EditRelativesModal
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
            id={id}
            setId={setId}
            birthday={props.birthday}
          />
        </>
      ))}

      <div className="flex justify-between m-5">
        <AddRelativesButton birthday={props.birthday}></AddRelativesButton>
        <ConnectRelativesButton></ConnectRelativesButton>
      </div>
    </Space>
  );
};

export default Family;
