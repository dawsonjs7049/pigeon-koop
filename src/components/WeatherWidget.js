import { Box } from '@chakra-ui/react';
import React, { useEffect } from 'react';

export default function WeatherWidget() {
  useEffect(() => {
    (function (d, s, id) {
      const fjs = d.getElementsByTagName(s)[0];
      const js = d.createElement(s);
      js.id = id;
      js.src = 'https://weatherwidget.io/js/widget.min.js';
      js.defer = true;
      fjs.parentNode && fjs.parentNode.insertBefore(js, fjs);
    })(document, 'script', 'weatherwidget-io-js');
  }, []);

  return (
    <Box style={{ minHeight: '98px !important', height: '98px'}} bg='blue.800'>
      <a
        style={{ height: '100%' }}
        className="weatherwidget-io"
        href="https://forecast7.com/en/45d88n92d37/webster/?unit=us"
        data-label_1="WEBSTER"
        data-label_2="WEATHER"
        data-theme="original"
      >
      </a>
    </Box>
  );
};