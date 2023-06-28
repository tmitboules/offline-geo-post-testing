export interface GeoLocation {
    geo_lat: number;
    geo_lon: number;
}

export interface Post {
    title: string;
    body: string;
    geo_location: GeoLocation;
}

export interface LocatedPostInfo {
    id: string
    added_by: string
    updated_by: string
    located_post: LocatedPost
  }
  
  export interface LocatedPost {
    title: string
    body: string
    geo_location: GeoLocation
    date_added: string
    date_updated: string
  }

export interface PostResponse {
    locatedPosts: LocatedPostInfo[]
}