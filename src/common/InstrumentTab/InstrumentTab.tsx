import { useTheme } from '@material-ui/core';
import { RemoveCircleOutline as RemoveIcon } from '@material-ui/icons';
import { useEffect, useState } from 'react';
import { Container, Content, Label, Price } from './InstrumentTab.style';

interface IProps {
  label: string;
  removeInstrument: (id: string) => void;
}

const InstrumentTab: React.FC<IProps> = ({
  label,
  removeInstrument,
  children,
}) => {
  const theme = useTheme();
  return (
    <Container color={theme.palette.primary.main}>
      <Content>
        <Label>{label}</Label>
        {children}
      </Content>
      <RemoveIcon
        color='error'
        style={{ cursor: 'pointer' }}
        onClick={() => removeInstrument(label)}
      />
    </Container>
  );
};

export default InstrumentTab;
