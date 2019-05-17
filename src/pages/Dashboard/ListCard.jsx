import React from 'react';
import * as Avatars from 'assets/avatars';
import styles from './listCard.module.scss';

export function ListCard({ name, membersCount, itemsCount, author }) {
  const Avatar = author ? Avatars[author.avatar] : null;
  return (
    <div className={styles.card}>
      <h3 className={styles.name}>{name}</h3>
      {
        author && (
          <p className={styles.author}>
            {author.name}
            <Avatar className={styles.avatar} />
          </p>
        )
      }
      <p className={styles.info}>Учасників - {membersCount}</p>
      <p className={styles.info}>Елементів - {itemsCount}</p>
    </div>
  )
}
