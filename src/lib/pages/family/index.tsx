import { MoreOutlined } from "@ant-design/icons";
import { Button, Input, Popover, Space } from "antd";
import Meta from "antd/lib/card/Meta";
import { useLiveQuery } from "dexie-react-hooks";
import { convertLunarr2Solar, countDays } from "lib/components/lunar";
import { db } from "lib/database/config";
import { ROLE } from "lib/utils/common";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { FaUserCircle, FaUserMinus } from "react-icons/fa";
import { MdEdit } from "react-icons/md";

const { Search } = Input;
const content = (handleDelete) => (
  <div className="flex flex-col">
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

const Family = () => {
  const exampleData = useLiveQuery(() => db.relatives.toArray(), []);
  const [relatives, setRelatives] = useState(exampleData?.slice(1));
  const lastId = useLiveQuery(() => db.relationship.orderBy("id").last(), []);
  console.log(lastId);
  useEffect(() => setRelatives(exampleData?.slice(1)), [exampleData]);
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

  const onSearch = (value) => {
    setRelatives(
      exampleData?.slice(1).filter((item) => item.name.includes(value))
    );
  };

  const countDaysToDeathToAnniversary = (deathday) => {
    if (deathday == "") return -1;
    const month = moment(deathday, "DD/MM/YYYY").toDate().getMonth();
    const day = moment(deathday, "DD/MM/YYYY").toDate().getDate();
    const today = new Date();
    const year = today.getFullYear();
    const solarThisYear = convertLunarr2Solar(day, month + 1, year, 0, 7);
    const solarNextYear = convertLunarr2Solar(day, month + 1, year + 1, 0, 7);
    const dayOfThisYear = new Date(
      solarThisYear[2],
      solarThisYear[1] - 1,
      solarThisYear[0]
    );
    const thisDayOfNextYear = new Date(
      solarNextYear[2],
      solarNextYear[1] - 1,
      solarNextYear[0]
    );
    const numberOfDays = Math.ceil(
      (today.getTime() - dayOfThisYear.getTime() > 0
        ? thisDayOfNextYear.getTime() - today.getTime()
        : dayOfThisYear.getTime() - today.getTime()) /
        (1000 * 3600 * 24)
    );
    console.log(numberOfDays);
    return numberOfDays;
  };

  const description = (deathday, role) => {
    const day = countDaysToDeathToAnniversary(deathday);
    return day == -1 || day > 365
      ? "" + role
      : "Còn " + day + " ngày nữa là tới ngày giỗ " + role;
  };

  return (
    <Space direction="vertical" size="small" className="w-full px-4">
      <Search placeholder="input search text" onSearch={onSearch} />

      <Space direction="vertical" size="small" className="w-full">
        {relatives?.map((item) => (
          <div
            className="flex justify-between mx-4 my-2"
            key={relatives.indexOf(item)}
          >
            <Meta
              avatar={<FaUserCircle size={36} />}
              title={item.name}
              description={description(
                item.deathday,
                ROLE[item.gender][item.type]
              )}
            />
            <Popover
              placement="right"
              content={content(() => deleteContact(item.id))}
              trigger="click"
            >
              <Button type="text" icon={<MoreOutlined />} />
            </Popover>
          </div>
        ))}
      </Space>
    </Space>
  );
};

export default Family;
