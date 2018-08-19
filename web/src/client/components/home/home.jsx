// @flow

import React, { Component } from 'react';
import type { Node } from 'react';

import { FaClock } from 'react-icons/fa';

import styles from './home.styles.pcss';

type MeetingType = {
  time: string,
  description: string,
  participants: Array<string>,
};

const meetingsList: Array<MeetingType> = [
  {
    time: '08:00 AM',
    description: 'Discussion of the attack strategy',
    participants: [
      'Obi-Wan Kenobi',
      'Luke Skywalker',
    ],
  },
  {
    time: '11:00 AM',
    description: 'Family meeting to discuss disagreements',
    participants: [
      'Anakin Skywalker',
      'Luke Skywalker',
    ],
  },
  {
    time: '02:00 PM',
    description: 'Attack on Death Star',
    participants: [
      'Luke Skywalker',
      'Han Solo',
    ],
  },
];

class Home extends Component<*> {
  static participantsList(participants: Array<string>): Array<React$Node> {
    return participants.map((participator: string): React$Node => {
      return (
        <li key={participator}>
          {participator}
        </li>
      );
    });
  }

  static meetings(): Array<React$Node> {
    return meetingsList.map((meeting: MeetingType): React$Node => {
      return (
        <div
          key={meeting.description}
          className={styles.meeting}
        >
          <div className={styles.time}>
            <FaClock size={15} />
            <span>
              {meeting.time}
            </span>
          </div>

          <div className={styles.description}>
            {meeting.description}
          </div>

          <h3 className={styles.participantsTitle}>
            {'Participants:'}
          </h3>
          <ul className={styles.participantsList}>
            {Home.participantsList(meeting.participants)}
          </ul>
        </div>
      );
    });
  }

  render(): Node {
    return (
      <div>
        <h1 className={styles.title}>
          {'Meetings'}
        </h1>

        <div>
          {Home.meetings()}
        </div>
      </div>
    );
  }
}

export default Home;
