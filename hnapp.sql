-- create user 'dbuser'@'localhost' identified by 'password';
-- grant all on hnapp.* to 'dbuser'@'localhost';
-- use hnapp;

create table users (
    username varchar(16) not null,
    password_hash char(128) not null,
    salt char(32) not null,
    primary key (username)
);

create table bookmarks (
    username varchar(16) not null,
    id integer not null,
    unique (username, id)
);
