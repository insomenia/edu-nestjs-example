import { paginationObj } from '@app/common';

export const createPaginationObj = ({
  totalData,
  takePages,
  page,
}: paginationObj) => {
  const currentCounts = takePages * page;

  const paginationObj = {
    totalPages: Math.ceil(totalData / takePages),
    totalResults: totalData,
    nextPage: currentCounts < totalData ? +page + 1 : null,
    hasNextPage: currentCounts < totalData ? true : false,
    prevPage: page <= 1 ? null : page - 1,
    hasPrevPage: page <= 1 ? false : true,
  };
  return paginationObj;
};
