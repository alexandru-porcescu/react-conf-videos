import { faBolt } from '@fortawesome/free-solid-svg-icons/faBolt';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as cn from 'classnames';
import * as React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { ApplicationState } from 'redux/modules';
import { sluggifyUrl } from 'utils';
import { Conference, Presenter, Video as VideoProp } from '../../domain';

import styles from './Video.scss';

type Props = {
  videoId: string;
  conferenceId: string;
  isOpen: boolean;
  toggleIsOpen: (e: string | null) => void;
};

type ReduxState = {
  conferenceId: string;
  conference: Conference;
  speaker: Presenter;
  video: VideoProp;
};

type CombinedProps = Props & ReduxState;

export const VideoInner: React.FunctionComponent<CombinedProps> = ({
  video: { title, length, embeddableLink, lightning = false },
  speaker,
  videoId,
  conference,
  isOpen,
  toggleIsOpen,
  conferenceId
}) => {
  return (
    <div className={styles.root} key={videoId}>
      <h3 className={styles.heading}>
        <button
          id={`accordion-${videoId}`}
          className={styles.top}
          onClick={() => toggleIsOpen(!isOpen ? videoId : null)}
          aria-expanded={isOpen}
          aria-controls={`content-${videoId}`}
        >
          <span className={styles.title}>
            {lightning && <FontAwesomeIcon icon={faBolt} color="#f5de1a" />}{' '}
            {title}
          </span>
          <span className={styles.right}>{length}</span>
        </button>
      </h3>
      <div
        id={`content-${videoId}`}
        aria-labelledby={`accordion-${videoId}`}
        className={cn(styles.videoWrapper, { [styles.open]: isOpen })}
        aria-hidden={!isOpen}
      >
        {isOpen && (
          <iframe
            title="videoPlayer"
            id="ytplayer"
            width="410"
            height="360"
            src={embeddableLink}
            frameBorder="0"
            allowFullScreen={true}
          />
        )}
      </div>
      <div className={styles.details}>
        <span>{speaker.name}</span>
        <Link
          to={`/conference/${sluggifyUrl(conference.title)}`}
          aria-label={`See all videos for conference ${conference.title}`}
        >
          <span className={styles.conferenceTitle}>{conference.title}</span>
        </Link>
      </div>
    </div>
  );
};

const mapStateToProps = (state: ApplicationState, props: Props) => {
  const {
    data: { videos, presenters, conferences }
  } = state;
  const { videoId, conferenceId } = props;
  const video = videos[videoId];
  const conference = conferences[conferenceId];
  const speaker = presenters[video.presenter];
  return {
    conferenceId,
    conference,
    speaker,
    video
  };
};

export const Video = connect(mapStateToProps)(React.memo(VideoInner));
