export interface ContentVideo {
    id: string
    links: string
    title: string
    description: string
    entryDate?: string
    userId: string | null
    username: string | null
    createdDate?: string
    updatedDate?: string
  }
  
export interface ContentVideoResponse {
    contentVideos: ContentVideo[],
    totalRecords: number,
    totalPages: number
  }
  