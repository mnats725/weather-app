import { useMemo, useEffect } from 'react';
import { MapContainer, TileLayer, Circle, useMap } from 'react-leaflet';

import styles from './map-view.module.css';

type LatLng = { lat: number; lon: number };

type MapViewProps = {
  center: LatLng;
  marker?: LatLng;
  /** отключено: клики по карте не обрабатываются */
  onPickCoords?: (lat: number, lon: number) => void;
  showRadar?: boolean;
  zoom?: number;
};

const RadarLayer = () => {
  const url = 'https://tilecache.rainviewer.com/v2/radar/latest/256/{z}/{x}/{y}/4/1_1.png';
  return <TileLayer url={url} opacity={0.6} zIndex={2} />;
};

const SetView = ({ center, zoom }: { center: LatLng; zoom: number }) => {
  const map = useMap();
  const pos = useMemo(() => [center.lat, center.lon] as [number, number], [center.lat, center.lon]);
  map.setView(pos, zoom, { animate: false });
  return null;
};

const InvalidateSizeOnMount = () => {
  const map = useMap();
  useEffect(() => {
    map.invalidateSize();
  }, [map]);
  return null;
};

export const MapView = ({ center, marker, showRadar, zoom = 8 }: MapViewProps) => {
  const pos: [number, number] = [center.lat, center.lon];
  const hasMarker = Boolean(marker);

  return (
    <section>
      <div className={styles.map} role="application" aria-label="Карта погоды">
        <MapContainer
          center={pos}
          zoom={zoom}
          minZoom={2}
          scrollWheelZoom
          preferCanvas
          attributionControl
          whenReady={() => {}}
          style={{ width: '100%', height: '100%' }}
        >
          <InvalidateSizeOnMount />

          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" zIndex={1} />
          {showRadar ? <RadarLayer /> : null}

          <SetView center={center} zoom={zoom} />

          {hasMarker ? (
            <Circle
              center={[marker!.lat, marker!.lon]}
              radius={250}
              pathOptions={{ weight: 2, opacity: 1, fillOpacity: 0.8 }}
            />
          ) : null}
        </MapContainer>
      </div>
      <p className={styles.legend}>Источники: OSM, RainViewer.</p>
    </section>
  );
};
