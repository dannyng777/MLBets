CREATE DATABASE mlbets_database;

CREATE TABLE userInfo(
    user_id SERIAL PRIMARY KEY,
    username VARCHAR (50) UNIQUE NOT NULL,
    password VARCHAR (100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE walletInfo(
    user_id SERIAL PRIMARY KEY,
    wallet VARCHAR (65535),
    creditcardNum VARCHAR (20) UNIQUE NOT NULL
);

CREATE TABLE history(
    user_id SERIAL PRIMARY KEY,
    winnings VARCHAR NOT NULL,
    losses VARCHAR NOT NULL,
    bets VARCHAR NOT NULL
);