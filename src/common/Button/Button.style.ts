import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles<Theme>((theme) =>
  createStyles({
    root: {
      display: 'flex',
      justifyContent: (props: any) => props.alignment,
      alignSelf: 'center',

      '& > *': {
        margin: 0,
        textTransform: 'capitalize',
        letterSpacing: '.7px',
        height: 48,
        borderRadius: 8,
        boxShadow: '0px 3px 5px rgba(0, 0, 0, 0.1)',
        color: '#fff',
        padding: '15px 20px',

        '&:disabled': {
          cursor: 'not-allowed !important',
          pointerEvents: 'all',
        },
      },
    },
    default: {
      backgroundColor: theme.palette.primary.main,
      alignSelf: 'flex-end',
      width: (props: any) => props.isTabletScreen && 200,

      '&:hover': {
        backgroundColor: theme.palette.primary.dark,
      },
    },
    dangerButton: {
      backgroundColor: theme.palette.error.main,

      '&:hover': {
        backgroundColor: theme.palette.error.dark,
      },
    },
    smallButton: {
      height: (props: any) => (props.isTabletScreen ? 44 : 38),
    },
  })
);

export { useStyles };
