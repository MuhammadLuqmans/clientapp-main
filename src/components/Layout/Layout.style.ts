import { createStyles, makeStyles } from '@material-ui/core/styles';
import styled from 'styled-components';

const useStyles = makeStyles(() =>
  createStyles({
    drawer: {
      width: '200px',
    },
    drawerItemsBox: {
      width: '100%',
      '& a': {
        textDecoration: 'none',
      },
      '& span': {
        color: '#000',
      },
    },
    account: {
      fontSize: '0.9em',
      paddingLeft: '5px',
      color: '#fff',
    },
    children: { padding: '20px', fontSize: '20px' },
  })
);

const NavContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 30px;

  a {
    margin-bottom: 20px;
    width: 100%;
    color: #000;

    &:active {
      color: #000;
    }

    div {
      justify-content: center;
      display: flex;
    }
  }
`;

export { useStyles, NavContainer };
