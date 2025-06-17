interface DataDispatch {
  date: Date;
  period: string;
  fleet: string;
  unit: string;
  activity: string;
  material: string;
  trip: number;
  load: string;
  dump: string;
  distance: number;
}

interface DataFuel {
  date: Date;
  unit: string;
  hm?: number;
  remainingEstimate?: string;
  qty: number;
  time?: string;
}

interface DataPlant {
  date: Date;
  shift?: '1' | '2';
  unit?: string;
  hm?: number;
  problem?: string;
  type?: string;
  status?: string;
}

interface DataOb {
  week: string;
  date: Date;
  planDayShift: number;
  actDayShift: number;
  planNightShift: number;
  actNightShift: number;
  planDaily: number;
  actDaily: number;
  achDailyPercent: string;
  planMTD: number;
  actMTD: number;
  achMTDPercent: string;
}
