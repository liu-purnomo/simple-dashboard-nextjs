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
  fleetDs?: string;
  dtDs?: string;
  fleetNs?: string;
  dtNs?: string;
}

interface FleetRow {
  date?: string;
  period?: string;
  fleet?: string;
  unit?: string;
  activity?: string;
  material?: string;
  trip?: string;
  load?: string;
  dump?: string;
  distance?: string;
}

type Shift = 'DS' | 'NS';

interface TripSummary {
  shift: Shift;
  dt: number;
  trip: number;
  distance: number;
  wasteDump: string;
  units: string[];
}

interface FleetSummary {
  fleet: string;
  trip: TripSummary[];
}

interface DailySummary {
  date: string;
  dayShift: FleetSummary[];
  nightShift: FleetSummary[];
}
