import * as React from 'react';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import Typography from '@mui/material/Typography';
export function OppositeContentTimeline() {
  return (
    <React.Fragment>

        <Typography  color="white" fontSize="42px">
            LockBox Roadmap
        </Typography>
      <Timeline position="alternate">
        <TimelineItem>
          <TimelineOppositeContent>
            Q1 2021
          </TimelineOppositeContent>
          <TimelineSeparator>
            <TimelineDot />
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>Implement basic functionality and release public beta</TimelineContent>
        </TimelineItem>
        <TimelineItem>
          <TimelineOppositeContent>
          Q2 2021
          </TimelineOppositeContent>
          <TimelineSeparator>
            <TimelineDot />
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>Support more wallets and release the product in full</TimelineContent>
        </TimelineItem>
        <TimelineItem>
          <TimelineOppositeContent >
          Q3 2021
          </TimelineOppositeContent>
          <TimelineSeparator>
            <TimelineDot />
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>Add additional functionality to contracts including new types of contracts</TimelineContent>
        </TimelineItem>
        <TimelineItem>
          <TimelineOppositeContent >
          Q4 2021
          </TimelineOppositeContent>
          <TimelineSeparator>
            <TimelineDot />
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>Expand to more chains</TimelineContent>
        </TimelineItem>
      </Timeline>
    </React.Fragment>
  );
}