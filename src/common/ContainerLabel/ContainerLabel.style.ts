import styled from 'styled-components';

const Container = styled.div`
  margin: 15px 0;
`;

const Content = styled.div`
  margin: 10px 0;
`;

interface IProps {
  size: 'small' | 'large';
}

const Label = styled.div<IProps>`
  font-size: ${(props) => (props.size == 'small' ? '1em' : '1.5em')};
`;

export { Container, Content, Label };
