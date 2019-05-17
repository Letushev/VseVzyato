import React, { useState, useEffect } from 'react';
import { Logo } from 'components/Logo';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';
import cn from 'classnames';
import { query } from 'api';
import * as Avatars from 'assets/avatars';
import { DownIcon } from 'assets/icons';
import styles from './styles.module.scss';

const getUserProfileInfo = `
  query getUserProfileInfo {
    user {
      name
      avatar
    }
  }
`;

function Header(props) {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    query({
      query: getUserProfileInfo,
    })
      .then(({ data }) => {
        setUser(data.user);
      });
  }, []);

  const Avatar = user ? Avatars[user.avatar] : null;

  return (
    <header className={styles.header}>
      <Link className={styles.logo} to="/"><Logo /></Link>
      {
        user && (
          <div
            className={styles.profile}
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
          >
            <Avatar className={styles.avatar} />
            <span className={styles.userName}>{user.name}</span>
            <DownIcon className={cn(
              styles.dropdownIcon,
              profileDropdownOpen && styles.activeDropdownIcon,
            )} />
          </div>
        )
      }
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
