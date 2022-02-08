// import { randomInt, randomUserName } from "@mui/x-data-grid-generator";
import { DataGridPro, useGridApiRef } from '@mui/x-data-grid-pro';
import * as React from 'react';
import { interval } from 'rxjs';

const columns = [
  { field: 'id' },
  { field: 'username', width: 150 },
  { field: 'age', width: 80, type: 'number' },
];

const rows = [
  // { id: 1, username: 'user', age: 2 },
  // { id: 1, username: 'user', age: 2 },
  // { id: 1, username: 'user', age: 2 },
  // { id: 1, username: 'user', age: 2 },
];

export default function ApiRefRowsGrid() {
  const apiRef = useGridApiRef();

  React.useEffect(() => {
    const subscription = interval(200).subscribe(() => {
      apiRef.current.updateRows([
        {
          id: 1,
          username: 'userr',
          age: Math.random(),
        },
        {
          id: 2,
          username: 'userr',
          age: Math.random(),
        },
      ]);
    });

    return () => {
      console.log('unsub');
      subscription.unsubscribe();
    };
  }, [apiRef]);

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPro
        rows={rows}
        columns={columns}
        apiRef={apiRef}
        rowHeight={25}
        // throttleRowsMs={2000}
      />
    </div>
  );
}
