-- Table users
create table users (
  id bigint primary key generated always as identity,
  username text not null unique,
  email text not null unique,
  password_hash text not null,
  created_at timestamp with time zone default now(),
  last_login timestamp with time zone
);

-- Datos table users
insert into
  users (username, email, password_hash, last_login)
values
  (
    'johndoe',
    'johndoe@example.com',
    'hashed_password_1',
    '2023-10-01 10:00:00+00'
  ),
  (
    'janedoe',
    'janedoe@example.com',
    'hashed_password_2',
    '2023-10-02 11:30:00+00'
  ),
  (
    'alice',
    'alice@example.com',
    'hashed_password_3',
    '2023-10-03 09:15:00+00'
  ),
  (
    'bob',
    'bob@example.com',
    'hashed_password_4',
    '2023-10-04 14:45:00+00'
  ),
  (
    'charlie',
    'charlie@example.com',
    'hashed_password_5',
    '2023-10-05 16:20:00+00'
  );

-- Tabla de los usuarios de TOKEN
create table usertoken (
  id bigint primary key generated always as identity,
  username text not null,
  password text not null
);

-- Add a trigger to encrypt the password before insert or update
create
or replace function encrypt_password () returns trigger as $$
BEGIN
    NEW.password := crypt(NEW.password, gen_salt('bf'));
    RETURN NEW;
END;
$$ language plpgsql;

create trigger encrypt_password_trigger before insert
or
update on usertoken for each row
execute function encrypt_password ();

-- Agregado el pgcrypto
create extension if not exists pgcrypto;


-- Datos usertoken
insert into
  usertoken (username, password)
values
  ('alice', 'password123'),
  ('bob', 'securepass'),
  ('charlie', 'mypassword');