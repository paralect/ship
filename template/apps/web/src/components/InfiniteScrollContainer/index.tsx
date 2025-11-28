import { FC, UIEventHandler, useEffect } from 'react';
import { Center, Loader, ScrollAreaAutosize, ScrollAreaProps, Stack } from '@mantine/core';
import { useInViewport } from '@mantine/hooks';

export interface InfiniteScrollProps extends ScrollAreaProps {
  children: React.ReactNode;
  fetchNextData: () => void;
  hasMore: boolean;
  maxContainerHeight?: number | string;
  isFetchingNextPage: boolean;
  isLoading: boolean;
}

const InfiniteScrollContainer: FC<InfiniteScrollProps> = ({
  children,
  maxContainerHeight,
  hasMore,
  fetchNextData,
  isFetchingNextPage,
  isLoading,
  ...props
}) => {
  const { ref: loadMoreBlockRef, inViewport } = useInViewport();

  useEffect(() => {
    if (inViewport && hasMore && !isFetchingNextPage && !isLoading) {
      fetchNextData();
    }
  }, [inViewport, hasMore, isLoading, isFetchingNextPage]);

  const handleViewportScroll: UIEventHandler<HTMLDivElement> = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;

    if (Math.abs(scrollHeight - clientHeight - scrollTop) < 1 && hasMore && !isLoading) {
      fetchNextData();
    }
  };

  return (
    <ScrollAreaAutosize
      mah={maxContainerHeight}
      viewportProps={{
        onScroll: handleViewportScroll,
      }}
      {...props}
    >
      {children}

      <Stack ref={loadMoreBlockRef} />

      {isFetchingNextPage && (
        <Center mt="sm">
          <Loader size="sm" />
        </Center>
      )}
    </ScrollAreaAutosize>
  );
};

export default InfiniteScrollContainer;
