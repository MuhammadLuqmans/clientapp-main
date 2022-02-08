import { makeStyles, useTheme } from '@material-ui/core';
import { DataGrid, GridToolbar } from '@material-ui/data-grid';

interface IProps {
  rows: any;
  columns: any;
}

const DataGridTable: React.FC<IProps> = ({ rows, columns }) => {
  const theme = useTheme();

  const classes = makeStyles({
    rootOverrides: {
      '& button': {
        color: theme.palette.info.dark,
      },
      '& svg': {
        fill: theme.palette.info.dark,
      },
      '&.MuiDataGrid-root .MuiDataGrid-cell:focus': {
        outline: 'none',
      },
    },
  })();

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid        
        rows={rows}
        columns={columns}
        isRowSelectable={() => false}
        components={{
          Toolbar: GridToolbar,
        }}
        classes={{
          root: classes.rootOverrides,
        }}
      />
    </div>
  );
};

export default DataGridTable;
