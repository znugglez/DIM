import React from 'react';
import clsx from 'clsx';
import styles from './RichNotes.m.scss';

export function RichNotes({ notes }: { notes: string }) {
  return (
    <>
      {notes.split(/(#\w+)/g).map((segment) => (
        <>
          {segment.startsWith('#') ? (
            <span className={getHashtagClass(segment)}>{segment}</span>
          ) : (
            segment
          )}
        </>
      ))}
    </>
  );
}

function getHashtagClass(hashtag: string) {
  const pve = hashtag.includes('pve');
  const pvp = hashtag.includes('pvp');
  return clsx({ [styles.pvp]: pvp, [styles.pve]: pve });
}
