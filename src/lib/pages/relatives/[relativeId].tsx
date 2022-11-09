import { ProfileAvatar } from "./ProfileAvatar";
import Family from "./Family";
import ProfileSection from "./ProfileSection";
import ArticleList from "./Feature/Article/ArticleList";
import { Col, Divider, Typography } from "antd";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "lib/database/config";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { IRelatives } from "lib/types/relatives";
import Head from "next/head";
import EditRelativeModal from "./Feature/EditRelativeModal/EditRelativeModal";
import { BackButton, EditButton } from "lib/components/Button/CommandButton";

const Relatives = () => {
  const router = useRouter();
  const { relativeId } = router.query;
  const relativeData = useLiveQuery(() => db.relatives.toArray());
  return (
    <>
      {relativeData?.map((item) => {
        if (item.id?.toString() == relativeId)
          return (
            <div>
              <>
                <Head>
                  <title>Họ hàng | Zisan</title>
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
                  <BackButton />
                  <Typography.Text
                    strong
                    style={{
                      margin: "0 auto",
                      fontSize: "20px",
                      textAlign: "center",
                    }}
                  >
                    Họ hàng
                  </Typography.Text>
                  <EditRelativeModal
                    id={item.id?.toString() == relativeId ? item?.id : 1}
                  />
                </Col>
              </>
              <ProfileAvatar
                name={item.id?.toString() == relativeId ? item?.name : "test"}
                birthday={
                  item.id?.toString() == relativeId ? item?.birthday : ""
                }
              />
              <Divider style={{ marginTop: "10px", marginBottom: "10px" }} />
              <ProfileSection
                email={item.id?.toString() == relativeId ? item?.email : "abc"}
                gender={
                  item.id?.toString() == relativeId ? item?.gender : "male"
                }
                birthday={
                  item.id?.toString() == relativeId ? item?.birthday : ""
                }
              />
              <Divider style={{ marginTop: "10px", marginBottom: "10px" }} />
              <Family id={item.id?.toString() == relativeId ? item?.id : 1} />
              <Divider style={{ marginTop: "10px", marginBottom: "10px" }} />
              <ArticleList />
            </div>
          );
      })}
    </>
  );
};

export default Relatives;
