import React, { useCallback, useEffect, useRef, useState } from "react";

interface InfiniteScrollProps {
  fetchMoreData: () => Promise<void>;
  hasMore: boolean;
}

const InfiniteScroll: React.FC<InfiniteScrollProps> = ({
  fetchMoreData,
  hasMore,
}) => {
  const [isFetching, setIsFetching] = useState(false);
  const observer = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const loadMoreItems = useCallback(async () => {
    if (isFetching || !hasMore) return;

    setIsFetching(true);
    await fetchMoreData();
    setIsFetching(false);
  }, [isFetching, hasMore, fetchMoreData]);

  useEffect(() => {
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        loadMoreItems();
      }
    });
    if (loadMoreRef.current) observer.current.observe(loadMoreRef.current);

    return () => observer.current?.disconnect();
  }, [loadMoreItems]);

  return <div ref={loadMoreRef} />;
};

export default InfiniteScroll;
