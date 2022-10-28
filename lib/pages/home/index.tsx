import { ProfileAvatar } from "./ProfileAvatar";
import Family from "./Family";
import ProfileSection from "./ProfileSection";
import ArticleList from "./Feature/Article/ArticleList";
import { Divider } from "antd";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "lib/database/config";

const Home = () => {
  const you = useLiveQuery(() => db.relatives.get(1), []);
  return (
    <div>
      <ProfileAvatar name={you?.name} birthday={you?.birthday} />
      <Divider style={{ marginTop: "10px", marginBottom: "10px" }} />
      <ProfileSection
        email={you?.email}
        gender={you?.gender}
        birthday={you?.birthday}
        facebook={you?.facebook}
      />
      <Divider style={{ marginTop: "10px", marginBottom: "10px" }} />
      <Family birthday={you?.birthday} />
      <Divider style={{ marginTop: "10px", marginBottom: "10px" }} />
      <ArticleList />
    </div>
  );
};

export default Home;
