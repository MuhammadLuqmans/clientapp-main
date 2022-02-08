import { createStyles, makeStyles } from '@material-ui/core';

const useStyles = makeStyles(() =>
  createStyles({
    formControl: {
      marginRight: 10,
      minWidth: 70,
    },
    select: {
      overflow: 'none',
      '& div': {
        paddingRight: '15px !important',
        padding: '8px 15px',
        display: 'flex',
        justifyContent: 'center',
        textTransform: 'uppercase',
        fontSize: '.8em',
      },

      '& svg': {
        display: 'none',
      },
    },
  })
);

export { useStyles };
