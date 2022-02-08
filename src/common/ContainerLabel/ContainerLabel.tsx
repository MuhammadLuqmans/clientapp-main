import { Divider } from '@material-ui/core';
import { Container, Content, Label } from './ContainerLabel.style';

interface IProps {
  label?: string;
  size?: 'small' | 'large';
}

const ContainerLabel: React.FC<IProps> = ({
  children,
  label,
  size = 'small',
}) => {
  return (
    <Container>
      <Content>{<Label size={size}>{label}</Label> || children}</Content>
      <Divider />
    </Container>
  );
};

export default ContainerLabel;
