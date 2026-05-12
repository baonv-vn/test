import { Text, type TextStyle } from 'react-native';
import { useSessionTimer } from '../../hooks/useSessionTimer';
import { formatSeconds } from '../../utils/format';

type TimerTextProps = {
  endsAt?: number;
  style?: TextStyle;
};

export const TimerText = ({ endsAt, style }: TimerTextProps) => {
  const { remainingSeconds } = useSessionTimer({ endsAt });

  return <Text style={style}>{formatSeconds(remainingSeconds)}</Text>;
};
