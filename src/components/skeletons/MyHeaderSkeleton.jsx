import React from "react"
import ContentLoader from "react-content-loader"

const MyLoader = (props) => (
  <ContentLoader 
    speed={2}
    width={800}
    height={50}
    viewBox="0 0 900 50"
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
    {...props}
  >
    <rect x="6" y="8" rx="3" ry="3" width="852" height="6" /> 
    <rect x="6" y="24" rx="3" ry="3" width="804" height="6" /> 
    <rect x="6" y="40" rx="3" ry="3" width="483" height="6" />
  </ContentLoader>
)

export default MyLoader
