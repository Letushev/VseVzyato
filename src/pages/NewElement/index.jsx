import React, { useState, useEffect } from 'react';
import { Input } from 'components/Input';
import cn from 'classnames';
import { query } from 'api';
import { getMembers } from 'pages/Members';
import * as Avatars from 'assets/avatars';
import { Button } from 'components/Button';
import Checkbox from '@material-ui/core/Checkbox';
import styles from './styles.module.scss';

const addMutation = `
  mutation createItem($name: String!, $count: String, $listId: String!, $priority: Priority!, $members: [String!]) {
    createItem(name: $name, count: $count, listId: $listId, priority: $priority, members: $members) {
      id
      name
      members {
        name
      }
    }
  }
`;

function NewElementPage(props) {
  const [name, setName] = useState('');
  const [count, setCount] = useState('');
  const [priorities, setPriorities] = useState([
    {
      label: 'Низький',
      value: 'LOW',
      selected: false,
      style: styles.low,
    },
    {
      label: 'Середній',
      value: 'MEDIUM',
      selected: true,
      style: styles.medium,
    },
    {
      label: 'Високий',
      value: 'HIGH',
      selected: false,
      style: styles.high,
    },
  ]);

  const [isAllValid, setIsAllValid] = useState(false);
  const [members, setMembers] = useState([]);

  useEffect(() => {
    let isValid = true;

    if (!name) {
      isValid = false;
    }

    setIsAllValid(isValid);
  }, [name]);

  useEffect(() => {
    query({
      query: getMembers,
      variables: {
        id: props.match.params.id,
      }
    })
      .then(({ data }) => {
        setMembers(data.getList.members.map(m => {
          m.checked = false;
          return m;
        }));
      });
  }, []);

  const changePriority = v => {
    const updated = [...priorities].map(p => {
      if (p.value === v) {
        return { ...p, selected: true };
      } else {
        return { ...p, selected: false };
      }
    });
    setPriorities(updated);
  }

  const checkMember = (id, isChecked) => {
    const mems = members.map(m => {
      if (m.id === id) {
        return {
          ...m,
          checked: isChecked,
        }
      } else {
        return { ...m };
      }
    });
    setMembers(mems);
  };

  const allMembersCheck = (checked) => {
    setMembers(members.map(m => ({ ...m, checked: checked })));
  }

  const add = () => {
    query({
      query: addMutation,
      variables: {
        name: name.trim(),
        count: count.trim(),
        listId: props.match.params.id,
        priority: priorities.find(p => p.selected).value,
        members: members.filter(m => m.checked).map(m => m.id),
      }
    })
      .then(() => props.history.push(`/lists/${props.match.params.id}`))
  }

  return (
    <div className={styles.wrapper}>
      <h1>Новий елемент</h1>
      <form onSubmit={e => e.preventDefault()}>
        <Input
          name="name"
          value={name}
          onChange={setName}
          label="Назва*"
          containerStyles={styles.input}
        />
        <Input
          name="count"
          value={count}
          onChange={setCount}
          label="Скільки"
          containerStyles={styles.input}
        />
        <p className={styles.controlName}>Пріоритет</p>
        <div className={styles.priorities}>
          {
            priorities.map(p => (
              <React.Fragment key={p.value}>
                <input className={styles.radio} type="radio" name="priority" value={p.value} id={p.value} />
                <label
                  htmlFor={p.value}
                  onClick={() => changePriority(p.value)}
                  className={cn(
                    styles.priority,
                    p.selected && p.style,
                  )}
                >
                  {p.label}
                </label>
              </React.Fragment>
            ))
          }
        </div>
        <p className={styles.controlName}>Учасники</p>
        {
          members && (
            <>
               <div className={styles.member}>
                <Checkbox
                  id='all'
                  checked={members.every(m => m.checked)}
                  onChange={(_, checked) => allMembersCheck(checked)}
                />
                <label
                  className={styles.memberName}
                  htmlFor='all'
                >
                  Усі
                </label>
              </div>
              {
                members.map(m => {
                  const Avatar = Avatars[m.avatar];
                  return (
                    <div className={styles.member} key={m.id}>
                      <Checkbox
                        id={m.id}
                        checked={m.checked}
                        onChange={(_, checked) => checkMember(m.id, checked)}
                      />
                      <label
                        className={styles.memberName}
                        htmlFor={m.id}
                      >
                        <Avatar className={styles.avatar} />
                        {m.name}
                      </label>
                    </div>
                  );
                })
              }
            </>
          )
        }
        <Button
          className={styles.addButton}
          disabled={!isAllValid}
          onClick={add}
        >
          ДОДАТИ
        </Button>
      </form>
    </div>
  )
}

export default NewElementPage;
