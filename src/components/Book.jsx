import { useState } from "react";
import pages from "../pages";
import Page from "./Page";

export default function Book() {
  const [current, setCurrent] = useState(0);

  return (
    <div>
      <button onClick={() => setCurrent((p) => Math.max(p - 1, 0))}>
        ⬅
      </button>

      <button
        onClick={() =>
          setCurrent((p) => Math.min(p + 1, pages.length - 1))
        }
      >
        ➡
      </button>

      <Page page={pages[current]} />
    </div>
  );
}
