export type Game = {
  igdb_id: number,
  slug: string,
  title: string,
  cover_url: string,
}

export type DetailedGame = Game & {
  description: string,
  artwork_url: string,
  release_year: number,
}

export type Review = {
  id: string,
  user_id: string,
  username: string,
  igdb_id: number,
  rating: number | null, // Numeric serializes to string. Null when played-only
  review_text: string | null, // Null when played-only
  created_at: string,
  updated_at: string,
}

export type ReviewsResponse = {
  stats: {
    avg_rating: string | null,
    rating_count: string,
    review_count: string,
    total_played: string,
  },
  reviews: Review[],
  pagination: {
    limit: number,
    offset: number,
    total: number,
  },
  user_review: Review | null,
}

export type User = {
  id: string,
  email: string,
  username: string,
}
