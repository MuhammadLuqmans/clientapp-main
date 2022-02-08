import { createStyles, makeStyles } from '@material-ui/core';
import styled from 'styled-components';

const useStyles = makeStyles(() =>
  createStyles({
    clearIndicatorDirty: {
      display: 'none',
    },
  })
);

const InputContainer = styled.div`
  width: 100%;
  margin-bottom: 20px;
  position: relative;

  //select input icon
  button {
    display: none;
  }

  svg {
    display: none;
    /* position: absolute;
    bottom: 15px;
    right: 20px;
    fill: #dadada; */
  }
`;

const Error = styled.span`
  color: rgb(221 51 54);
  margin: 0;
  font-size: 0.75rem;
  margin: -30px 0 10px;
  text-align: left;
  font-family: 'Roboto', 'Helvetica', 'Arial', sans-serif;
  font-weight: 400;
  line-height: 1.66;
  letter-spacing: 0.03333em;
`;

export { useStyles, InputContainer, Error };
