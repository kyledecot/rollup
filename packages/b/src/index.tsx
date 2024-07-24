import React, { useEffect } from 'react';

import './worker.js';

export const B = () => {
  const [worker, setWorker] = React.useState<Worker | null>(null);

  useEffect(() => {
    const worker = new Worker(new URL('./worker.js', import.meta.url));
    setWorker(worker);

    return () => {
      worker.terminate();
    };

  }, []);

  return <div>B</div>;
}
