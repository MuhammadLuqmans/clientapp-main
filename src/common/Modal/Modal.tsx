import Dialog from '@material-ui/core/Dialog';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import {
  createStyles,
  makeStyles,
  Theme,
  withStyles,
  WithStyles,
} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import React from 'react';

const styles = (theme: Theme) =>
  createStyles({
    root: {
      margin: 0,
      padding: theme.spacing(2),
      width: '90%',
    },
    closeButton: {
      position: 'absolute',
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.grey[500],
    },
  });

export interface DialogTitleProps extends WithStyles<typeof styles> {
  id: string;
  children: React.ReactNode;
  onClose: () => void;
}

const DialogTitle = withStyles(styles)((props: DialogTitleProps) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant='h6'>{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label='close'
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme: Theme) => ({
  root: {
    padding: theme.spacing(2),
    paddingTop: 30,
  },
}))(MuiDialogContent);

interface IModalProps {
  title: string;
  isOpen: boolean;
  minimize: () => void;
  handleClose: () => void;
  fullScreen?: boolean;
}

const Modal: React.FC<IModalProps> = ({
  title,
  isOpen,
  minimize,
  handleClose,
  children,
  fullScreen,
}) => {
  const classes = makeStyles({
    modalHeader: {
      display: 'flex',
      alignItems: 'center',
    },
    modalContent: {
      overflowX: 'hidden',
    },
    closeIconContainer: {
      position: 'absolute',
      right: '10px',
      cursor: 'pointer',

      '&:active': {
        outline: 'none',
      },
    },
    overrides: {
      maxWidth: fullScreen ? 'unset' : '600px',
      width: fullScreen ? '95%' : '80%',
      height: fullScreen ? '95%' : 'auto',
    },
  })();

  return (
    <Dialog
      onClose={minimize}
      aria-labelledby='customized-dialog-title'
      open={isOpen}
      classes={{
        paperWidthSm: classes.overrides,
      }}
      disableEnforceFocus
    >
      <div className={classes.modalHeader}>
        <DialogTitle id='customized-dialog-title' onClose={minimize}>
          {title}
        </DialogTitle>
        <div
          className={classes.closeIconContainer}
          onClick={handleClose}
          role='button'
          tabIndex={-1}
          onKeyDown={handleClose}
        >
          <CloseIcon color='disabled' fontSize='large' />
        </div>
      </div>
      <DialogContent dividers className={classes.modalContent}>
        {children}
      </DialogContent>
    </Dialog>
  );
};

export default Modal;
