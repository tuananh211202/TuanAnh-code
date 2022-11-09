import { useRouter } from "next/router";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import Footer from "./Footer";
import Header from "./Header";

type LayoutProps = {
  children: ReactNode;
  check: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  const [visiable, setVisiable] = useState(true);
  var scrollTimer = -1;
  var prevScrollpos = window.pageYOffset;
  window.addEventListener(
    "scroll",
    function () {
      if (scrollTimer !== -1) {
        clearTimeout(scrollTimer);
      }
      scrollTimer = window.setTimeout(function () {
        var currentScrollPos = window.pageYOffset;
        if (prevScrollpos > currentScrollPos) {
          setVisiable(true);
        } else {
          setVisiable(false);
        }
        prevScrollpos = currentScrollPos;
      }, 100);
    },
    false
  );

  const router = useRouter();
  const path = router.asPath;
  return (
    <div className="max-w-xl m-auto min-h-full border-8 outline outline-neutral-100 outline-1">
      <Header presentPath={path} visiable={visiable} />
      <div className="py-16">{children}</div>

      <Footer presentPath={path} visiable={visiable} />
    </div>
  );
};

export default Layout;
