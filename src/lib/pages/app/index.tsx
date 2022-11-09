import { useEffect } from "react";
import { useRouter } from "next/router";

import { useLiveQuery } from "dexie-react-hooks";
import { db } from "lib/database/config";
import { useSelector } from "react-redux";

const App = () => {
  const router = useRouter();
  const name = useSelector((state) => state.name);
  // redirect to profile if already registered
  if (!name) {
    router.push("/setting");
  } else {
    router.push("/profile");
  }

  return <></>;
};
export default App;
