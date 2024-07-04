import React from 'react'
import { CopyToClipboard } from "react-copy-to-clipboard";
import { FaCopy } from "react-icons/fa6";

export const copyClipboard = ({text}) => {
  return (
    <div>
        <CopyToClipboard
                  text={text}
                  onCopy={() => {
                    toast.success("Copied to clipboard!");
                  }}
                >
                  <span className="p-1 cursor-pointer border-2 border-gray-500 rounded-md">
                    <FaCopy />
                  </span>
                </CopyToClipboard>
    </div>
  )
}

export default copyClipboard