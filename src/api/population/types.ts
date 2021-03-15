export interface PopulationInfo {
  result: {
    data: [
      {
        label: string;
        data: [
          {
            year: number;
            value: number;
          }
        ];
      }
    ];
  };
}
