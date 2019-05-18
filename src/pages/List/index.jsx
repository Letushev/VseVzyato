import React, { useState, useEffect } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { query } from 'api';
import { Loader } from 'components/Loader';
import { MemberIcon, DeleteIcon, AddIcon, BoxIcon } from 'assets/icons';
import { Modal } from 'components/Modal';
import { Button } from 'components/Button';
import ItemsTable from './ItemsTable';
import styles from './styles.module.scss';

const getUser = `
  query {
    user {
      id
    }
  }
`;

const listQuery = `
  query getListData($id: ID!) {
    getList(id: $id) {
      name
      createdBy {
        id
      }
      members {
        id
      }
      items {
        id
        name
        count
        priority
        members {
          name
        }
      }
    }
  }
`;

const deleteListMutation = `
  mutation deleteList($id: ID!) {
    deleteList(id: $id) {
      id
    }
  }
`;

const deleteItemMutation = `
  mutation deleteItem($id: ID!) {
    deleteItem(id: $id) {
      id
    }
  }
`;

function ListPage({ match, history }) {
  const [list, setList] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleteModalOpened, setIsDeleteModalOpened] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    Promise.all([
      query({
        query: listQuery,
        variables: {
          id: match.params.id,
        },
      }),
      query({
        query: getUser,
      }),
    ]).then(([listResp, userResp]) => {
      console.log(listResp);
      setList(listResp.data.getList);
      setUserId(userResp.data.user.id);
      setIsLoading(false);
    });
  }, []);

  const handleDeleteItem = id => {
    query({
      query: deleteItemMutation,
      variables: {
        id,
      }
    })
      .then(() => {
        const items = [...list.items].filter(i => i.id !== id);
        setList({
          ...list,
          items,
        });
      });
  };

  if (list && userId) {
    const memberIds = list.members.map(m => m.id);
    if (!memberIds.includes(userId) && list.createdBy.id !== userId) {
      return <Redirect to="/" />;
    }
  }

  if (isLoading) {
    return <Loader delay={1000} className={styles.loader} />;
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.head}>
        <h1>{list.name}</h1>
        <div>
          <Link to={`${match.url}/members`} className={styles.membersLink}>
            <MemberIcon className={styles.membersIcon} />
            Учасники
          </Link>
          {
            list.createdBy.id === userId && (
              <DeleteIcon
                className={styles.deleteListIcon}
                onClick={() => setIsDeleteModalOpened(true)}
              />
            )
          }
        </div>
      </div>
      {
        list.createdBy.id === userId && (
          <Modal
            isOpened={isDeleteModalOpened}
            title="Справді видалити цей список?"
            onClose={() => setIsDeleteModalOpened(false)}
          >
            <Button
              className={styles.deleteListButton}
              onClick={() => {
                query({
                  query: deleteListMutation,
                  variables: {
                    id: match.params.id,
                  },
                }).then(() => {
                  history.push('/');
                });
              }}
            >
              ТАК
            </Button>
          </Modal>
        )
      }
      <Link
        className={styles.addButton}
        title="Додати елемент"
        to={`${match.url}/new-element`}
      >
        <AddIcon />
      </Link>
      {
        !list.items.length
          ? (
            <div className={styles.noItems}>
              <BoxIcon className={styles.noItemsIcon} />
              <p>Список наразі порожній. <br /> Додайте нові елементи.</p>
            </div>
          )
          : (
            <ItemsTable
              items={list.items}
              membersCount={list.members.length}
              onItemDelete={handleDeleteItem}
            />
          )
      }
    </div>
  );
}

export default ListPage;
