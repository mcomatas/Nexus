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

export type User = {
  id: string,
  email: string,
  username: string,
}
