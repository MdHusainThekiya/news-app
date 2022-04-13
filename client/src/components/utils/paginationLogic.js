const PaginationLogic = (totalData, currentPage, dataNeededInOnePagination) => {
  // console.log(totalData, currentPage, dataNeededInOnePagination);
  const startIndex = (currentPage - 1) * dataNeededInOnePagination;
  const endIndex = startIndex + dataNeededInOnePagination;
  const PaginatedArray = totalData.slice(startIndex, endIndex);
  return PaginatedArray;
};

export default PaginationLogic; 


// this will take a complete array, devide elements as per required elements on one page