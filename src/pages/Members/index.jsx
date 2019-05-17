import React, { useState, useEffect } from 'react';
import { query } from 'api';
import { Input } from 'components/Input';
import * as Avatars from 'assets/avatars';
import { Loader } from 'components/Loader';
import { Button } from 'components/Button';
import { CloseIcon } from 'assets/icons';
import styles from './styles.module.scss';

const getMembers = `
  query getMembers($id: ID!) {
    getList(id: $id) {
      members {
        id
        nick
        name
        avatar
      }
    }
  }
`;

const inviteMember = `
  mutation inviteMember($nick: String!, $listId: ID!) {
    inviteUser(nick: $nick, listId: $listId) {
      id
      nick
      name
      avatar
    }
  }
`;

const refuseMember = `
  mutation refuseMember($nick: String!, $listId: ID!) {
    refuseUser(nick: $nick, listId: $listId) {
      id
      nick
      name
      avatar
    }
  }
`;

function MembersPage({ match }) {
  const [members, setMembers] = useState(null);
  const [memberToAdd, setMemberToAdd] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    if (!memberToAdd) {
      setIsValid(false);
    } else {
      setIsValid(true);
    }
  }, [memberToAdd]);

  useEffect(() => {
    query({
      query: getMembers,
      variables: {
        id: match.params.id,
      },
    }).then(({ data }) => {
      setMembers(data.getList.members);
      setIsLoading(false);
    });
  }, []);

  const invite = () => {
    query({
      query: inviteMember,
      variables: {
        nick: memberToAdd.trim(),
        listId: match.params.id,
      },
    })
      .then(({ data, errors }) => {
        if (errors) {
          setErrors(errors.map(e => e.message));
          return;
        }

        setErrors([]);
        const ids = members.map(m => m.id);
        if (!ids.includes(data.inviteUser.id)) {
          setMembers([
            ...members,
            data.inviteUser,
          ]);
        }
      })
  }

  if (isLoading || !members) {
    return <Loader className={styles.loader} delay={1000} />
  }

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.heading}>Учасники</h1>
      <Input
        value={memberToAdd}
        onChange={v => setMemberToAdd(v)}
        label="Нікнейм"
      />
      <Button
        className={styles.addButton}
        onClick={() => invite()}
        disabled={!isValid}
      >
        ДОДАТИ УЧАСНИКА
      </Button>
      {
        !!errors.length && errors.map(e => (
          <p
            key={e}
            className={styles.error}
          >
            &times; {e}
          </p>
        ))
      }
      {
        !!members.length
          ? (
            <ul className={styles.members}>
              {
                members.map(m => {
                  const Avatar = Avatars[m.avatar];
                  return (
                    <li
                      key={m.id}
                      className={styles.member}
                    >
                      <Avatar className={styles.avatar} />
                      {m.name}
                      <CloseIcon
                        className={styles.deleteIcon}
                        onClick={() => {
                          query({
                            query: refuseMember,
                            variables: {
                              nick: m.nick,
                              listId: match.params.id,
                            },
                          }).then(() => {
                            setMembers([...members].filter(_m => _m.id !== m.id));
                          });
                        }}
                      />
                    </li>
                  )
                })
              }
            </ul>
          )
          : (
            <p className={styles.empty}>Учасники відсутні...</p>
          )
      }
    </div>
  );
}

export default MembersPage;
