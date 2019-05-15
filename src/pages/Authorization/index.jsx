import React, { useState } from 'react';
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import cn from 'classnames';
import { Logo } from 'components/Logo';
import { Input } from 'components/Input';
import { Button } from 'components/Button';
import * as Avatars from 'assets/avatars';
import styles from './styles.module.scss';

const LOGIN_MUTATION = gql`
  mutation LoginMutation($name: String!, $password: String!) {
    login(name: $name, password: $password) {
      token
    }
  }
`;

const SIGNUP_MUTATION = gql`
  mutation SignupMutation($name: String!, $password: String!, $avatar: String!) {
    signup(name: $name, password: $password, avatar: $avatar) {
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

export function AuthorizationPage() {
  const [isLogging, setIsLogging] = useState(true);

  const [name, setName] = useState(initialControl);

  const [password, setPassword] = useState(initialControl);

  const [avatar, setAvatar] = useState('Avatar1');

  const handleNameChange = value => {
    const updatedName = { ...name, value };
    setName(updatedName);
    validateName(updatedName);
  };

  const startValidatingName = () => {
    const updatedName = { ...name, validationStarted: true };
    setName(updatedName);
    validateName(updatedName);
  };

  const validateName = n => {
    if (!n.validationStarted) {
      return;
    }

    let invalid = false;
    let invalidText = null;

    if (!n.value) {
      invalid = true;
      invalidText = "Обов'язково введіть ім'я";
    } else if (n.value.length < 6) {
      invalid = true;
      invalidText = "Ім'я повинно містити не менше 6 літер"
    }

    setName({
      ...n,
      invalid,
      invalidText,
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

  const validatePassword = p => {
    if (!p.validationStarted) {
      return;
    }

    let invalid = false;
    let invalidText = null;

    if (!p.value) {
      invalid = true;
      invalidText = "Обов'язково введіть пароль";
    } else if (p.value.length < 8) {
      invalid = true;
      invalidText = "Пароль повинен містити не менше 8 знаків"
    }

    setPassword({
      ...p,
      invalid,
      invalidText,
    });
  };

  const isFormValid = () => {
    if (
      name.invalid
      || !name.validationStarted
      || password.invalid
      || !password.validationStarted
    ) {
      return false;
    }

    return true;
  };

  const reset = () => {
    setName({
      ...initialControl,
      validationStarted: name.validationStarted,
    });

    setPassword({
      ...initialControl,
      validationStarted: password.validationStarted,
    });

    setAvatar('Avatar1');
  };

  return (
    <div className={styles.container}>
      <Logo />
      <form className={styles.form} onSubmit={e => e.preventDefault()}>
        <div className={styles.inputWrapper}>
          <Input
            name="name"
            value={name.value}
            onChange={handleNameChange}
            label="Ім'я"
            containerStyles={styles.input}
            invalid={name.invalid}
            startValidating={startValidatingName}
          />
          {
            name.invalidText && (
              <span className={styles.invalidText}>
                {name.invalidText}
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
            startValidating={startValidatingPassword}
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
              <span>Оберіть аватар</span>
              <div className={styles.avatarsContainer}>
                <div className={styles.avatarsWrapper}>
                  {
                    Object.entries(Avatars).map(([key, Svg]) => (
                      <Svg
                        key={key}
                        className={cn(
                          styles.avatar,
                          avatar === key && styles.selected,
                        )}
                        onClick={() => setAvatar(key)}
                      />
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
            name: name.value,
            password: password.value,
            ...!isLogging && {
              avatar
            }
          }}
          onCompleted={data => console.log(data)}
          onError={error => {}}
        >
          {
            auth => (
              <Button
                className={styles.button}
                big
                onClick={auth}
                disabled={!isFormValid()}
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
    </div>
  );
}
