'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export default function Pagination({
  hasNextPage,
  endCursor,
}: {
  hasNextPage: boolean;
  endCursor: string | null | undefined;
}) {
  const searchParams = useSearchParams();
  const currentPage = searchParams.get('page') ? parseInt(searchParams.get('page') as string, 10) : 1;

  const createPageURL = (pageNumber: number, cursor: string | null | undefined) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', pageNumber.toString());
    if (cursor) {
      params.set('after', cursor);
    } else {
      params.delete('after');
      params.delete('page'); // Go back to the first page
    }
    return `?${params.toString()}`;
  };

  return (
    <div className="flex justify-center items-center space-x-4 mt-12">
      {currentPage > 1 && (
        <Link 
          href={createPageURL(currentPage - 1, null)} // This is simplified, real prev page needs startCursor
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-neutral-dark bg-white rounded-full border border-gray-300 hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft size={16} />
          Previous
        </Link>
      )}

      <span className="text-sm font-medium">Page {currentPage}</span>

      {hasNextPage && (
        <Link 
          href={createPageURL(currentPage + 1, endCursor)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-neutral-dark bg-white rounded-full border border-gray-300 hover:bg-gray-100 transition-colors"
        >
          Next
          <ArrowRight size={16} />
        </Link>
      )}
    </div>
  );
} 