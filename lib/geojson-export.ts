import type { AnalysisResult } from '@/types';

/**
 * Converts normalized percentage bounding boxes (0-100)
 * into geographic bounding coordinates around an anchor lat/lng (e.g. Gurugram, Patna, Pune)
 */
function bboxToGeoCoordinates(
  x: number,
  y: number,
  w: number,
  h: number,
  centerLat = 28.4595,
  centerLng = 77.0266,
): number[][][] {
  // Approximate conversion: 100% box spans ~0.02 degrees (~2.2 km)
  const span = 0.02;
  const minLng = centerLng - span / 2 + (x / 100) * span;
  const maxLng = minLng + (w / 100) * span;
  const maxLat = centerLat + span / 2 - (y / 100) * span;
  const minLat = maxLat - (h / 100) * span;

  return [
    [
      [minLng, minLat],
      [maxLng, minLat],
      [maxLng, maxLat],
      [minLng, maxLat],
      [minLng, minLat],
    ],
  ];
}

export function exportReportToGeoJSON(analysis: AnalysisResult): void {
  const centerLat = 28.4595;
  const centerLng = 77.0266;

  const features = analysis.regions.map((reg) => ({
    type: 'Feature' as const,
    id: reg.id,
    properties: {
      id: reg.id,
      analysisId: analysis.id,
      type: reg.type,
      confidence: reg.confidence,
      sensors: reg.sensors,
      temporalStart: reg.temporal?.t1 ?? 'T1',
      temporalEnd: reg.temporal?.t2 ?? 'T2',
      description: reg.description,
      verdict: analysis.verdict,
      overallConfidence: analysis.confidence,
      crossSensorAgreement: analysis.crossSensorAgreement,
      location: analysis.location,
    },
    geometry: {
      type: 'Polygon' as const,
      coordinates: bboxToGeoCoordinates(
        reg.geometry.x,
        reg.geometry.y,
        reg.geometry.width,
        reg.geometry.height,
        centerLat,
        centerLng,
      ),
    },
  }));

  const geojson = {
    type: 'FeatureCollection',
    name: `SatQuery_${analysis.id}_EvidenceLayers`,
    crs: {
      type: 'name',
      properties: {
        name: 'urn:ogc:def:crs:OGC:1.3:CRS84',
      },
    },
    features,
  };

  const blob = new Blob([JSON.stringify(geojson, null, 2)], {
    type: 'application/geo+json',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `SatQuery-${analysis.id}-evidence.geojson`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function exportReportToCSV(analysis: AnalysisResult): void {
  const headers = [
    'Region_ID',
    'Classification_Type',
    'Confidence_Pct',
    'Sensors_Used',
    'Temporal_T1',
    'Temporal_T2',
    'Description',
    'Analysis_Verdict',
    'Cross_Sensor_Agreement',
    'Location',
  ];

  const rows = analysis.regions.map((r) => [
    `"${r.id}"`,
    `"${r.type}"`,
    `"${Math.round(r.confidence * 100)}%"`,
    `"${r.sensors.join(' + ')}"`,
    `"${r.temporal?.t1 ?? 'N/A'}"`,
    `"${r.temporal?.t2 ?? 'N/A'}"`,
    `"${r.description.replace(/"/g, '""')}"`,
    `"${analysis.verdict}"`,
    `"${(analysis.crossSensorAgreement * 100).toFixed(0)}%"`,
    `"${analysis.location}"`,
  ]);

  const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `SatQuery-${analysis.id}-evidence-audit.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
