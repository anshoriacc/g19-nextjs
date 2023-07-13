import React from 'react';

export default function Map() {
  return (
    <div className="mapouter">
      <div className="gmap_canvas">
        <iframe
          className="gmap_iframe"
          width="100%"
          frameBorder={0}
          scrolling="no"
          marginHeight={0}
          marginWidth={0}
          src="https://maps.google.com/maps?width=400&amp;height=240&amp;hl=en&amp;q=Jl. Margo Basuki&amp;t=&amp;z=14&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"
        />
      </div>
    </div>
  );
}
