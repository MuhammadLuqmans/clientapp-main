import { returnMockApiResponse } from '../../utilities';

interface IProps {
  symbol: string;
  thesis: string;
  tactic: 'S' | 'O';
  stockUnderlying: string;
}

export const addTrade = ({ ...instrument }: IProps) => {
  const mockResponse = [
    {
      id: 1,
      symbol: 'Google',
      type: '1.2',
      thesis: 'PB at Resistance',
      tactic: 'S',
      stockUnderlying: '$90.24',
    },
    {
      id: 2,
      symbol: 'Amazon',
      type: '1.2',
      thesis: 'PB at Resistance',
      tactic: 'O',
      stockUnderlying: '$91.24',
    },
    {
      id: 3,
      symbol: 'Tesla',
      type: '1.2',
      thesis: 'PB at Resistance',
      tactic: 'S',
      stockUnderlying: '$92.24',
    },
    {
      id: 4,
      symbol: instrument.symbol,
      type: '1.2',
      thesis: instrument.thesis,
      tactic: instrument.tactic,
      stockUnderlying: `$${instrument.stockUnderlying}`,
    },
  ];
  return returnMockApiResponse(mockResponse);
};
