import React, { useState, useEffect } from "react";
import { CSVLink } from "react-csv";
import { FaFileCsv } from "react-icons/fa6";

const DownloadExcelButton = ({ data }) => {
  const [csvData, setCsvData] = useState(null);
  useEffect(() => {
    console.log("Data to Excel: ", data);
    if (data) {
      const headers = Object.keys(data);
      const tempData = [headers, headers.map((header) => data[header])];
      setCsvData(tempData);
    }
  }, [data]);
  return (
    <>
      {csvData ? (
        <CSVLink
          data={csvData}
          filename="exported_data.csv"
          className="btn btn-primary"
          target="_blank"
        >
          <button className="bg-[#c095e4] border-2 border-black text-xl text-black">
            <FaFileCsv />
          </button>
        </CSVLink>
      ) : <div></div>}
    </>
  );
};

export default DownloadExcelButton;
