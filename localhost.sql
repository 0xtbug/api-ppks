-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 04, 2023 at 04:40 PM
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
CREATE DATABASE IF NOT EXISTS `api_u` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `api_u`;

-- --------------------------------------------------------

--
-- Table structure for table `laporan`
--

CREATE TABLE `laporan` (
  `id` int(11) NOT NULL,
  `nama` text NOT NULL,
  `usia` int(2) NOT NULL,
  `npm` int(13) NOT NULL,
  `tempat` varchar(200) NOT NULL,
  `tanggal_kejadian` date NOT NULL,
  `waktu` time NOT NULL,
  `jenis_kasus` text NOT NULL,
  `ciri_ciri_pelaku` varchar(500) NOT NULL,
  `kronologi_kejadian` varchar(500) NOT NULL,
  `bukti` int(11) NOT NULL
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
  `token` varchar(164) DEFAULT NULL,
  `otp` varchar(100) NOT NULL,
  `last_login` timestamp NULL DEFAULT current_timestamp(),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `update_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `device_id`, `nama`, `nomorhp`, `token`, `otp`, `last_login`, `created_at`, `update_at`) VALUES
(10, '54555', 'test', '6289650572376', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkZXZpY2VfaWQiOiI1NDU1NSIsInBob25lIjoiNjI4OTY1MDU3MjM3NiIsImlhdCI6MTY4ODM3MDc2M30.XYGJEDFo2c', '$2b$10$EM4NsAvhdEFKPV4Yy/ooUOJH3u7K0NbJTzgqWemVJkoMwsnYLqLTW', '2023-07-04 03:03:52', '2023-07-04 03:03:26', '2023-07-04 03:03:26');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `laporan`
--
ALTER TABLE `laporan`
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
-- AUTO_INCREMENT for table `laporan`
--
ALTER TABLE `laporan`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
