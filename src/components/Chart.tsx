import React from 'react';
import { Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Label,
  ResponsiveContainer,
} from 'recharts';
import Title from './Title';
import { ChartData } from '../config/types';

interface Props {
  data: Array<ChartData>;
  rollingAverage: number;
}

export default function Chart({ data, rollingAverage }: Props) {
  const theme = useTheme();

  return (
    <>
      <Title>Average Active Users (Last 7 Days)</Title>
      <Typography
        component="p"
        variant="h4"
      >
        {rollingAverage}
      </Typography>
      <ResponsiveContainer>
        <LineChart
          data={data}
          margin={{
            top: 16,
            right: 16,
            bottom: 0,
            left: 24,
          }}
        >
          <XAxis
            dataKey="date"
            stroke={theme.palette.text.secondary}
            style={theme.typography.body2}
          />
          <YAxis
            stroke={theme.palette.text.secondary}
            style={theme.typography.body2}
          >
            <Label
              angle={270}
              position="left"
              style={{
                textAnchor: 'middle',
                fill: theme.palette.text.primary,
                ...theme.typography.body1,
              }}
            >
              Users
            </Label>
          </YAxis>
          <Line
            isAnimationActive={false}
            type="monotone"
            dataKey="activeUsers"
            stroke={theme.palette.primary.main}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </>
  );
}
