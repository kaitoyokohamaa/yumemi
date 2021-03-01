import { PrefectureInfo } from "./types";

class Prefecutures {
  FetchPrefecture = async () => {
    const res = await fetch(
      "https://opendata.resas-portal.go.jp/api/v1/prefectures",
      {
        method: "GET",
        headers: {
          "X-API-KEY": `${process.env.NEXT_PUBLIC_API_KEY}`,
        },
      }
    );
    return await res.json().then((item: PrefectureInfo) => item.result);
  };
}

export const getPrefectureData = new Prefecutures();
