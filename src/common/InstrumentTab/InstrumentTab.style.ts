import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 10px;
  border: 1px solid ${(props) => props.color};
  height: 55px;
  border-radius: 4px;
  outline: none;
  box-shadow: none;
  background-color: transparent;
  margin-bottom: 10px;
`;

const Content = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: -10px;
`;

const Label = styled.div`
  margin-right: 20px;
  min-width: 70px;
`;

const Price = styled.div`
  color: ${(props) => props.color};
`;

export { Container, Content, Label, Price };
