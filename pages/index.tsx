import React, { useEffect, useState } from "react";
import { getPrefectureData } from "./api/prefecture";
import { getPopulationData } from "./api/population";
import HighchartsReact from "highcharts-react-official";

interface PrefectureInfo {
  prefCode: number;
  prefName: string;
}

export default function index() {
  const [prefectures, setPrefectures] = useState<PrefectureInfo[]>([]);
  const [checkedPrefCodes, setCheckedPrefCodes] = useState<number[]>([]);
  const [selectedPopulations, setSelectedPopulations] = useState(
    new Map<number, number[]>()
  );

  const graphData: { name: string; data: number[] }[] = checkedPrefCodes
    .map((code) => prefectures.find((pref) => pref.prefCode === code))
    .filter((pref) => pref && selectedPopulations.has(pref.prefCode))
    .map((pref) => ({
      name: pref!.prefName,
      data: [...selectedPopulations.get(pref!.prefCode)!],
    }));

  const options = {
    chart: {
      type: "spline",
    },
    title: {
      text: "人口グラフ",
    },
    xAxis: {
      categories: [
        "1960",
        "1965",
        "1970",
        "1975",
        "1980",
        "1985",
        "1990",
        "1995",
        "2000",
        "2005",
        "2010",
        "2015",
        "2020",
        "2025",
        "2030",
        "2035",
        "2040",
        "2045",
      ],
    },
    series: graphData,
  };

  useEffect(() => {
    getPrefectureData.FetchPrefecture().then((res) => setPrefectures(res));
  }, []);

  const handleChange = (
    e: React.FormEvent<HTMLInputElement>,
    prefCode: number
  ) => {
    if ((e.target as HTMLInputElement).checked === true) {
      const deleteDuplicateId = new Set([...checkedPrefCodes]);
      setCheckedPrefCodes([...deleteDuplicateId, prefCode]);

      getPopulationData.FetchPopulation(prefCode).then((res) => {
        setSelectedPopulations((oldData) => {
          const newData = new Map(oldData);

          newData.set(
            prefCode,
            res[0].data.map((item) => item.value)
          );

          return newData;
        });
      });
    } else {
      setCheckedPrefCodes(checkedPrefCodes.filter((code) => code !== prefCode));
    }
  };
  console.log(selectedPopulations);
  return (
    <div className="mt-10">
      <h1 className="w-9/12 m-auto">
        <span className="border-2 border-black">都道府県</span>
      </h1>
      <div className="flex  flex-wrap w-9/12 m-auto">
        {prefectures?.map((item) => {
          return (
            <label key={item.prefCode} className="flex mr-14 mt-4">
              <input
                type="checkbox"
                value={item.prefCode}
                onChange={(e) => handleChange(e, item.prefCode)}
              />
              <div>{item.prefName}</div>
            </label>
          );
        })}
      </div>
      <div className="w-9/12 m-auto mt-28">
        <HighchartsReact constructorType={"chart"} options={options} />
      </div>
    </div>
  );
}
