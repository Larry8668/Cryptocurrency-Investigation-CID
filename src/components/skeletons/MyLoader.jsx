import React from "react"
import ContentLoader from "react-content-loader"

const MyLoader = (props) => (
  <ContentLoader 
    speed={2}
    width={550}
    height={180}
    viewBox="0 0 550 180"
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
    {...props}
  >
    <circle cx="31" cy="31" r="31" /> 
    <rect x="3" y="68" rx="5" ry="5" width="57" height="17" /> 
    <circle cx="100" cy="31" r="31" /> 
    <rect x="72" y="68" rx="5" ry="5" width="57" height="17" /> 
    <circle cx="168" cy="31" r="31" /> 
    <rect x="140" y="68" rx="5" ry="5" width="57" height="17" /> 
    <circle cx="237" cy="31" r="31" /> 
    <rect x="209" y="68" rx="5" ry="5" width="57" height="17" /> 
    <circle cx="305" cy="31" r="31" /> 
    <rect x="277" y="68" rx="5" ry="5" width="57" height="17" /> 
    <circle cx="374" cy="31" r="31" /> 
    <rect x="346" y="68" rx="5" ry="5" width="57" height="17" /> 
    <circle cx="442" cy="31" r="31" /> 
    <rect x="414" y="68" rx="5" ry="5" width="57" height="17" /> 
    <circle cx="511" cy="31" r="31" /> 
    <rect x="483" y="68" rx="5" ry="5" width="57" height="17" /> 
    <circle cx="32" cy="124" r="31" /> 
    <rect x="4" y="161" rx="5" ry="5" width="57" height="17" /> 
    <circle cx="101" cy="124" r="31" /> 
    <rect x="73" y="161" rx="5" ry="5" width="57" height="17" /> 
    <circle cx="169" cy="124" r="31" /> 
    <rect x="141" y="161" rx="5" ry="5" width="57" height="17" /> 
    <circle cx="238" cy="124" r="31" /> 
    <rect x="210" y="161" rx="5" ry="5" width="57" height="17" /> 
    <circle cx="306" cy="124" r="31" /> 
    <rect x="278" y="161" rx="5" ry="5" width="57" height="17" /> 
    <circle cx="375" cy="124" r="31" /> 
    <rect x="347" y="161" rx="5" ry="5" width="57" height="17" /> 
    <circle cx="443" cy="124" r="31" /> 
    <rect x="415" y="161" rx="5" ry="5" width="57" height="17" /> 
    <circle cx="512" cy="124" r="31" /> 
    <rect x="484" y="161" rx="5" ry="5" width="57" height="17" />
  </ContentLoader>
)

export default MyLoader

