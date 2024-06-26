import { type Coordinate } from '~/types';
import { RoutingMachine } from './routing-machine';
import { MapContainer, TileLayer } from 'react-leaflet';

import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';

export type WaypointMapProps = {
	startCoordinate: Coordinate;
	endCoordinate: Coordinate;
};

export function WaypointMap(props: WaypointMapProps) {
	const { startCoordinate, endCoordinate } = props;

	return (
		<MapContainer
			touchZoom={false}
			scrollWheelZoom={false}
			zoom={2}
			className="w-full h-full"
			center={[
				(props.startCoordinate.lat + props.endCoordinate.lat) / 2,
				(props.startCoordinate.lng + props.endCoordinate.lng) / 2,
			]}
		>
			<TileLayer
				attribution='<a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
				url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
			/>

			<RoutingMachine
				startCoordinate={startCoordinate}
				endCoordinate={endCoordinate}
			/>
		</MapContainer>
	);
}
