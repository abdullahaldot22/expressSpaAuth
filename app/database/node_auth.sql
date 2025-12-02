-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: mysql
-- Generation Time: Dec 02, 2025 at 04:11 PM
-- Server version: 8.4.7
-- PHP Version: 8.2.29

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `node_auth`
--

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` bigint NOT NULL,
  `name` varchar(250) NOT NULL,
  `category_name` varchar(250) NOT NULL,
  `price` float NOT NULL,
  `description` text,
  `status` tinyint NOT NULL,
  `creator_id` bigint DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `name`, `category_name`, `price`, `description`, `status`, `creator_id`, `created_at`, `updated_at`) VALUES
(1, 'Seven Hat', 'Clothing', 12.5, 'This is a description', 10, 7, '2025-12-02 20:12:31', '2025-12-02 22:04:14'),
(2, 'Black 80s Hat TES', 'Cloth', 12.5001, 'this is a description', 5, 7, '2025-12-02 20:20:40', '2025-12-02 22:10:19');

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `id` bigint NOT NULL,
  `user_id` bigint UNSIGNED NOT NULL,
  `name` varchar(220) NOT NULL,
  `token` varchar(250) NOT NULL,
  `created_at` timestamp NOT NULL,
  `expires_at` timestamp NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `sessions`
--

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint NOT NULL,
  `name` varchar(250) NOT NULL,
  `email` varchar(250) DEFAULT NULL,
  `phone` varchar(250) DEFAULT NULL,
  `password` varchar(250) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `phone`, `password`, `created_at`, `updated_at`) VALUES
(1, 'ONew', 'aW@b.com', '012345678945', '1234567', '2025-11-28 17:25:18', '2025-11-28 17:25:18'),
(2, 'Test User One', 'a@g.com', '124541', '$2b$10$bzlcLm3un6GE5gmMEADfqeN.5zATDrbp.GM0IMrnYNAa87qwOVAEK', '2025-11-29 12:15:00', NULL),
(3, 'User One', 'two@user.com', '7845112751231', '$2b$10$4W1nSBA7JVtw16Nwmi2mW.5HDIQe8zFUpqN3tbmTHUgD.7u6t894W', '2025-11-29 14:47:28', NULL),
(4, 'User Two', 'one@user.com', '12345679897445', '$2b$10$qkM4Dijla6qk/bu.C5Ii8uuU4Fh/R8t/FkHSHtiE4oKVxZBK/oUIW', '2025-11-29 14:48:49', NULL),
(5, 'Alif Mahmud', 'a@b.com', '4587415216', '$2b$10$xb6HSGjqrEmWN.BeCyrSDeToamv0Z.eznK/2qYAHxE/WQ1bmhTd9q', '2025-12-01 08:29:03', NULL),
(6, 'Alif Mahmud', 'a@m.com', '4587415216', '$2b$10$Zd.Mj/s6yDAPOzXm1l43VugO7Msu8uwrKWo0FmEDTnymipGNHcK/q', '2025-12-01 08:31:16', NULL),
(7, 'Alif Mahmud', 'alif@b.com', '4587415216', '$2b$10$LkoEI7HPp2LE1p3WlewdGuatO60pOLUPz0dBoEfx7Qc0nH4r/7yBy', '2025-12-01 08:32:02', NULL),
(8, 'One two', 'c@d.com', '4587415216', '$2b$10$t4IovIcq0DyvCN4tfk4TrOYeSLs7VyHCPjG4c1f5DCGC5Gqwg5hRC', '2025-12-01 08:36:32', NULL),
(9, 'Alif Mahmud', 'alif@e.com', '4587415216', '$2b$10$YlTw5RHaqvPGI80GebyFX.AvITGebkNWfzcBMt9jSqysxMOW1Qyhq', '2025-12-01 08:40:09', NULL),
(10, 'Alif Mahmud', 'alif@f.com', '4587415216', '$2b$10$n/Sg4O.s7NolAxWfpPP6T.gGd0udq7lzXZB.cQHiasYVt919zvgb2', '2025-12-01 08:40:42', NULL),
(11, 'Alif Mahmud', 'alif@g.com', '4587415216', '$2b$10$UcUZb026f12LDnT/v9zc2e4yhQkZZ38fI6CQziKwEa6ajXicfvKVa', '2025-12-01 08:42:19', NULL),
(12, 'Alif Mahmud', 'alif@h.com', '4587415216', '$2b$10$Kn9l0vTr8WKhSOPnaaVr1OsOI.OmhRK01vhRn4QRd4CsjVv5YMRlS', '2025-12-01 08:43:14', NULL),
(13, 'Alif Mahmud', 'alif@i.com', '4587415216', '$2b$10$mx7swxJ8pdTzeXKRg1y14uXun1Ls9IQjNop37gcL3lN9rLiMx7mbK', '2025-12-01 08:55:16', NULL),
(14, 'Alif Mahmud', 'alif@j.com', '4587415216', '$2b$10$u6L.P.K5Ci9jgYn2vAd5x.BL9yPdMwwFE71ZMi/Nu/jGyHfea7Tte', '2025-12-01 08:57:04', NULL),
(15, 'Alif Mahmud', 'alif@k.com', '4587415216', '$2b$10$Zkey64oy6rR0K9uqWLBcl.gL8ttXvHTlw0m.j4.V1v.rlZlYU73F6', '2025-12-01 08:58:14', NULL),
(16, 'Alif Mahmud', 'alif@l.com', '4587415216', '$2b$10$UIBTc83JwoLc0c1JdKHl8OTS7M.rI4FCX5Pw2gnmALxLkVDJjEGGW', '2025-12-01 09:03:31', NULL),
(17, 'Alif Mahmud', 'alif@m.com', '4587415216', '$2b$10$O175RzyOrtmQd4JD5tPFdeCIC901ozR51z.7foVDOioUhSAQ6PBqi', '2025-12-01 09:06:31', NULL),
(18, 'Alif Mahmud', 'alif@n.com', '4587415216', '$2b$10$.HcP2pQxZtkIYNwMNujsY.rUyqUhEEVONUcd8B.K2VVfd4supRHfO', '2025-12-01 09:07:16', NULL),
(19, 'Alif Mahmud', 'alif@0.com', '4587415216', '$2b$10$XFojAZbOd.7mIHzqEP/dbu3lxqxhD6Hp1jWexRNwukQl6kca6eI02', '2025-12-01 09:07:43', NULL),
(20, 'Alif Mahmud', 'alif@p.com', '4587415216', '$2b$10$pfOJDoH61DCWa3uiwk0WWuApD2IK.qb7snczEhdwc1BJscv1SwiYC', '2025-12-01 09:08:35', NULL),
(21, 'Alif Mahmud', 'alif@q.com', '4587415216', '$2b$10$God8b2efWncvdGYlninn9el2e0s7QXklwvZRK08ogSdryipoGZxLy', '2025-12-01 09:09:03', NULL),
(22, 'Alif Mahmud', 'alif@r.com', '4587415216', '$2b$10$Y1S/a1mRPleaDQv3S40weO7quu3EwAwpnAD7bfHFoM/U.vfF3MFva', '2025-12-01 09:19:04', NULL),
(23, 'Alif Mahmud', 'alif@s.com', '4587415216', '$2b$10$LPFyKW8A3.ZuJXBvIUpgY.hdao/4gAutvXELP.DG32ZMVDwqqMR2u', '2025-12-01 09:24:06', NULL),
(24, 'Alif Mahmud', 'alif@t.com', '4587415216', '$2b$10$Cd2O5vxfe9q0dYtbIzCTAuA7CWlZreNlXv1EHFu57fyLO61aQhVca', '2025-12-01 09:37:50', NULL),
(25, 'Alif Mahmud', 'alif@u.com', '4587415216', '$2b$10$YDaC97n5ku9EwDUv/yI..eF8sKC9Ix.TmVo0duZCWR2RaaP4rFsCa', '2025-12-01 09:44:15', NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD KEY `created_user_id` (`creator_id`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `sessions`
--
ALTER TABLE `sessions`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `created_user_id` FOREIGN KEY (`creator_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
