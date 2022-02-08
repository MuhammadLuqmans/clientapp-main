import { Button as MaterialButton, ButtonProps } from '@material-ui/core';
import React, { forwardRef, HTMLAttributes } from 'react';
import { useScreenSizes } from '../../hooks';
import { useStyles } from './Button.style';

interface IProps extends HTMLAttributes<HTMLButtonElement> {
  value?: string;
  buttonType?: 'default' | 'dangerButton';
  alignment?: 'center' | 'flex-start' | 'flex-end';
  small?: boolean;
}

const Button: React.FC<IProps & ButtonProps> = forwardRef(
  (
    {
      buttonType = 'default',
      children,
      startIcon,
      endIcon,
      alignment,
      color,
      small,
      ...buttonProps
    },
    ref
  ) => {
    const { isMobileScreen, isTabletScreen } = useScreenSizes();
    const classes = useStyles({ alignment, isMobileScreen, isTabletScreen });

    return (
      <div className={classes.root}>
        <MaterialButton
          ref={ref}
          className={`${classes[buttonType]} ${small && classes.smallButton} `}
          variant='contained'
          startIcon={startIcon}
          endIcon={endIcon}
          color={color}
          {...buttonProps}
        >
          <span className={classes.text}>{children}</span>
        </MaterialButton>
      </div>
    );
  }
);

export default Button;
