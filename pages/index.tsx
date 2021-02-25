import React, { useEffect, useState } from "react";
import { getPrefectureData } from "./api/prefecture";
export interface PrefectureInfo {
  prefCode: number;
  prefName: string;
}

export default function index() {
  const [prefectures, setPrefectures] = useState<PrefectureInfo[]>([]);
  useEffect(() => {
    const fetch = async () => {
      const res = getPrefectureData.FetchPrefecture();
      await res.then((data) => setPrefectures(data));
    };
    fetch();
  }, []);
  console.log(prefectures);
  return (
    <div className="mt-10">
      <h1 className="w-9/12 m-auto">
        <span className="border-2 border-black">都道府県</span>
      </h1>
      <div className="flex  flex-wrap w-9/12 m-auto">
        {prefectures?.map((item) => {
          return (
            <label key={item.prefCode} className="flex mr-14 mt-4">
              <input type="checkbox" />
              <div>{item.prefName}</div>
            </label>
          );
        })}
      </div>
    </div>
  );
}
