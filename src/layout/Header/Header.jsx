import React, { useState } from 'react';
import { Logo } from 'components/Logo';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';
import cn from 'classnames';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import * as Avatars from 'assets/avatars';
import { DownIcon } from 'assets/icons';
import styles from './styles.module.scss';

const getUserProfileInfo = gql`
  query getUserProfileInfo {
    user {
      name
      avatar
    }
  }
`;

function Header(props) {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  return (
    <header className={styles.header}>
      <Link className={styles.logo} to="/"><Logo /></Link>
      <Query query={getUserProfileInfo}>
        {({ loading, error, data }) => {
          if (loading) return null;
          const { name, avatar } = data.user;
          const Avatar = Avatars[avatar];
          return (
            <div
              className={styles.profile}
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            >
              <Avatar className={styles.avatar} />
              <span className={styles.userName}>{name}</span>
              <DownIcon className={cn(
                styles.dropdownIcon,
                profileDropdownOpen && styles.activeDropdownIcon,
              )} />
            </div>
          )
        }}
      </Query>
      {
        profileDropdownOpen && (
          <div className={styles.profileDropdown}>
            <Link
              className={styles.profileDropdownLink}
              to="/user-settings"
              onClick={() => setProfileDropdownOpen(false)}
            >
              Налаштування
            </Link>
            <div
              className={styles.profileDropdownLink}
              onClick={() => {
                localStorage.removeItem('authToken');
                props.history.push('/auth');
              }}
            >
              Вийти
            </div>
          </div>
        )
      }
    </header>
  );
}


export default withRouter(Header);
