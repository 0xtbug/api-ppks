-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 07, 2023 at 01:51 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `api_u`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `id` int(11) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `password` varchar(100) DEFAULT NULL,
  `token` varchar(200) DEFAULT NULL,
  `last_login` timestamp NULL DEFAULT current_timestamp(),
  `update_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`id`, `email`, `password`, `token`, `last_login`, `update_at`, `created_at`) VALUES
(7, 'test@gmail.com', '$2b$10$NdF4xDIxKeB7W9IYB96PceHRn0uwNimll/QsQOqMUwc.lg0HbeEAG', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAZ21haWwuY29tIiwiaWQiOjcsImlhdCI6MTY4ODcyODk4OSwiZXhwIjoxNjg4NzMyNTg5fQ.z6qU91L3iqJUkhsEJAlgKgjxuhkgjYw9UH1R6EJNeDY', '2023-07-07 11:23:09', '2023-07-06 17:06:36', '2023-07-06 17:06:36'),
(13, 'test111@gmail.com', '$2b$10$0SlgrItD4e9O1.tzaOH1ZOcFKC.xqU3aEKh89Hwm1fbRaZw1ccOOq', NULL, '2023-07-07 08:19:03', '2023-07-07 08:19:03', '2023-07-07 08:19:03');

-- --------------------------------------------------------

--
-- Table structure for table `artikel`
--

CREATE TABLE `artikel` (
  `id` int(11) NOT NULL,
  `judul` varchar(200) NOT NULL,
  `isi` varchar(1000) NOT NULL,
  `sumber` varchar(200) NOT NULL,
  `thumbnail` varchar(600) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `update_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `artikel`
--

INSERT INTO `artikel` (`id`, `judul`, `isi`, `sumber`, `thumbnail`, `created_at`, `update_at`) VALUES
(16, 'test', 'test', 'test', '1688729039486.png', '2023-07-07 11:23:59', '2023-07-07 11:23:59'),
(17, 'test', 'test', 'test', '1688729079718.png', '2023-07-07 11:24:39', '2023-07-07 11:24:39');

-- --------------------------------------------------------

--
-- Table structure for table `laporan`
--

CREATE TABLE `laporan` (
  `id` int(11) NOT NULL,
  `nama` varchar(255) NOT NULL DEFAULT '''anonymous''',
  `usia` int(2) NOT NULL,
  `npm` varchar(13) DEFAULT NULL,
  `tempat` varchar(255) NOT NULL,
  `tanggal_kejadian` date NOT NULL,
  `waktu` varchar(9) DEFAULT NULL,
  `jenis_kasus` text NOT NULL,
  `ciri_ciri_pelaku` text NOT NULL,
  `kronologi` longtext NOT NULL,
  `bukti` varchar(50) DEFAULT NULL,
  `gender` tinyint(4) NOT NULL,
  `device_id` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `laporan`
--

INSERT INTO `laporan` (`id`, `nama`, `usia`, `npm`, `tempat`, `tanggal_kejadian`, `waktu`, `jenis_kasus`, `ciri_ciri_pelaku`, `kronologi`, `bukti`, `gender`, `device_id`) VALUES
(29, 'test', 14, '1232134321543', 'test', '2023-11-02', '11:12:1', 'test', 'test', 'test', '1688729950229.png', 0, '1'),
(30, 'test', 14, '1232134321543', 'test', '2023-11-02', '11:12:1', 'test', 'test', 'test', '1688730355880.png', 0, '1');

-- --------------------------------------------------------

--
-- Table structure for table `secret_code`
--

CREATE TABLE `secret_code` (
  `id` int(11) NOT NULL,
  `code` varchar(255) DEFAULT NULL,
  `expiration_date` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `device_id` varchar(50) NOT NULL,
  `nama` text NOT NULL,
  `nomorhp` varchar(13) NOT NULL,
  `token` varchar(200) DEFAULT NULL,
  `otp` varchar(100) NOT NULL,
  `is_verified` int(11) NOT NULL DEFAULT 0,
  `is_logout` int(11) NOT NULL DEFAULT 0,
  `last_login` timestamp NULL DEFAULT current_timestamp(),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `update_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `pfp` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `device_id`, `nama`, `nomorhp`, `token`, `otp`, `is_verified`, `is_logout`, `last_login`, `created_at`, `update_at`, `pfp`) VALUES
(13, '1', 'aku', '6289650572376', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkZXZpY2VfaWQiOiIxIiwicGhvbmUiOiI2Mjg5NjUwNTcyMzc2IiwiaWF0IjoxNjg4Mjk1MDE2fQ.BiMZldoNC6_9APUFFty_DjU0lTqeG8sEG3ktzqDrAeU', '$2b$10$AT15nUikfXDxBuOeyzX.5eUi8KiXETNoguEMKqWbvFaFl63fbAOEu', 1, 0, '2023-07-07 07:39:34', '2023-07-06 05:48:09', '2023-07-06 05:48:09', '/img/1688658263006.png');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `artikel`
--
ALTER TABLE `artikel`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `laporan`
--
ALTER TABLE `laporan`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `secret_code`
--
ALTER TABLE `secret_code`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `device_id` (`device_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin`
--
ALTER TABLE `admin`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `artikel`
--
ALTER TABLE `artikel`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `laporan`
--
ALTER TABLE `laporan`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT for table `secret_code`
--
ALTER TABLE `secret_code`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
