import React, { useState, useEffect } from "react";
import { CSVLink } from "react-csv";
import { FaFileCsv } from "react-icons/fa6";
import { Tooltip as ReactTooltip } from "react-tooltip";

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
          <button
            data-tooltip-id="Download CSV"
            data-tooltip-content="Download as CSV"
            className="border-2 border-black text-md text-green bg-transparent"
          >
            <FaFileCsv />
          </button>
          <ReactTooltip
            id={"Download CSV"}
            place="bottom"
            effect="solid"
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.85)",
              color: "#fff",
              padding: "4px 8px",
              borderRadius: "4px",
              fontSize: "12px",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
            }}
          />
        </CSVLink>
      ) : (
        <div></div>
      )}
    </>
  );
};

export default DownloadExcelButton;
