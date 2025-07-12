import MovieCard from "../components/MovieCard";
const movies = [
  {
    _id: "1",
    title: "The Shawshank Redemption",
    genres: "Drama | Crime",
    rating: 9.3,
    releaseDate: "1994-09-23",
    runtime: 142,
    posterUrl: "https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg",
  },
  {
    _id: "2",
    title: "Interstellar",
    genres: "Sci-Fi | Drama",
    rating: 8.6,
    releaseDate: "2014-11-07",
    runtime: 169,
    posterUrl: "https://image.tmdb.org/t/p/w500/rAiYTfKGqDCRIIqo664sY9XZIvQ.jpg",
  },
  {
    _id: "3",
    title: "The Dark Knight",
    genres: "Action | Crime",
    rating: 9.0,
    releaseDate: "2008-07-18",
    runtime: 152,
    posterUrl: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
  },
  {
    _id: "4",
    title: "Avengers: Endgame",
    genres: "Action | Sci-Fi",
    rating: 8.4,
    releaseDate: "2019-04-26",
    runtime: 181,
    posterUrl: "https://image.tmdb.org/t/p/w500/ulzhLuWrPK07P1YkdWQLZnQh1JL.jpg",
  },
  {
    _id: "5",
    title: "Spider-Man: No Way Home",
    genres: "Action | Adventure",
    rating: 8.3,
    releaseDate: "2021-12-17",
    runtime: 148,
    posterUrl: "https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg",
  },
  {
    _id: "6",
    title: "The Matrix",
    genres: "Sci-Fi | Action",
    rating: 8.7,
    releaseDate: "1999-03-31",
    runtime: 136,
    posterUrl: "https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
  },
  {
    _id: "7",
    title: "Oppenheimer",
    genres: "Biography | Drama",
    rating: 8.6,
    releaseDate: "2023-07-21",
    runtime: 180,
    posterUrl: "https://image.tmdb.org/t/p/w500/8QVDXDiOGHRcAD4oM6MXjE0osSj.jpg",
  },
  {
    _id: "8",
    title: "Dune: Part One",
    genres: "Sci-Fi | Adventure",
    rating: 8.1,
    releaseDate: "2021-10-22",
    runtime: 155,
    posterUrl: "https://image.tmdb.org/t/p/w500/d5NXSklXo0qyIYkgV94XAgMIckC.jpg",
  },
  {
    _id: "9",
    title: "Joker",
    genres: "Drama | Thriller",
    rating: 8.5,
    releaseDate: "2019-10-04",
    runtime: 122,
    posterUrl: "https://image.tmdb.org/t/p/w500/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg",
  },
  {
    _id: "10",
    title: "The Batman",
    genres: "Action | Crime",
    rating: 7.9,
    releaseDate: "2022-03-04",
    runtime: 176,
    posterUrl: "https://image.tmdb.org/t/p/w500/74xTEgt7R36Fpooo50r9T25onhq.jpg",
  },
  {
    _id: "11",
    title: "Guardians of the Galaxy Vol. 3",
    genres: "Action | Sci-Fi",
    rating: 8.2,
    releaseDate: "2023-05-05",
    runtime: 150,
    posterUrl: "https://image.tmdb.org/t/p/w500/r2J02Z2OpNTctfOSN1Ydgii51I3.jpg",
  },
  {
    _id: "12",
    title: "Doctor Strange in the Multiverse of Madness",
    genres: "Fantasy | Action",
    rating: 6.9,
    releaseDate: "2022-05-06",
    runtime: 126,
    posterUrl: "https://image.tmdb.org/t/p/w500/9Gtg2DzBhmYamXBS1hKAhiwbBKS.jpg",
  },
  {
    _id: "13",
    title: "Avatar: The Way of Water",
    genres: "Fantasy | Adventure",
    rating: 7.6,
    releaseDate: "2022-12-16",
    runtime: 192,
    posterUrl: "https://image.tmdb.org/t/p/w500/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg",
  },
  {
    _id: "14",
    title: "Tenet",
    genres: "Action | Sci-Fi",
    rating: 7.4,
    releaseDate: "2020-09-03",
    runtime: 150,
    posterUrl: "https://image.tmdb.org/t/p/w500/k68nPLbIST6NP96JmTxmZijEvCA.jpg",
  },
  {
    _id: "15",
    title: "John Wick: Chapter 4",
    genres: "Action | Thriller",
    rating: 8.2,
    releaseDate: "2023-03-24",
    runtime: 169,
    posterUrl: "https://image.tmdb.org/t/p/w500/zhLKlUaF1SEpO58ppHIAyENkwgw.jpg",
  },
];


const Movies = () => {
  return (
    <div className="px-6 md:px-16 lg:px-24 xl:px-44 overflow-hidden">
      <p className="text-logo-gradient text-3xl font-semibold">
        New in Cinemas
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-10">
        {movies.map((movie) => (
          <MovieCard key={movie._id} movie={movie} />
        ))}
      </div>
    </div>
  );
};

export default Movies;
