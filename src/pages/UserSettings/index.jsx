import React, { useState, useEffect, useRef } from 'react';
import { query } from 'api';
import cn from 'classnames';
import * as Avatars from 'assets/avatars';
import { Input } from 'components/Input';
import { Button } from 'components/Button';
import { Modal } from 'components/Modal';
import styles from './styles.module.scss';

const getProfileData = `
  query getProfileData {
    user {
      nick
      name
      avatar
    }
  }
`;

const editUser = `
  mutation editUser($name: String, $avatar: String) {
    editUser(name: $name, avatar: $avatar) {
      nick
      name
      avatar
    }
  }
`;

function UserSettingsPage() {
  const [user, setUser] = useState(null);
  const initialUser = useRef(null);
  const [isChangingAvatar, setIsChangingAvatar] = useState(false);
  const [proposeToSave, setProposeToSave] = useState(false);


  useEffect(() => {
    if (!user) {
      return;
    }

    if (user.name !== initialUser.current.name || user.avatar !== initialUser.current.avatar) {
      setProposeToSave(true);
    } else {
      setProposeToSave(false);
    }
  });

  useEffect(() => {
    query({ query: getProfileData })
      .then(({ data }) => {
        setUser(data.user);
        initialUser.current = data.user;
      });
  }, []);

  if (!user) {
    return null;
  }

  const Avatar = Avatars[user.avatar];

  return (
    <div className={styles.wrapper}>
      <Avatar className={styles.avatar} />
      <span
        className={styles.changeAvatar}
        onClick={() => setIsChangingAvatar(true)}
      >
        Змінити аватар
      </span>
      <Modal
        isOpened={isChangingAvatar}
        onOutsideClick={() => setIsChangingAvatar(false)}
      >
        <div className={styles.modalAvatars}>
          {
            Object.entries(Avatars).map(([key, Avatar]) => (
              <Avatar
                key={key}
                className={styles.modalAvatar}
                onClick={() => {
                  setUser({ ...user, avatar: key });
                  setIsChangingAvatar(false);
                }}
              />
            ))
          }
        </div>
      </Modal>

      <p className={styles.nick}>{user.nick}</p>

      <Input
        label="Ім'я"
        value={user.name}
        onChange={v => setUser({ ...user, name: v })}
      />

      <div className={cn(
        styles.savePropose,
        proposeToSave && styles.activePropose,
      )}>
        <Button
          className={styles.proposeButton}
          onClick={() => {
            query({
              query: editUser,
              variables: {
                name: user.name,
                avatar: user.avatar,
              }
            })
              .then(() => {
                initialUser.current = user;
                setProposeToSave(false);
              })
          }}
        >
          Зберегти
        </Button>
        <Button
          className={styles.proposeButton}
          negative
          onClick={() => setUser(initialUser.current)}
        >
          Скасувати
        </Button>
      </div>
    </div>
  )
}

export default UserSettingsPage;
