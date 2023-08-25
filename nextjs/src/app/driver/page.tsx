"use client";

import { useRef } from "react";
import { useMap } from "../hooks/useMap";
import { Route } from "../utils/model";
import useSWR from 'swr';
import { fetcher } from "../utils/http";

export function DriverPage() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const map = useMap(mapContainerRef);

  const {
    data: routes,
    error,
    isLoading,
  } = useSWR<Route[]>('http://localhost:3000/routes', fetcher, {
    fallbackData: [],
  })

  async function startRoute() {
    const routeId = (document.getElementById("route") as HTMLSelectElement)
      .value;

    const response = await fetch(`http://localhost:3000/routes/${routeId}`);
    const route: Route = await response.json();
    
    map?.removeAllRoutes();
    await map?.addRouteWithIcons({
      routeId: routeId,
      startMarkerOptions: {
        position: route.directions.routes[0].legs[0].start_location,
      },
      endMarkerOptions: {
        position: route.directions.routes[0].legs[0].end_location,
      },
      carMarkerOptions: {
        position: route.directions.routes[0].legs[0].start_location,
      },
    });

    const { steps } = route.directions.routes[0].legs[0];

    for (const step of steps) {
      await sleep(2000);
      map?.moveCar(routeId, step.start_location);
      
      await sleep(2000);
      map?.moveCar(routeId, step.end_location);
    }
  }

  return (
    <div
        style={{
            display: 'flex',
            flexDirection: 'row',
            height: '100%',
            width: '100%',
        }}
    >
        <div>
            <h1>Minha Viagem</h1>
            <div 
                style={{display: 'flex', flexDirection: 'column'}}
            >
                <select id="route">
                    {isLoading && <option>Carregando dados...</option>}
                    {routes!.map((route) => (
                        <option key={route.id} value={route.id}>
                            {route.name}
                        </option>
                    ))}
                </select>
                <button type="submit" onClick={startRoute}>Iniciar viagem</button>
            </div>
        </div>
        <div 
            id='map'
            style={{
                height: '100%',
                width: '100%',
            }}
            ref={mapContainerRef}
        >
        </div>
    </div>
)
}

export default DriverPage;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));