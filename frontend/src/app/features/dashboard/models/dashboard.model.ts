export interface KPIStats {
  total_members: number;
  total_celulas: number;
  total_offering: number;
  avg_attendance: number;
}

export interface ChartData {
  label: string; // Fecha (ej: "2023-10-01")
  value: number;
}

export interface MapPoint {
  id: number;
  name: string;
  type: 'CELULA' | 'PERSONA';
  lat: number;
  lng: number;
  extra?: string;
}