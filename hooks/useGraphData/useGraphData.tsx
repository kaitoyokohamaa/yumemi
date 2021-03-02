import React, { useEffect, useState } from "react";
import { getPrefectureData } from "../../pages/api/prefecture";
import { getPopulationData } from "../../pages/api/population";

interface PrefectureInfo {
  prefCode: number;
  prefName: string;
}
export const UseGraphData = () => {
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

  return {
    setCheckedPrefCodes,
    handleChange,
    prefectures,
    graphData,
  };
};
