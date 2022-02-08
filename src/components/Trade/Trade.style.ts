import styled from 'styled-components';

const InputContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  flex-grow: 1;
  padding-right: 18px;
  padding-bottom: 0;
  margin-bottom: 10px;
  gap: 10px;

  p {
    display: none;
  }

  svg {
    position: absolute;
    bottom: 10px;
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

export { InputContainer };
