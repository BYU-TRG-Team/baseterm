import React from 'react';
import Pagination from 'react-responsive-pagination';
import './index.css';

interface Props {
  pageCount: number,
  onChange: (page: number) => void,
  page: number,
}

const PaginationComponent: React.FC<Props> = ({
  pageCount,
  onChange,
  page,
}: Props) => {

  return (
    <Pagination
      total={pageCount}
      onPageChange={onChange}
      current={page}
      maxWidth={320}
    />
  )
};

export default PaginationComponent;