import styled from 'styled-components';

const CheckboxContainer = styled.div`
  margin: 10px 5px 10px 0;

  span {
    padding-right: 0;
    font-size: 18px;
  }
  label {
    margin-right: 0;
  }

  svg {
    fill: ${(props) => props.color};
  }
`;

export { CheckboxContainer };
