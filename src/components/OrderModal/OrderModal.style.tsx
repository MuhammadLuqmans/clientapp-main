import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 10px;
  border-radius: 4px;
  outline: none;
  box-shadow: none;
  background-color: transparent;
  margin-bottom: 10px;
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
`;

const Row = styled.div`
  display: flex;
  flex-direction: row
  flex-wrap: wrap;
  height: 100%;
  width: 100%;
  align-items: center;
  margin-bottom: 10px;
`;

export { Container, Column, Row };
