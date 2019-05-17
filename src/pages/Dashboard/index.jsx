import React, { useState, useEffect } from 'react';
import { query } from 'api';
import { ListIcon, MemberIcon, BoxIcon, TeamIcon } from 'assets/icons';
import cn from 'classnames';
import { Loader } from 'components/Loader';
import { Button } from 'components/Button';
import { Modal } from 'components/Modal';
import { Input } from 'components/Input';
import { ListCard } from './ListCard';
import styles from './styles.module.scss';

const listsQuery = `
  query DashboardLists {
    getLists {
      id
      name
      members {
        id
      }
      items {
        id
      }
    }
    getMemberLists {
      id
      name
      createdBy {
        avatar
        name
      }
      members {
        id
      }
      items {
        id
      }
    }
  }
`;

const newListMutation = `
  mutation createNewList($name: String!) {
    createList(name: $name) {
      id
      name
      members {
        id
      }
      items {
        id
      }
    }
  }
`;

const LISTS_TYPE = {
  MY: 'MY',
  MEMBER: 'MEMBER',
}

export function DashboardPage() {
  const [activeListsType, setActiveListsType] = useState(LISTS_TYPE.MY);
  const [lists, setLists] = useState({
    myLists: [],
    memberLists: [],
  });
  const [isLodaing, setIsLoading] = useState(true);
  const [isCreatingList, setIsCreatingList] = useState(false);
  const [newList, setNewList] = useState('');

  useEffect(() => {
    query({ query: listsQuery })
      .then(({ data }) => {
        setIsLoading(false);
        setLists({
          myLists: data.getLists,
          memberLists: data.getMemberLists,
        });
      });
  }, []);

  let heading = 'Мої списки';
  if (activeListsType === LISTS_TYPE.MEMBER) {
    heading = 'Учасник списків';
  }

  let mainBlock = null;
  if (isLodaing) {
    mainBlock = <Loader delay={1000} className={styles.loader} />;
  } else if (activeListsType === LISTS_TYPE.MY) {
    if (!lists.myLists.length) {
      mainBlock = (
        <div className={styles.emptyBlock}>
          <BoxIcon className={styles.emptyIcon} />
          <p className={styles.emptyText}>Списки наразі відсутні.<br />Спробуйте створити новий.</p>
        </div>
      );
    } else {
      mainBlock = (
        <div className={styles.listContainer}>
          {
            lists.myLists.map(l => (
              <ListCard
                key={l.id}
                name={l.name}
                membersCount={l.members.length}
                itemsCount={l.items.length}
              />
            ))
          }
        </div>
      );
    }
  } else {
    if (!lists.memberLists.length) {
      mainBlock = (
        <div className={styles.emptyBlock}>
          <TeamIcon className={styles.emptyIcon} />
          <p className={styles.emptyText}>Наразі вас не запрошено до жодного списку.</p>
        </div>
      );
    } else {
      mainBlock = (
        <div className={styles.listContainer}>
          {
            lists.memberLists.map(l => (
              <ListCard
                key={l.id}
                name={l.name}
                membersCount={l.members.length}
                itemsCount={l.items.length}
                author={l.createdBy}
              />
            ))
          }
        </div>
      );
    }
  }

  return (
    <div className={styles.wrapper}>
      <aside>
        <ul className={styles.sidebarList}>
          <li
            className={cn(
              styles.listItem,
              activeListsType === LISTS_TYPE.MY && styles.activeListItem,
            )}
            onClick={() => setActiveListsType(LISTS_TYPE.MY)}
          >
            <ListIcon className={styles.listIcon} />
            Мої списки
          </li>
          <li
            className={cn(
              styles.listItem,
              activeListsType === LISTS_TYPE.MEMBER && styles.activeListItem,
            )}
            onClick={() => setActiveListsType(LISTS_TYPE.MEMBER)}
          >
            <MemberIcon className={styles.listIcon} />
            Учасник списків
          </li>
        </ul>
      </aside>
      <section className={styles.mainBlock}>
        <header className={styles.header}>
          <h1>{heading}</h1>
          {
            activeListsType === LISTS_TYPE.MY && (
              <Button onClick={() => setIsCreatingList(true)}>
                Створити список
              </Button>
            )
          }
        </header>
        {mainBlock}
      </section>
      <Modal
        isOpened={isCreatingList}
        onClose={() => {
          setIsCreatingList(false);
          setNewList('');
        }}
        title="Новий список"
      >
        <Input
          value={newList}
          onChange={v => setNewList(v)}
          simple
          placeholder="Назва"
          containerStyles={styles.newListInput}
        />
        <div className={styles.newListButtons}>
          <Button
            asText
            onClick={() => {
              setIsCreatingList(false);
              setNewList('');
            }}
          >
            Скасувати
          </Button>
          <Button
            onClick={() => {
              query({
                query: newListMutation,
                variables: {
                  name: newList.trim(),
                },
              }).then(({ data }) => {
                const newLists = {
                  memberLists: lists.memberLists,
                  myLists: [
                    ...lists.myLists,
                    data.createList
                  ],
                };
                setLists(newLists);
              });
              setIsCreatingList(false);
            }}
          >
            Створити
          </Button>
        </div>
      </Modal>
    </div>
  )
}
