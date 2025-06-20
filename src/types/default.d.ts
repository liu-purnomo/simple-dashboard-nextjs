interface SummaryRow {
  week?: string;
  date?: string;
  planDs?: string;
  actDs?: string;
  planNs?: string;
  actNs?: string;
  planDaily?: string;
  actDaily?: string;
  achDaily?: string;
  planMtd?: string;
  actMtd?: string;
  achMtd?: string;
  fuelDs?: string;
  fuelNs?: string;
  fuelDaily?: string;
  fuelMtd?: string;
  frDs?: string;
  frNs?: string;
  frDaily?: string;
  frMtd?: string;
}

interface FleetRow {
  date: string;
  fleet: string;
  dt: string;
  ritase: string;
  distance: string;
  wasteDump: string;
}

interface CombinedRow {
  date: string;
  summary: SummaryRow | null;
  dayShift: FleetRow[];
  nightShift: FleetRow[];
}
