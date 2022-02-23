import React from "react";
import Helmet from "react-helmet";

function SEO({ title }) {
  const titleText = title ? `${title} · HomeHealth` : "HomeHealth";

  return (
    <Helmet>
      <title>{titleText}</title>
    </Helmet>
  );
}

export default SEO;