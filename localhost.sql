-- phpMyAdmin SQL Dump
-- version 4.9.5deb2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Jul 03, 2023 at 04:59 PM
-- Server version: 10.3.38-MariaDB-0ubuntu0.20.04.1
-- PHP Version: 7.4.3-4ubuntu2.18

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
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
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `device_id` varchar(50) NOT NULL,
  `nama` text NOT NULL,
  `nomorhp` varchar(13) NOT NULL,
  `is_verified` int(11) NOT NULL DEFAULT 0,
  `token` varchar(131) DEFAULT NULL,
  `otp` varchar(100) NOT NULL,
  `last_login` timestamp NULL DEFAULT current_timestamp(),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `update_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `device_id`, `nama`, `nomorhp`, `is_verified`, `token`, `otp`, `last_login`, `created_at`, `update_at`) VALUES
(5, '1', 'test', '6289650572376', 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkZXZpY2VJZCI6IjEiLCJpYXQiOjE2ODgzNDIzMTd9.p6hncDWl6jaeppkeTjte6v7oMZmnU3pfCYYX8MmrE1E', '$2b$10$gztHRfrtr2A65FWZay4pzeyWK9546CQ9jkSvD10Ktw1uaGTr/FRTq', '2023-07-02 20:19:21', '2023-07-02 19:44:41', '2023-07-02 19:44:41'),
(7, '2', 'test', '6285947737725', 1, NULL, '$2b$10$QUFynlOqt7quIIJdX5C4a.c3hVc/mHKAGu/bUxEV10zVNm.DzBxlm', '2023-07-02 20:19:25', '2023-07-02 19:45:26', '2023-07-02 19:45:26');

--
-- Indexes for dumped tables
--

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
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
