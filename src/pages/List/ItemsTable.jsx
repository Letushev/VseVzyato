import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { withRouter } from 'react-router';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { ArrowUp, ArrowDown, ArrowRight, CloseIcon } from 'assets/icons';
import cn from 'classnames';
import styles from './styles.module.scss';

const materialStyles = () => ({
  root: {
    width: '100%',
    overflowX: 'auto',
  },
  table: {
    minWidth: 700,
  },
});

const PRIORITY = {
  LOW: (
    <div className={styles.priority}>
      Низький
      <ArrowDown
        className={cn(
          styles.priorityIcon,
          styles.low,
        )}
      />
    </div>
  ),
  MEDIUM: (
    <div className={styles.priority}>
      Середній
      <ArrowRight
        className={cn(
          styles.priorityIcon,
          styles.medium,
        )}
      />
    </div>
  ),
  HIGH: (
    <div className={styles.priority}>
      Високий
      <ArrowUp
        className={cn(
          styles.priorityIcon,
          styles.high,
        )}
      />
    </div>
  ),
};

function ItemsTable({ items, classes, membersCount, onItemDelete, history, match }) {
  console.log(items);
  return (
    <Paper className={classes.root}>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell>Елемент</TableCell>
            <TableCell>Скільки</TableCell>
            <TableCell>Хто</TableCell>
            <TableCell>Пріоритет</TableCell>
            <TableCell padding="checkbox" align="right"></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map(i => {

            let member = `${i.members.length} (учасників)`;
            if (!i.members.length) {
              member = '';
            }

            if (i.members.length === 1) {
              member = i.members[0].name;
            }

            if (i.members.length === membersCount) {
              member = 'Усі';
            }

            return (
              <TableRow
                hover
                key={i.id}
                onClick={() => history.push(`${match.url}/item/${i.id}`)}
              >
                <TableCell component="th" scope="row">
                  {i.name}
                </TableCell>
                <TableCell>{i.count}</TableCell>
                <TableCell>{member}</TableCell>
                <TableCell>{PRIORITY[i.priority]}</TableCell>
                <TableCell padding="checkbox" align="right">
                  <CloseIcon
                    className={styles.deleteItemIcon}
                    onClick={() => onItemDelete(i.id)}
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Paper>
  );
}

export default withRouter(withStyles(materialStyles)(ItemsTable));
