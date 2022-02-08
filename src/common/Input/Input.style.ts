import styled from 'styled-components';
import { IScreenSizesProps } from '../../styles/interfaces';

const Container = styled.div<IScreenSizesProps>`
  position: relative;
  display: flex;
  align-items: center;
  flex-grow: 1;
  padding-right: ${(props) => (props.isTabletScreen ? '0' : '18px')};
  padding-bottom: 0;
  margin-bottom: 10px;

  svg {
    position: absolute;
    bottom: ${(props) => (props.isTabletScreen ? '25px' : '10px')};
    right: 40px;
    fill: #dadada;
  }

  input {
    font-size: 14px;
    font-weight: 400;
    line-height: 1.71em;
    letter-spacing: 0.15px;
    width: 100%;
    border-radius: 8px;
  }
`;

export { Container };
