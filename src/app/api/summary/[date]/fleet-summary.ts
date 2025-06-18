type DispatchRecord = {
  date: string;
  period: string;
  fleet: string;
  unit: string;
  activity: string;
  material: string;
  trip: string;
  load: string;
  dump: string;
  distance: string;
};

type FleetSummary = {
  fleet: string;
  dt: string[];
  trip: number;
  material: string[];
  dumping: string[];
};

export function summarizeDispatchFleet(
  data: DispatchRecord[],
  fleets: string[],
): Record<string, FleetSummary> {
  const summary: Record<string, FleetSummary> = {};

  for (const fleet of fleets) {
    summary[fleet] = {
      fleet,
      dt: [],
      trip: 0,
      material: [],
      dumping: [],
    };
  }

  for (const item of data) {
    const fleetKey = item.fleet?.trim().toUpperCase();
    if (!fleetKey || !summary[fleetKey]) continue;

    const current = summary[fleetKey];

    if (item.unit && !current.dt.includes(item.unit)) {
      current.dt.push(item.unit);
    }

    if (item.material && !current.material.includes(item.material)) {
      current.material.push(item.material);
    }

    const wasteDump = `${item.dump} (${item.distance}m)`;

    if (wasteDump && !current.dumping.includes(wasteDump)) {
      current.dumping.push(wasteDump);
    }

    const trip = parseInt(item.trip.replace(/,/g, ''));
    current.trip += isNaN(trip) ? 0 : trip;
  }

  return summary;
}
