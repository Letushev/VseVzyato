import React, { useState, useEffect } from 'react';
import { Mutation } from 'react-apollo'
import { Redirect } from 'react-router-dom';
import gql from 'graphql-tag'
import cn from 'classnames';
import { withRouter } from 'react-router';
import { Logo } from 'components/Logo';
import { Input } from 'components/Input';
import { Button } from 'components/Button';
import * as Avatars from 'assets/avatars';
import { ErrorIcon } from 'assets/icons';
import styles from './styles.module.scss';

const LOGIN_MUTATION = gql`
  mutation LoginMutation($nick: String!, $password: String!) {
    login(nick: $nick, password: $password) {
      token
    }
  }
`;

const SIGNUP_MUTATION = gql`
  mutation SignupMutation($nick: String!, $name: String!, $password: String!, $avatar: String!) {
    signup(nick: $nick, name: $name, password: $password, avatar: $avatar) {
      token
    }
  }
`;

const initialControl = {
  value: '',
  invalid: false,
  invalidText: null,
  validationStarted: false,
};

function AuthorizationPage(props) {
  const [isLogging, setIsLogging] = useState(true);
  const [nick, setNick] = useState(initialControl);
  const [name, setName] = useState(initialControl);
  const [password, setPassword] = useState(initialControl);
  const [avatar, setAvatar] = useState('Avatar1');
  const [errors, setErrors] = useState([]);
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    const nk = getNickValidity(nick.value);
    const nm = getNameValidity(name.value);
    const p = getPasswordValidity(password.value);
    setIsFormValid(!nk.invalid && (!nm.invalid || isLogging) && !p.invalid);
  }, [nick.value, name.value, password.value]);

  const getNickValidity = v => {
    let invalid = false;
    let invalidText = null;

    if (!v) {
      invalid = true;
      invalidText = "Обов'язково введіть нікнейм";
    } else if (v.length < 4) {
      invalid = true;
      invalidText = "Нікнейм повинен містити не менше 4 літер"
    }

    return { invalid, invalidText };
  };

  const handleNickChange = value => {
    const updatedNick = { ...nick, value };
    setNick(updatedNick);
    validateNick(updatedNick);
  }

  const handleNameChange = value => {
    const updatedName = { ...name, value };
    setName(updatedName);
    validateName(updatedName);
  };

  const startValidatingNick = () => {
    const updatedNick = { ...nick, validationStarted: true };
    setNick(updatedNick);
    validateNick(updatedNick);
  };

  const startValidatingName = () => {
    const updatedName = { ...name, validationStarted: true };
    setName(updatedName);
    validateName(updatedName);
  };

  const getNameValidity = v => {
    let invalid = false;
    let invalidText = null;

    if (!v) {
      invalid = true;
      invalidText = "Обов'язково введіть ім'я";
    } else if (v.length < 6) {
      invalid = true;
      invalidText = "Ім'я повинно містити не менше 6 літер"
    }

    return { invalid, invalidText };
  }

  const validateNick = n => {
    if (!n.validationStarted) {
      return;
    }

    setNick({
      ...n,
      ...getNickValidity(n.value),
    });
  };

  const validateName = n => {
    if (!n.validationStarted) {
      return;
    }

    setName({
      ...n,
      ...getNameValidity(n.value),
    });
  };

  const handlePasswordChange = value => {
    const updatedPassword = { ...password, value };
    setPassword(updatedPassword);
    validatePassword(updatedPassword);
  };

  const startValidatingPassword = () => {
    const updatedPassword = { ...password, validationStarted: true };
    setPassword(updatedPassword);
    validatePassword(updatedPassword);
  };

  const getPasswordValidity = v => {
    let invalid = false;
    let invalidText = null;

    if (!v) {
      invalid = true;
      invalidText = "Обов'язково введіть пароль";
    } else if (v.length < 8) {
      invalid = true;
      invalidText = "Пароль повинен містити не менше 8 знаків"
    }

    return { invalid, invalidText };
  }

  const validatePassword = p => {
    if (!p.validationStarted) {
      return;
    }

    setPassword({
      ...p,
      ...getPasswordValidity(p.value),
    });
  };

  const reset = () => {
    setNick({
      ...initialControl,
      validationStarted: nick.validationStarted,
    });

    setName({
      ...initialControl,
      validationStarted: name.validationStarted,
    });

    setPassword({
      ...initialControl,
      validationStarted: password.validationStarted,
    });

    setAvatar('Avatar1');
    setErrors([]);
  };

  const handleSuccessAuth = ({ token }) => {
    localStorage.setItem('authToken', token);
    props.history.push('/');
  }

  const isLoggedIn = !!localStorage.getItem('authToken');
  if (isLoggedIn) {
    return <Redirect to="/" />
  }

  return (
    <div className={styles.container}>
      <Logo big />
      <form className={styles.form} onSubmit={e => e.preventDefault()}>
        <div className={styles.inputWrapper}>
          <Input
            name="nick"
            value={nick.value}
            onChange={handleNickChange}
            label="Нікнейм"
            containerStyles={styles.input}
            invalid={nick.invalid}
            onAfterTouch={startValidatingNick}
          />
          {
            nick.invalidText && (
              <span className={styles.invalidText}>
                {nick.invalidText}
              </span>
            )
          }
        </div>
        <div className={styles.inputWrapper}>
          <Input
            type="password"
            name="password"
            value={password.value}
            onChange={handlePasswordChange}
            label="Пароль"
            containerStyles={styles.input}
            invalid={password.invalid}
            onAfterTouch={startValidatingPassword}
          />
          {
            password.invalidText && (
              <span className={styles.invalidText}>
                {password.invalidText}
              </span>
            )
          }
        </div>
        {
          !isLogging && (
            <>
              <div className={styles.inputWrapper}>
                <Input
                  name="name"
                  value={name.value}
                  onChange={handleNameChange}
                  label="Ім'я"
                  containerStyles={styles.input}
                  invalid={name.invalid}
                  onAfterTouch={startValidatingName}
                />
                {
                  name.invalidText && (
                    <span className={styles.invalidText}>
                      {name.invalidText}
                    </span>
                  )
                }
              </div>
              <span>Оберіть аватар</span>
              <div className={styles.avatarsContainer}>
                <div className={styles.avatarsWrapper}>
                  {
                    Object.entries(Avatars).map(([key, Svg]) => (
                      <div
                        key={key}
                        className={cn(
                          styles.avatarContainer,
                          avatar === key && styles.selected,
                        )}
                        onClick={() => setAvatar(key)}
                      >
                        <Svg className={styles.avatar} />
                      </div>
                    ))
                  }
                </div>
              </div>
            </>
          )
        }
        <Mutation
          mutation={isLogging ? LOGIN_MUTATION : SIGNUP_MUTATION}
          variables={{
            nick: nick.value.trim(),
            password: password.value,
            ...!isLogging && {
              name: name.value.trim(),
              avatar,
            }
          }}
          onCompleted={data => handleSuccessAuth(isLogging ? data.login : data.signup)}
          onError={error => setErrors(error.graphQLErrors.map(e => e.message))}
        >
          {
            auth => (
              <Button
                className={styles.button}
                big
                onClick={auth}
                disabled={!isFormValid}
              >
                {isLogging ? 'Увійти' : 'Зареєструватися'}
              </Button>
            )
          }
        </Mutation>
      </form>
      {
        isLogging
          ? (
            <div className={styles.authText}>
              {'Не маєте акаунту? '}
              <span
                className={styles.switcher}
                onClick={() => {
                  reset();
                  setIsLogging(false);
                }}
              >
                Зареєструйтеся!
              </span>
            </div>
          ) : (
            <div className={styles.authText}>
              {'Уже майєте акаунт? '}
              <span
                className={styles.switcher}
                onClick={() => {
                  reset();
                  setIsLogging(true);
                }}
              >
                Увійдіть
              </span>
            </div>
          )
      }
      {
        !!errors.length && (
          <div className={styles.errors}>
            {
              errors.map(error => (
                <div key={error} className={styles.error}>
                  <ErrorIcon className={styles.errorIcon} />
                  {error}
                </div>
              ))
            }
          </div>
        )
      }
    </div>
  );
}

export default withRouter(AuthorizationPage);
