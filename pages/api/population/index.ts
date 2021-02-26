import { PopulationInfo } from "./types";

class Population {
  FetchPopulation = async (code: number) => {
    const res = await fetch(
      `https://opendata.resas-portal.go.jp/api/v1/population/composition/perYear?prefCode=${code}`,
      {
        method: "GET",
        headers: {
          "X-API-KEY": `${process.env.NEXT_PUBLIC_API_KEY}`,
        },
      }
    );
    return await res.json().then((item: PopulationInfo) => item.result.data);
  };
}

export const getPopulationData = new Population();
