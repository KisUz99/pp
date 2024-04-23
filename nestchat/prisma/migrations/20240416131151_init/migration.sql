-- CreateTable
CREATE TABLE "test" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "User" (
    "uid" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "id" TEXT NOT NULL,
    "user_name" TEXT NOT NULL,
    "friend_id" TEXT,
    "block_id" TEXT,
    "email" TEXT NOT NULL,
    "user_pwd" TEXT NOT NULL,
    "user_date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "room" (
    "rid" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "room_name" TEXT NOT NULL,
    "room_member_id" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "room_pwd" TEXT NOT NULL,
    "room_date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "user_chat" (
    "ucid" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "sd_uid" INTEGER NOT NULL,
    "rcv_uid" INTEGER NOT NULL,
    "uc_msg" TEXT NOT NULL,
    "uc_sd_date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "uc_ur" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "room_chat" (
    "pid" INTEGER NOT NULL,
    "rcid" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "sd_uid" INTEGER NOT NULL,
    "rc_msg" TEXT NOT NULL,
    "rc_sd_date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "rc_ur" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "chat_history" (
    "ch_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "puid" INTEGER NOT NULL,
    "chat_type" TEXT NOT NULL,
    "chat_id" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");

-- CreateIndex
CREATE UNIQUE INDEX "User_user_name_key" ON "User"("user_name");

-- CreateIndex
CREATE UNIQUE INDEX "room_room_name_key" ON "room"("room_name");
