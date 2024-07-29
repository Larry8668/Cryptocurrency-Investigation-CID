import React, { useState, useEffect } from "react";
import { CSVLink } from "react-csv";
import { FaFileCsv } from "react-icons/fa6";
import { Tooltip as ReactTooltip } from "react-tooltip";

const extractAddresses = (dataArray) => {
  return dataArray.map((data) => {
    const { from_address, to_address, hash , block_timestamp, value, from_address_label, to_address_label, block_number  } = data;
    return { from_address, to_address, hash , block_timestamp, value, from_address_label, to_address_label, block_number  };
  });
};

const formatDataToCSV = (dataArray) => {
  const headers = Object.keys(dataArray[0]);
  const rows = dataArray.map((data) => headers.map((header) => data[header]));

  return [headers, ...rows];
};

const DownloadExcelButton = ({ data, node }) => {
  const [csvData, setCsvData] = useState(null);
  useEffect(() => {
    if (data && data.length > 0) {
      const addressData = extractAddresses(data);
      const formattedData = formatDataToCSV(addressData);
      setCsvData(formattedData);
    }
  }, [data]);
  return (
    <>
      {csvData ? (
        <CSVLink
          data={csvData}
          filename={`${node}.csv`}
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
