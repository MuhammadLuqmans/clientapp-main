import { returnMockApiResponse } from '../../utilities';
import { IInstrument } from './interfaces';

export const getOpenTrades = (): Promise<IInstrument[]> => {
  const mockResponse: IInstrument[] = [
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
  ];
  return returnMockApiResponse(mockResponse);
};
