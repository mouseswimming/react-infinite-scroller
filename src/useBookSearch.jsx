import { useEffect, useState } from "react";
import axios from "axios";

const BOOK_API = "https://openlibrary.org/search.json";

export default function useBookSearch(query, pageNumber) {
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    setBooks([]);
  }, [query]);

  useEffect(() => {
    console.log({ query, pageNumber });
    setHasError(false);
    setIsLoading(true);

    const controller = new AbortController();
    axios
      .get(BOOK_API, {
        params: { q: query, page: pageNumber },
        signal: controller.signal,
      })
      .then((resp) => {
        setBooks((prevBooks) => [...prevBooks, ...resp.data.docs]);
        setHasMore(
          resp.data.numFound > resp.data.start + resp.data.docs.length
        );
      })
      .catch((e) => {
        if (axios.isCancel(e)) return;
        setHasError(true);
      })
      .finally(() => setIsLoading(false));

    return () => {
      controller.abort();
    };
  }, [query, pageNumber]);

  return { books, isLoading, hasError, hasMore };
}
