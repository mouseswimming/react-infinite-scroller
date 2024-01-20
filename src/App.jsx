import { useCallback, useRef, useState } from "react";
import useBookSearch from "./useBookSearch";

function App() {
  const [query, setQuery] = useState("");
  const [pageNumber, setPageNumber] = useState(1);

  const { books, isLoading, hasError, hasMore } = useBookSearch(
    query,
    pageNumber
  );

  // save to ref so we can get the observer reference after re-render
  const observer = useRef();

  const lastBookRef = useCallback(
    (elm) => {
      if (isLoading) return;

      if (observer.current) {
        observer.current.disconnect();
      }
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          if (hasMore) {
            setPageNumber((prev) => prev + 1);
          }
        }
      });

      if (elm) {
        observer.current.observe(elm);
      }
    },
    [isLoading, hasMore]
  );

  return (
    <>
      <h1 className="text-4xl text-center my-8">Infinite Scroll</h1>
      <div className="container m-auto max-w-5xl ">
        <div className="mb-4">
          <input
            type="text"
            placeholder="search book"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full border border-gray-600 rounded p-4"
          />
        </div>
        <div className="grid gap-y-2">
          {books.map((book, index) => {
            if (index === books.length - 1) {
              return (
                <div key={book.key} ref={lastBookRef}>
                  {book.title}
                </div>
              );
            } else {
              return (
                <div key={book.key}>
                  {book.title} ({book.publisher})
                </div>
              );
            }
          })}
        </div>
        {hasError && <div className="text-red-700">Error</div>}
        {isLoading && (
          <div className="text-blue-600 text-center">Loading ...</div>
        )}
      </div>
    </>
  );
}

export default App;
