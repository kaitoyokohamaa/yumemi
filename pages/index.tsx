import React, { useEffect, useState, Fragment } from "react";
import { getPrefectureData } from "./api/prefecture";
import { getPopulationData } from "./api/population";
import HighchartsReact from "highcharts-react-official";

interface PrefectureInfo {
  prefCode: number;
  prefName: string;
}
type PopulationInfo = {
  year: number;
  value: number;
};

// interface graphTypes {
//   year: number;
//   population: number;
// }

export default function index() {
  const [prefectures, setPrefectures] = useState<PrefectureInfo[]>([]);
  const [populations, setPopulations] = useState<PopulationInfo[]>([]);
  const [selectedPopulations, setSelectedPopulations] = useState<number[]>([]);
  const [checkedIds, setCheckedIds] = useState<number[]>([]);
  const [checkedNames, setCheckedNames] = useState<string[]>([]);
  const [checkedName, setCheckedName] = useState<string>();
  const [graphData, setGraphData] = useState<any[]>([]);

  const options = {
    chart: {
      type: "spline",
    },
    title: {
      text: "My chart",
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
    series: [
      {
        name: checkedName,
        data: selectedPopulations,
      },
    ],
  };
  // 都道府県一覧の取得
  console.log({
    data: populations,
  });
  useEffect(() => {
    const fetchPrefecture = async () => {
      const res = getPrefectureData.FetchPrefecture();
      await res.then((data) => {
        setPrefectures(data);
      });
    };
    fetchPrefecture();
  }, []);

  // チエックリストでチェックした人口を取得
  useEffect(() => {
    const fetchPopulation = async () => {
      console.log(checkedIds);
      const res = checkedIds?.map(
        async (id: number) => await getPopulationData.FetchPopulation(id)
      );

      res?.map(async (item) => {
        await item.then((response) => {
          console.log(response);
          setPopulations(response[0].data);
        });
      });
    };

    fetchPopulation();
  }, [checkedIds]);
  console.log(populations);
  useEffect(() => {
    let store = [...graphData];
    const data = populations?.map((item) => item.value);
    setSelectedPopulations(data);
    // const data = [];
    // console.log(store);
    // store.push(data);
    setGraphData(store);
  }, [populations]);
  console.log(selectedPopulations);
  const handleChange = (
    e: React.FormEvent<HTMLInputElement>,
    prefectureName: string
  ) => {
    if ((e.target as HTMLInputElement).checked === true) {
      const deleteDuplicateId = new Set([...checkedIds]);
      setCheckedIds([...deleteDuplicateId, Number(e.currentTarget.value)]);
      // checkした県名の取得
      setCheckedName(prefectureName);
      const deleteDuplicateName = new Set([...checkedNames]);
      setCheckedNames([...deleteDuplicateName, prefectureName]);
    } else if ((e.target as HTMLInputElement).checked === false) {
      const removedId = Number(e.currentTarget.value);
      const newIds = checkedIds.filter((value) => {
        return value !== removedId;
      });
      setCheckedIds(newIds);
      // checkした県名を外す TODO:filterで自分がチェックを外した県名を外す
      setCheckedName("");
      const newNames = checkedNames.filter((value) => {
        return value !== prefectureName;
      });
      setCheckedNames(newNames);
    }
  };

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
                onChange={(e) => handleChange(e, item.prefName)}
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
