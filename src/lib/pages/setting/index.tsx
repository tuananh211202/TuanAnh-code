import { Col, Divider } from "antd";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "lib/database/config";
import { ProfileAvatar } from "./ProfileAvatar";
import { ProfileSection } from "./ProfileSection";

const Setting = () => {
  const you = useLiveQuery(async() => {
    const id = await db.relatives.add({
      name: "",
      other_name: "",
      gender: "male",
      email: "",
      phone: "",
      origin: "",
      birthday: "01/01/2010",
      deathday: "",
      type: "you",
      facebook: ""
    })
    if(id > 1) db.relatives.delete(id);
    const you = db.relatives.get(1);
    return you;
  }, []);
  return (
    <Col>
      <ProfileAvatar name={you?.name} />
      <Divider style={{ marginTop: "10px", marginBottom: "10px" }} />
      <ProfileSection
        email={you?.email}
        gender={you?.gender}
        phone={you?.phone}
        origin={you?.origin}
        other_name={you?.other_name}
        birthday={you?.birthday}
        facebook={you?.facebook}
      />
    </Col>
  );
};

export default Setting;
