export interface GeoLocation {
    geo_lat: number;
    geo_lon: number;
}

export interface Post {
    title: string;
    body: string;
    geo_location: GeoLocation;
}